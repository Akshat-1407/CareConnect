import os
from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent

# Load environment variables from .env
load_dotenv(BASE_DIR / '.env')

SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', 'django-insecure-careconnect-mvp-secret-key-phase1')
DEBUG = os.getenv('DEBUG', 'True') == 'True'
ALLOWED_HOSTS = [host.strip() for host in os.getenv('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',') if host.strip()]

INSTALLED_APPS = [
    'daphne',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third-party packages
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    'corsheaders',
    'channels',

    # CareConnect apps
    'apps.accounts',
    'apps.doctors',
    'apps.appointments',
    'apps.consultations',
    'apps.prescriptions',
    'apps.payments',
]

# Override token_blacklist migrations for TiDB distributed DDL compatibility
MIGRATION_MODULES = {
    'token_blacklist': 'apps.token_blacklist_migrations',
}

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
]

# Use whitenoise in production (or if installed locally)
try:
    import whitenoise
    MIDDLEWARE.append('whitenoise.middleware.WhiteNoiseMiddleware')
except ImportError:
    pass

MIDDLEWARE.extend([
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
])

# CORS and CSRF Settings
CORS_ALLOWED_ORIGINS = [
    origin.strip() for origin in os.getenv(
        'CORS_ALLOWED_ORIGINS', 'http://localhost:3000,http://127.0.0.1:3000'
    ).split(',') if origin.strip()
]
CORS_ALLOW_CREDENTIALS = True

CSRF_TRUSTED_ORIGINS = [
    origin.strip() for origin in os.getenv(
        'CSRF_TRUSTED_ORIGINS', 'http://localhost:3000,http://127.0.0.1:3000'
    ).split(',') if origin.strip()
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'
ASGI_APPLICATION = 'config.asgi.application'

def _get_ssl_options(host='', force_ssl=False):
    """
    TiDB Cloud Serverless and other managed MySQL providers require SSL/TLS encryption.
    Automatically attach CA certificates using certifi when connecting to TiDB Cloud or
    when force_ssl is requested.
    """
    use_ssl = force_ssl or ('tidbcloud.com' in host.lower())
    if not use_ssl:
        return {}

    try:
        import certifi
        ca_path = certifi.where()
        if os.path.exists(ca_path):
            return {'ssl': {'ca': ca_path}}
    except Exception:
        pass

    import ssl
    return {'ssl': ssl.create_default_context()}


# Database Configuration (MySQL as primary, SQLite fallback if needed)
DB_ENGINE = os.getenv('DB_ENGINE', 'mysql')
DATABASE_URL = os.getenv('TIDB_URL') or os.getenv('MYSQL_URL') or os.getenv('DATABASE_URL')

if DATABASE_URL:
    # Parse TiDB Cloud / cloud MySQL connection URL (e.g., mysql://user:password@host:port/database)
    import urllib.parse
    url = urllib.parse.urlparse(DATABASE_URL)
    db_host = url.hostname or ''
    db_port = str(url.port or (4000 if 'tidbcloud.com' in db_host.lower() else 3306))
    db_name = url.path.lstrip('/').split('?')[0] or 'test'
    db_user = urllib.parse.unquote(url.username or '')
    db_password = urllib.parse.unquote(url.password or '')
    force_ssl = ('ssl' in url.query.lower()) or (os.getenv('DB_SSL', '').lower() in ('true', '1', 'yes'))

    options = {
        'charset': 'utf8mb4',
        'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
    }
    options.update(_get_ssl_options(host=db_host, force_ssl=force_ssl))

    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': db_name,
            'USER': db_user,
            'PASSWORD': db_password,
            'HOST': db_host,
            'PORT': db_port,
            'OPTIONS': options,
        }
    }
elif DB_ENGINE == 'mysql':
    db_host = os.getenv('DB_HOST', '127.0.0.1')
    db_port = os.getenv('DB_PORT', '4000' if 'tidbcloud.com' in db_host.lower() else '3306')
    db_name = os.getenv('DB_NAME', 'careconnect')
    db_user = os.getenv('DB_USER', 'root')
    db_password = os.getenv('DB_PASSWORD', '')
    force_ssl = os.getenv('DB_SSL', '').lower() in ('true', '1', 'yes')

    options = {
        'charset': 'utf8mb4',
        'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
    }
    options.update(_get_ssl_options(host=db_host, force_ssl=force_ssl))

    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': db_name,
            'USER': db_user,
            'PASSWORD': db_password,
            'HOST': db_host,
            'PORT': db_port,
            'OPTIONS': options,
        }
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

# Channels In-Memory layer (development MVP)
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels.layers.InMemoryChannelLayer',
    },
}

# REST Framework Configuration
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'apps.accounts.authentication.CookieJWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files configuration
STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

try:
    import whitenoise
    STORAGES = {
        "staticfiles": {
            "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
        },
    }
except ImportError:
    pass

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Custom user model
AUTH_USER_MODEL = 'accounts.User'

# JWT & Cookie configuration
# In production (DEBUG=False), cookies are set to Secure + SameSite=None
# for cross-origin requests between Vercel frontend and Render backend.
# Locally (DEBUG=True), cookies use SameSite=Lax without Secure flag.
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=15),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'AUTH_COOKIE': 'access_token',
    'AUTH_COOKIE_REFRESH': 'refresh_token',
    'AUTH_COOKIE_SECURE': not DEBUG,
    'AUTH_COOKIE_SAMESITE': 'None' if not DEBUG else 'Lax',
    'ACCESS_TOKEN_COOKIE_MAX_AGE': 60 * 15,         # 15 minutes in seconds
    'REFRESH_TOKEN_COOKIE_MAX_AGE': 60 * 60 * 24,   # 24 hours in seconds
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
}

# Razorpay Configuration
RAZORPAY_KEY_ID = os.getenv('RAZORPAY_KEY_ID', 'rzp_test_placeholder')
RAZORPAY_KEY_SECRET = os.getenv('RAZORPAY_KEY_SECRET', 'rzp_secret_placeholder')
