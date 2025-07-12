#!/bin/bash

echo "[INFO] Launching RoboCop on Linux..."

cd ~/robocop || { echo "[ERROR] robocop directory not found!"; exit 1; }

if [ -d backend/venv ]; then
  source backend/venv/bin/activate
else
  echo "[ERROR] Python virtual environment not found!"
  exit 1
fi

gnome-terminal -- bash -c "cd ~/robocop/backend && python manage.py runserver; exec bash"

cd frontend || { echo "[ERROR] frontend directory not found!"; exit 1; }
BROWSER=none npm start &

sleep 10
xdg-open http://localhost:3000

echo "[INFO] Launching ROS..."

read -p "Enter robot IP (e.g., 192.168.0.10): " ROBOT_IP

ls ~/catkin_ws/*.yaml
read -p "Enter calibration YAML filename (e.g., my1_robot_calibration.yaml): " CALIB_FILE

gnome-terminal -- bash -c "source /opt/ros/noetic/setup.bash && source ~/catkin_ws/devel/setup.bash && roscore & sleep 5 && roslaunch ur_robot_driver ur3e_bringup.launch robot_ip:=$ROBOT_IP kinematics_config:=/home/$(whoami)/catkin_ws/$CALIB_FILE; exec bash"

echo "[INFO] RoboCop backend, frontend, and ROS are now running."
