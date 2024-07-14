from django.db import models

# Create your models here.
class Image(models.Model):
    id = models.AutoField(primary_key=True)
    image = models.ImageField(upload_to='images')
    caption = models.CharField(max_length=255, blank=True, null=True)
    association = models.ForeignKey('association.Association', on_delete=models.CASCADE, related_name='association_image')

    def __str__(self):
        return self.image.url