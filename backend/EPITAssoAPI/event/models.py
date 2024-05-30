from django.db import models


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

    def str(self):
        return f"{self.name} on {self.date}"

class Tag(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255)
    text_color = models.CharField(max_length=7, blank=True, null=True)
    background_color = models.CharField(max_length=7, blank=True, null=True)

    def __str__(self):
        return self.name


class EventTaskList(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255)
    status = models.BooleanField(default=False)


class Event(models.Model):
    id = models.BigAutoField(primary_key=True)
    author = models.ForeignKey(
        "user.User", on_delete=models.SET_NULL, null=True, related_name="events_authored"
    )
    name = models.CharField(max_length=255)
    content = models.TextField()

    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    end_recurrence = models.DateTimeField()

    recurrent = models.BooleanField(default=False)
    frequency = models.IntegerField(default=0)
    tags = models.ManyToManyField(Tag, blank=True)

    association = models.ForeignKey(
        "association.Association", on_delete=models.SET_NULL, null=True
    )
    places_number = models.IntegerField(default=0)
    notes = models.TextField(blank=True, null=True)
    staff_members = models.ManyToManyField("user.User", related_name="events_staff", blank=True)
    other_associations = models.ManyToManyField(
        "association.Association", related_name="related_events", blank=True
    )
    tasks = models.ManyToManyField(EventTaskList, related_name="events", blank=True)

    def str(self):
        return self.name
