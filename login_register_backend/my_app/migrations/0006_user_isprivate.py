# Generated by Django 5.0.6 on 2024-08-19 13:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0005_user_isverified'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='isPrivate',
            field=models.BooleanField(default=False),
        ),
    ]
