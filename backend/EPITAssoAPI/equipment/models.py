from django.db import models


class EquipmentRequest(models.Model):
    id = models.AutoField(primary_key=True)
    user_respo_owner = models.ForeignKey(
        "user.User",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="equipment_owner_requests",
    )
    asso_borrower = models.ForeignKey(
        "association.Association",
        on_delete=models.CASCADE,
        related_name="borrowed_equipment_requests",
    )
    user_respo_borrower = models.ForeignKey(
        "user.User",
        on_delete=models.SET_NULL,
        null=True,
        related_name="borrower_requests",
    )
    borrowing_date = models.IntegerField()
    due_date = models.IntegerField()
    status = models.CharField(
        max_length=20,
        choices=[
            ("waiting", "Waiting"),
            ("accepted", "Accepted"),
            ("refused", "Refused"),
        ],
    )
    comment = models.TextField(blank=True)

    equipment_id = models.IntegerField(default=0)
    equipment_name = models.CharField(max_length=255, default="")

    def __str__(self):
        return f"Request ID: {self.id}"


class Equipment(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    asso_owner = models.ForeignKey("association.Association", on_delete=models.CASCADE)
    quantity = models.IntegerField()
    equipment_request = models.OneToOneField(
        EquipmentRequest,
        on_delete=models.SET_NULL,
        null=True,
        related_name="equipment",
        blank=True,
    )
    photo = models.ImageField(upload_to="equipments/", blank=True, null=True, max_length=255)

    def __str__(self):
        return self.name
