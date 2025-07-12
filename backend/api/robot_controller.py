try:
    import rospy
    from trajectory_msgs.msg import JointTrajectory, JointTrajectoryPoint
    ROS_AVAILABLE = True
except ImportError:
    print("⚠ ROS not available — running in MOCK MODE")
    ROS_AVAILABLE = False

joint_names = [
    'shoulder_pan_joint', 'shoulder_lift_joint', 'elbow_joint',
    'wrist_1_joint', 'wrist_2_joint', 'wrist_3_joint'
]

DEFAULT_POS = [0.0099, -2.6362, -1.0097, -1.0738, -1.6555, -0.0925]

pub = None  # ROS publisher

def init_ros():
    """Initialize ROS node and publisher if available."""
    global pub
    if not ROS_AVAILABLE:
        return
    if pub is None:
        if not rospy.core.is_initialized():
            rospy.init_node('robocop_node', anonymous=True, disable_signals=True)
        pub = rospy.Publisher('/scaled_pos_joint_traj_controller/command', JointTrajectory, queue_size=10)
        rospy.sleep(1)
        rospy.loginfo("✅ ROS node initialized and publisher ready.")

def send_positions(positions, duration=5.0, speed_factor=1.0):
    """Send joint positions to robot via ROS."""
    if not ROS_AVAILABLE:
        print(f"⚠ MOCK MODE: Would send positions {positions} over {duration/speed_factor:.2f}s")
        return
    init_ros()
    traj = JointTrajectory()
    traj.joint_names = joint_names
    point = JointTrajectoryPoint()
    point.positions = positions
    point.time_from_start = rospy.Duration(duration / speed_factor)
    traj.points = [point]
    pub.publish(traj)
    rospy.loginfo(f"✅ Moving robot to {positions} over {duration/speed_factor:.2f} seconds.")

def move_robot(data):
    """Main function to process move command."""
    positions = data.get('positions', DEFAULT_POS)
    duration = data.get('duration', 5.0)
    speed = data.get('speed', 1.0)
    send_positions(positions, duration, speed)
    return "Robot move command processed."

def emergency_stop():
    """Send robot to default safe position."""
    send_positions(DEFAULT_POS, 5.0, 1.0)
    return "Emergency stop triggered. Robot moved to default."

def get_status():
    return {
        "connected": ROS_AVAILABLE,
        "status": "idle",  
        "mode": "mock" if not ROS_AVAILABLE else "live",
        "error": None
    }

    return status
