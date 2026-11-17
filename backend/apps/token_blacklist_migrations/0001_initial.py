from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        # Safely clean up any broken/partial tables created during previous failed migrations
        migrations.RunSQL(
            sql="DROP TABLE IF EXISTS token_blacklist_blacklistedtoken;",
            reverse_sql="",
        ),
        migrations.RunSQL(
            sql="DROP TABLE IF EXISTS token_blacklist_outstandingtoken;",
            reverse_sql="",
        ),
        migrations.CreateModel(
            name='OutstandingToken',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('jti', models.CharField(max_length=255, unique=True)),
                ('token', models.TextField()),
                ('created_at', models.DateTimeField(blank=True, null=True)),
                ('expires_at', models.DateTimeField()),
                (
                    'user',
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                'verbose_name': 'Outstanding Token',
                'verbose_name_plural': 'Outstanding Tokens',
                'ordering': ('user',),
            },
        ),
        migrations.CreateModel(
            name='BlacklistedToken',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('blacklisted_at', models.DateTimeField(auto_now_add=True)),
                (
                    'token',
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        to='token_blacklist.outstandingtoken',
                    ),
                ),
            ],
            options={
                'verbose_name': 'Blacklisted Token',
                'verbose_name_plural': 'Blacklisted Tokens',
            },
        ),
    ]
