from django.db import models

class Association(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255)

    logo = models.ForeignKey('post.Image', on_delete=models.PROTECT)

    description = models.ForeignKey('post.Post', on_delete=models.PROTECT)

    location = models.CharField(max_length=255) # TODO change for an enum of location ?

    members = models.ManyToManyField('user.User', related_name='part_of_association', blank=True)

    def __str__(self):
        return self.name
