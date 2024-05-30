import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    id = models.UUIDField(primary_key=True, unique=True, editable=False, blank=False, null=False, default=uuid.uuid4)
    login = models.CharField(max_length=255, unique=True)
    school = models.CharField(max_length=255)
    microsoft_id = models.CharField(max_length=255, blank=True, null=True)

    favorite_associations = models.ManyToManyField(
        "association.Association", related_name="favorited_by_user", blank=True
    )

    is_custom_admin = models.BooleanField(default=False)

    def str(self):
        return self.login

