from django.db import models


class Association(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255)
    content = models.TextField()
    logo = models.TextField(null=True, blank=True)

    location = models.CharField(max_length=255)  # TODO change for an enum of location ?

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
    association = models.ForeignKey("association.Association", on_delete=models.CASCADE, related_name='faqs')
    id = models.BigAutoField(primary_key=True)
    question = models.TextField()
    answer = models.TextField()

    def __str__(self):
        return self.question
