# 🤖 RoboCop

RoboCop is a web-based control panel for UR3/UR3e robots, combining:

- Django backend with ROS integration or mock simulation  
- React frontend with a live 3D robot viewer (GLB model + joint animation)  
- CLI tool for easy startup and robot connection  
- Programmable movement flows & saved positions

---

## 🚀 Features

✅ Real-time robot control via web UI  
✅ 3D viewer with animated joints (using UR3e `.glb` model)  
✅ Program Movement panel: create multi-step position flows  
✅ Saved positions system (edit, update, delete, apply)  
✅ Mock mode for testing without ROS/hardware  
✅ Soft limits & collision avoidance placeholders (settings ready)  
✅ CLI runner for unified backend/frontend/ROS startup

---

## ⚙️ How to Install

1️⃣ Clone the repository:

```bash
git clone https://github.com/yourusername/robocop.git
cd robocop
```

2️⃣ Set up Python virtual environment:

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

3️⃣ Install frontend dependencies:

```bash
cd ../frontend
npm install
```

4️⃣ Install the CLI system-wide:

```bash
cd ../cli
pip3 install -e .
```

---

## ⚙️ Required ROS Setup

✅ Before using RoboCop, configure your ROS system:

- Provide **calibration YAML files** in `~/catkin_ws/` (kinematics configs)

Example:

```
my_robot_calibration.yaml
my1_robot_calibration.yaml
```

- Provide a **proper UR3/UR3e .glb model** in:

```
frontend/public/models/ur3e1.glb
```

I recommend a rigged `.glb` with nodes like:

```
Shoulder_7, Elbow_6, Wrist01_5, Wrist02_4, Wrist03_3
```

---

## 🚀 How to Run

✅ Start backend and frontend together:

```bash
robocop run
```

✅ Start backend, frontend, **and** ROS stack (Linux only):

```bash
robocop run --roscore
```

This will:

- Start `roscore`  
- Ask for robot IP (e.g., 192.168.0.10)  
- List available calibration files in `~/catkin_ws/`  
- Launch `ur3e_bringup.launch` with the selected file

---

✅ Alternative run without Cli (separately Frontend and backend):

```bash
cd frontend/
npm start
```

```bash
cd backend/
python manage.py runserver
```

## ⚠ Notes

- On **Windows**, RoboCop runs in **mock mode** (no ROS), simulating joint updates.  
- On **Linux**, RoboCop connects to ROS (`rospy`) and controls the real UR3/UR3e robot.  
- ROS environment must be sourced before launching:
- If you wish to control any other robots of Universal other than UR3/UR3e, you only need to call its bring_up.py. 

```bash
source /opt/ros/noetic/setup.bash
source ~/catkin_ws/devel/setup.bash
```

---

## 💡 Advanced Features

✅ Soft limits toggle (placeholder in settings)  
✅ Collision avoidance toggle (placeholder in settings)  
✅ Current joint values pre-filled as placeholders when programming new flows  
✅ Frontend and backend synced via REST API

---

