# Automatically initialize ROS node when API app is loaded
from . import robot_controller

robot_controller.init_ros()
