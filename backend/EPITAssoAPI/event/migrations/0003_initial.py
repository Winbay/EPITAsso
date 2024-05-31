# Generated by Django 5.0.4 on 2024-05-30 21:48

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("event", "0002_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name="event",
            name="staff_members",
            field=models.ManyToManyField(
                related_name="events_staff", to=settings.AUTH_USER_MODEL
            ),
        ),
        migrations.AddField(
            model_name="event",
            name="event_sheet",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.PROTECT, to="event.eventsheet"
            ),
        ),
        migrations.AddField(
            model_name="event",
            name="tasks",
            field=models.ManyToManyField(
                blank=True, related_name="events", to="event.eventtasklist"
            ),
        ),
    ]
