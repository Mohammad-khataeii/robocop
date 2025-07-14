import time

try:
    import rospy
    from trajectory_msgs.msg import JointTrajectory, JointTrajectoryPoint
    from sensor_msgs.msg import JointState
    ROS_AVAILABLE = True
except ImportError:
    print("⚠ ROS not available — running in MOCK MODE")
    ROS_AVAILABLE = False

# ========================
# Updated joint names to match GLB nodes
# ========================
joint_names = [
    'Shoulder_7',      # shoulder_pan_joint
    'Elbow_6',         # shoulder_lift_joint
    'Wrist01_5',       # elbow_joint
    'Wrist02_4',       # wrist_1_joint
    'Wrist03_3'        # wrist_2_joint
    # Optional: 'EffectorJoint_2'  # wrist_3_joint, if you want to control it
]

DEFAULT_POS = [0.0099, -2.6362, -1.0097, -1.0738, -1.6555]
pub = None
latest_joint_states = dict(zip(joint_names, DEFAULT_POS))
saved_positions = {}
logs = []

# ========================
# Logging utility
# ========================
def log_message(msg):
    timestamp = time.strftime('%Y-%m-%d %H:%M:%S')
    full_msg = f"[{timestamp}] {msg}"
    print(full_msg)
    logs.append(full_msg)
    if len(logs) > 500:
        logs.pop(0)

# ========================
# ROS setup
# ========================
def joint_state_callback(msg):
    global latest_joint_states
    for name, position in zip(msg.name, msg.position):
        latest_joint_states[name] = position

def init_ros():
    global pub
    if not ROS_AVAILABLE:
        return
    if pub is None:
        if not rospy.core.is_initialized():
            rospy.init_node('robocop_node', anonymous=True, disable_signals=True)
        pub = rospy.Publisher('/scaled_pos_joint_traj_controller/command', JointTrajectory, queue_size=10)
        rospy.Subscriber('/joint_states', JointState, joint_state_callback)
        rospy.sleep(1)
        log_message("✅ ROS initialized, robot moved to default position.")
        send_positions(DEFAULT_POS, 5.0, 1.0)

def send_positions(positions, duration=5.0, speed_factor=1.0):
    global latest_joint_states

    if not ROS_AVAILABLE:
        # ✅ MOCK MODE: simulate updating joint positions
        for i, joint in enumerate(joint_names):
            latest_joint_states[joint] = positions[i]
        log_message(f"⚠ MOCK MODE: Updated mock joint states to {latest_joint_states}")
        log_message(f"⚠ MOCK MODE: Would move to {positions} over {duration/speed_factor:.2f}s")
        return

    init_ros()
    traj = JointTrajectory()
    traj.joint_names = joint_names
    point = JointTrajectoryPoint()
    point.positions = positions
    point.time_from_start = rospy.Duration(duration / speed_factor)
    traj.points = [point]
    pub.publish(traj)
    log_message(f"✅ Moving robot to {positions} over {duration/speed_factor:.2f}s")

def get_current_position():
    return {joint: latest_joint_states.get(joint, 0.0) for joint in joint_names}

# ========================
# Public API functions
# ========================
def get_status():
    return {
        "connected": ROS_AVAILABLE,
        "status": "idle",
        "mode": "mock" if not ROS_AVAILABLE else "live",
        "current_position": get_current_position(),
        "error": None
    }

def move_robot(data):
    positions = data.get('positions', DEFAULT_POS)
    duration = data.get('duration', 5.0)
    speed = data.get('speed', 1.0)
    log_message(f"Moving to positions: {positions}")
    send_positions(positions, duration, speed)

def emergency_stop():
    send_positions(DEFAULT_POS, 5.0, 1.0)

def get_logs():
    return logs

def clear_logs():
    logs.clear()
    log_message("Logs cleared by user")

def get_saved_positions():
    return saved_positions

def save_position(name, positions):
    saved_positions[name] = positions
    log_message(f"Position saved: {name} -> {positions}")

def update_position(name, positions):
    if name in saved_positions:
        saved_positions[name] = positions
        log_message(f"Position updated: {name} -> {positions}")

def delete_position(name):
    if name in saved_positions:
        del saved_positions[name]
        log_message(f"Position deleted: {name}")
