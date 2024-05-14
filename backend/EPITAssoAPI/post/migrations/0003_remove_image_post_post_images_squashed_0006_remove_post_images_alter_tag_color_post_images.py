# Generated by Django 5.0.4 on 2024-05-14 20:59

from django.db import migrations, models


class Migration(migrations.Migration):

    replaces = [('post', '0003_remove_image_post_post_images'), ('post', '0004_alter_post_images'), ('post', '0005_alter_post_tags'), ('post', '0006_remove_post_images_alter_tag_color_post_images')]

    dependencies = [
        ('post', '0002_remove_post_images_image_post'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='image',
            name='post',
        ),
        migrations.AlterField(
            model_name='post',
            name='tags',
            field=models.ManyToManyField(blank=True, to='post.tag'),
        ),
        migrations.AlterField(
            model_name='tag',
            name='color',
            field=models.CharField(blank=True, max_length=7, null=True),
        ),
        migrations.AddField(
            model_name='post',
            name='images',
            field=models.ManyToManyField(blank=True, to='post.image'),
        ),
    ]
