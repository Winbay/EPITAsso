# Generated by Django 5.0.4 on 2024-09-09 14:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('association', '0002_faq_squashed_0004_rename_url_socialnetwork_link'),
    ]

    operations = [
        migrations.AddField(
            model_name='association',
            name='webhook',
            field=models.URLField(blank=True, default=''),
        ),
    ]
