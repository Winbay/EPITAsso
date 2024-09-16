from django.db import models
from django.utils.text import slugify


class Association(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255)
    slug = models.CharField(max_length=255, unique=True, blank=True)
    category = models.CharField(max_length=255, default="", blank=True)
    content = models.TextField()
    logo = models.ImageField(upload_to="logos/", null=True, blank=True, max_length=255)
    webhook = models.URLField(default="", blank=True)
    location = models.CharField(max_length=255)  # TODO change for an enum of location ?

    NORMAL = "Normal"
    BDE = "BDE"
    ADMIN = "Admin"

    ASSOCIATION_TYPE_CHOICES = [
        (NORMAL, "Normal"),
        (BDE, "BDE"),
        (ADMIN, "Admin"),
    ]

    type = models.CharField(
        max_length=10,
        choices=ASSOCIATION_TYPE_CHOICES,
        default=NORMAL,
    )

    def save(self, *args, **kwargs):
        if not self.slug:
            super().save(*args, **kwargs)
            self.slug = slugify(f"{self.name}")
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class AssociateUserAndAssociation(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey("user.User", on_delete=models.CASCADE)
    association = models.ForeignKey("association.Association", on_delete=models.CASCADE)
    role = models.CharField(max_length=255)  # TODO change for an enum of role ?

    def __str__(self):
        return f"{self.user} is a member of {self.association} with role {self.role}."


class Faq(models.Model):
    id = models.BigAutoField(primary_key=True)
    association = models.ForeignKey(
        "association.Association", on_delete=models.CASCADE, related_name="faqs"
    )
    question = models.TextField()
    answer = models.TextField()

    def __str__(self):
        return self.question


class SocialNetwork(models.Model):
    id = models.BigAutoField(primary_key=True)
    association = models.ForeignKey(
        "association.Association",
        on_delete=models.CASCADE,
        related_name="social_networks",
    )
    name = models.CharField(max_length=255)
    link = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.name} of {self.link} for {self.association}."
