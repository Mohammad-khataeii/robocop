@echo off
REM ===== Windows Part =====
echo [INFO] Launching RoboCop on Windows...

REM Navigate to robocop folder
cd /d C:\Users\moha\Desktop\robocop

REM Activate Python virtual environment
if exist backend\venv\Scripts\activate (
    call backend\venv\Scripts\activate
) else (
    echo [ERROR] Python virtual environment not found!
    pause
    exit /b
)

REM Start Django backend in new terminal
cd backend
if exist manage.py (
    start cmd /k python manage.py runserver
) else (
    echo [ERROR] manage.py not found in backend directory!
    pause
    exit /b
)

REM Start React frontend (no browser) in new terminal
cd ..\frontend
if exist package.json (
    
    start cmd /k npm start
) else (
    echo [ERROR] package.json not found in frontend directory!
    pause
    exit /b
)

REM ===== WSL Part =====
echo [INFO] Launching ROS in WSL...

REM Adjust 'Ubuntu' to your WSL distro name (check with 'wsl -l')
set WSL_DISTRO=Ubuntu

REM Ask for robot IP
set /p ROBOT_IP=Enter robot IP (e.g., 192.168.0.10):

REM List calibration files in ~/catkin_ws/
wsl -d %WSL_DISTRO% bash -c "ls ~/catkin_ws/*.yaml"
set /p CALIB_FILE=Enter calibration YAML filename (e.g., my1_robot_calibration.yaml):

REM Start roscore + bringup inside WSL terminal (new window)
start wsl -d %WSL_DISTRO% bash -c "source /opt/ros/noetic/setup.bash && source ~/catkin_ws/devel/setup.bash && roscore & sleep 5 && roslaunch ur_robot_driver ur3e_bringup.launch robot_ip:=%ROBOT_IP% kinematics_config:=/home/your-linux-user/catkin_ws/%CALIB_FILE%"

REM ===== Final Message =====
echo [INFO] RoboCop backend, frontend, and ROS are now running.
pause
