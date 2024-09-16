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


# Call as "Member"
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


class Commitment(models.Model):
    id = models.BigAutoField(primary_key=True)
    association = models.ForeignKey("association.Association", on_delete=models.CASCADE)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()

    def save(self, *args, **kwargs):
        if self.start_date > self.end_date:
            raise ValueError("Start date must be before end date.")
        super().save(*args, **kwargs)

        if self.association:
            members = AssociateUserAndAssociation.objects.filter(
                association=self.association
            )
            for member in members:
                MemberCommitment.objects.create(
                    member=member,
                    commitment=self,
                    hours=0,
                )

    def __str__(self):
        return f"{self.association} has a commitment from {self.start_date} to {self.end_date}."


class MemberCommitment(models.Model):
    id = models.BigAutoField(primary_key=True)
    member = models.ForeignKey(
        "association.AssociateUserAndAssociation", on_delete=models.CASCADE
    )
    hours = models.IntegerField()
    commitment = models.ForeignKey("association.Commitment", on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.member} has a commitment of {self.hours} hours for {self.commitment}."
