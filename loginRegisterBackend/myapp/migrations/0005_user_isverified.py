# Generated by Django 5.0.6 on 2024-07-02 20:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0004_alter_user_contactinfo'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='isVerified',
            field=models.BooleanField(default=False),
        ),
    ]
