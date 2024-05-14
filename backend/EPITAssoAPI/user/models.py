from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    login = models.CharField(max_length=255, unique=True)
    school = models.CharField(max_length=255)

    favorite_associations = models.ManyToManyField(
        "association.Association", related_name="favorited_by_user", blank=True
    )

    is_custom_admin = models.BooleanField(default=False)

    def str(self):
        return self.login

    class Meta(AbstractUser.Meta):
        swappable = "AUTH_USER_MODEL"
