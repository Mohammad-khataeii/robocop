# Placeholder — extend later for real ROS subscriber
robot_status = {
    "connected": True,
    "mode": "idle",
    "error": None,
    "last_updated": None
}

def update_status(new_status):
    global robot_status
    robot_status.update(new_status)

def get_current_status():
    return robot_status
