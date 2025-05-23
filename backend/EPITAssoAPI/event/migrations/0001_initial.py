# Generated by Django 5.0.4 on 2024-07-14 13:50

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("association", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="EventSheet",
            fields=[
                ("id", models.BigAutoField(primary_key=True, serialize=False)),
                ("name", models.CharField(max_length=255)),
                ("date", models.DateField()),
                ("start_date", models.DateField()),
                ("end_date", models.DateField()),
                ("recurrence", models.BooleanField(default=False)),
                ("resp", models.CharField(max_length=255)),
                ("tutor", models.CharField(max_length=255)),
                ("students_number", models.IntegerField()),
                ("members_number", models.IntegerField()),
                ("externals_number", models.IntegerField()),
                ("public_liability", models.BooleanField(default=False)),
                ("place", models.CharField(max_length=255)),
                (
                    "rooms_provided",
                    models.CharField(blank=True, max_length=255, null=True),
                ),
                (
                    "present_equipments",
                    models.CharField(blank=True, max_length=255, null=True),
                ),
                ("drinks", models.CharField(blank=True, max_length=255, null=True)),
                ("special_comments", models.TextField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name="EventTaskList",
            fields=[
                ("id", models.BigAutoField(primary_key=True, serialize=False)),
                ("name", models.CharField(max_length=255)),
                ("status", models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name="Event",
            fields=[
                ("id", models.BigAutoField(primary_key=True, serialize=False)),
                ("name", models.CharField(max_length=255)),
                ("content", models.TextField()),
                ("start_date", models.DateTimeField()),
                ("end_date", models.DateTimeField()),
                ("end_recurrence", models.DateTimeField()),
                ("recurrent", models.BooleanField(default=False)),
                ("frequency", models.IntegerField(default=0)),
                ("places_number", models.IntegerField(default=0)),
                ("notes", models.TextField(blank=True, null=True)),
                (
                    "association",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to="association.association",
                    ),
                ),
            ],
        ),
    ]
