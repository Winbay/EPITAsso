from django.db import models


class Conversation(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255)
    associations = models.ManyToManyField(
        "association.Association", related_name="conversations"
    )

    last_sent_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Message(models.Model):
    id = models.BigAutoField(primary_key=True)
    conversation = models.ForeignKey(
        Conversation, on_delete=models.CASCADE, related_name="messages"
    )
    content = models.TextField()
    author = models.ForeignKey(
        "user.User", on_delete=models.SET_NULL, null=True, related_name="messages"
    )
    association_sender = models.ForeignKey(
        "association.Association",
        on_delete=models.SET_NULL,
        null=True,
        related_name="messages",
    )

    sent_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-sent_at"]

    def __str__(self):
        return self.content
