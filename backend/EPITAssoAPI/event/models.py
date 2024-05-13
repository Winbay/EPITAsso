from django.db import models


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

    def str(self):
        return f"{self.name} on {self.date}"


class EventTaskList(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255)
    status = models.BooleanField(default=False)


class Event(models.Model):
    id = models.BigAutoField(primary_key=True)
    association = models.ForeignKey(
        "association.Association", on_delete=models.SET_NULL, null=True
    )
    name = models.CharField(max_length=255)

    description = models.ForeignKey("post.Post", on_delete=models.PROTECT)

    event_sheet = models.ForeignKey(EventSheet, on_delete=models.PROTECT)
    date = models.DateField()
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    places_number = models.IntegerField()
    notes = models.TextField(blank=True, null=True)

    staff_members = models.ManyToManyField("user.User", related_name="events_staff")
    other_associations = models.ManyToManyField(
        "association.Association", related_name="related_events", blank=True
    )

    tasks = models.ManyToManyField(EventTaskList, related_name="events", blank=True)

    def str(self):
        return self.name
