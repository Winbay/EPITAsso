from django.db import migrations, models
from django.utils.text import slugify


def generate_slug_for_existing_associations(apps, schema_editor):
    Association = apps.get_model("association", "Association")
    for association in Association.objects.all():
        association.slug = slugify(f"{association.name}-{association.id}")
        association.save()


class Migration(migrations.Migration):
    dependencies = [
        ("association", "0003_association_webhook"),
    ]

    operations = [
        migrations.AddField(
            model_name="association",
            name="slug",
            field=models.CharField(max_length=255, unique=True, blank=True),
        ),
        migrations.RunPython(generate_slug_for_existing_associations),
        migrations.AddField(
            model_name="association",
            name="type",
            field=models.CharField(
                choices=[("Normal", "Normal"), ("BDE", "BDE"), ("Admin", "Admin")],
                default="Normal",
                max_length=10,
            ),
        ),
        migrations.AddField(
            model_name="association",
            name="category",
            field=models.CharField(default="", max_length=255, blank=True),
        ),
    ]
