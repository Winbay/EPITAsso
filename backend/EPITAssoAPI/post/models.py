from django.db import models
from django.conf import settings


class Tag(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255)
    color = models.CharField(max_length=7, blank=True, null=True)  # Hexadecimal color

    def __str__(self):
        return self.name


class Image(models.Model):
    id = models.BigAutoField(primary_key=True)
    link = models.TextField()  # Replace by "URLField" from Django ?

    def __str__(self):
        return self.link


class Post(models.Model):
    id = models.BigAutoField(primary_key=True)
    title = models.CharField(max_length=255)
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="author_post",
    )
    last_author = models.ForeignKey(
        "user.User",
        on_delete=models.SET_NULL,
        null=True,
        related_name="last_author_post",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    content = models.TextField()
    tags = models.ManyToManyField(Tag, blank=True)
    images = models.ManyToManyField(Image, blank=True)

    def __str__(self):
        return self.title
