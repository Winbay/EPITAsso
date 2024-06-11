from django.db import models


class Equipment(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255)

    owner = models.ForeignKey(
        "association.Association",
        on_delete=models.CASCADE,
        related_name="owned_equipment",
    )
    borrower = models.ForeignKey(
        "association.Association",
        on_delete=models.SET_NULL,
        null=True,
        related_name="borrowed_equipment",
    )

    borrowing_date = models.DateField()
    due_date = models.DateField()

    owner_resp = models.ForeignKey(
        "user.User",
        on_delete=models.SET_NULL,
        null=True,
        related_name="owned_equipment",
    )
    borrower_resp = models.ForeignKey(
        "user.User",
        on_delete=models.SET_NULL,
        null=True,
        related_name="borrowed_equipment",
    )

    quantity = models.IntegerField(default=1)

    def str(self):
        return self.name
