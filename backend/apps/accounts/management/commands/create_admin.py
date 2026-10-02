from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()


class Command(BaseCommand):
    help = "Creates an admin user with role='admin' if it does not already exist."

    def add_arguments(self, parser):
        parser.add_argument('--username', type=str, default='admin', help='Admin username')
        parser.add_argument('--email', type=str, default='admin@careconnect.com', help='Admin email')
        parser.add_argument('--password', type=str, default='AdminPass123!', help='Admin password')

    def handle(self, *args, **options):
        username = options['username']
        email = options['email']
        password = options['password']

        if User.objects.filter(username=username).exists():
            self.stdout.write(self.style.WARNING(f"User '{username}' already exists. Updating role to 'admin'."))
            user = User.objects.get(username=username)
            user.role = User.Role.ADMIN
            user.is_staff = True
            user.is_superuser = True
            user.save()
            self.stdout.write(self.style.SUCCESS(f"User '{username}' is now an Admin."))
        else:
            user = User.objects.create_superuser(
                username=username,
                email=email,
                password=password,
                role=User.Role.ADMIN,
            )
            self.stdout.write(self.style.SUCCESS(
                f"Admin user created successfully!\nUsername: {username}\nRole: admin"
            ))
