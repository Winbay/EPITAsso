from django.db import models

from association.models import AssociateUserAndAssociation


# Not used right now
class EventSheet(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255)
    date = models.DateField()
    start_date = models.DateField()
    end_date = models.DateField()
    recurrence = models.BooleanField(default=False)
    resp = models.CharField(max_length=255)  # Responsible person
    tutor = models.CharField(max_length=255)
    students_number = models.IntegerField()
    members_number = models.IntegerField()
    externals_number = models.IntegerField()

    public_liability = models.BooleanField(default=False)  # Public liability insurance

    place = models.CharField(max_length=255)
    rooms_provided = models.CharField(max_length=255, blank=True, null=True)
    present_equipments = models.CharField(max_length=255, blank=True, null=True)
    drinks = models.CharField(max_length=255, blank=True, null=True)
    special_comments = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.name} on {self.date}"


class EventTaskList(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255)
    status = models.BooleanField(default=False)


class Event(models.Model):
    id = models.BigAutoField(primary_key=True)
    author = models.ForeignKey(
        "user.User",
        on_delete=models.SET_NULL,
        null=True,
        related_name="events_authored",
    )
    name = models.CharField(max_length=255)
    content = models.TextField()

    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    end_recurrence = models.DateTimeField()

    recurrent = models.BooleanField(default=False)
    frequency = models.IntegerField(default=0)
    tags = models.ManyToManyField("post.Tag", blank=True)

    association = models.ForeignKey(
        "association.Association", on_delete=models.SET_NULL, null=True
    )
    places_number = models.IntegerField(default=0)
    notes = models.TextField(blank=True, null=True)
    staff_members = models.ManyToManyField(
        "user.User", related_name="events_staff", blank=True
    )
    other_associations = models.ManyToManyField(
        "association.Association", related_name="related_events", blank=True
    )
    tasks = models.ManyToManyField(EventTaskList, related_name="events", blank=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        if self.association:
            members = AssociateUserAndAssociation.objects.filter(
                association=self.association
            )
            for member in members:
                EventMemberCommitment.objects.create(
                    member=member,
                    event=self,
                    hours=0,
                )


class EventMemberCommitment(models.Model):
    id = models.BigAutoField(primary_key=True)
    member = models.ForeignKey(
        "association.AssociateUserAndAssociation",
        on_delete=models.CASCADE,
        related_name="event_commitments",
    )
    event = models.ForeignKey(
        Event, on_delete=models.CASCADE, related_name="members_commitments"
    )
    hours = models.IntegerField()

    def __str__(self):
        return f"{self.member} committed to {self.event} for {self.hours} hours."
