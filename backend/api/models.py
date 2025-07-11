from django.db import models

# Create your models here.
from django.db import models

class Position(models.Model):
    name = models.CharField(max_length=100, unique=True)
    timestamp = models.DateTimeField(auto_now=True)
    shoulder_pan_joint = models.FloatField()
    shoulder_lift_joint = models.FloatField()
    elbow_joint = models.FloatField()
    wrist_1_joint = models.FloatField()
    wrist_2_joint = models.FloatField()
    wrist_3_joint = models.FloatField()

    def __str__(self):
        return self.name
