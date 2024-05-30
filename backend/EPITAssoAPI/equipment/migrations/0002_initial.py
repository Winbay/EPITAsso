# Generated by Django 5.0.4 on 2024-05-30 21:48

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('association', '0003_initial'),
        ('equipment', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='equipment',
            name='borrower_resp',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='borrowed_equipment', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='equipment',
            name='owner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='owned_equipment', to='association.association'),
        ),
        migrations.AddField(
            model_name='equipment',
            name='owner_resp',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='owned_equipment', to=settings.AUTH_USER_MODEL),
        ),
    ]
