#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import subprocess
import argparse
import os
import platform

def run_roscore():
    """Start roscore (only on Linux)."""
    try:
        subprocess.Popen(['roscore'])
        print("✅ roscore started")
    except FileNotFoundError:
        print("❌ ERROR: 'roscore' not found. Ensure ROS is installed and sourced.")

def run_robot_bringup():
    """Select robot type and launch its bringup."""
    robot_options = ['ur3e', 'ur5e', 'ur10e']
    print("\n👉 Available Universal Robots:")
    for idx, robot in enumerate(robot_options, 1):
        print(f"{idx}. {robot}")

    while True:
        choice = input("👉 Select robot by number: ").strip()
        if choice.isdigit() and 1 <= int(choice) <= len(robot_options):
            robot_name = robot_options[int(choice) - 1]
            break
        else:
            print("❌ Invalid selection. Please enter a valid number.")

    robot_ip = input("👉 Enter the robot IP (e.g., 192.168.0.10): ").strip()
    if not robot_ip:
        print("❌ No IP provided. Skipping bringup.")
        return

    # Find calibration files in ~/catkin_ws/src/<robot_name>_description/
    home_dir = os.path.expanduser("~")
    calib_dir = os.path.join(home_dir, "catkin_ws", "src", f"{robot_name}_description")

    if not os.path.isdir(calib_dir):
        print(f"❌ Directory not found: {calib_dir}")
        return

    files = [f for f in os.listdir(calib_dir) if f.endswith("_robot_calibration.yaml")]

    if not files:
        print(f"❌ No calibration files found in {calib_dir}!")
        return

    print("\nAvailable calibration files:")
    for idx, f in enumerate(files, 1):
        print(f"{idx}. {f}")

    while True:
        file_choice = input("👉 Select calibration file by number: ").strip()
        if file_choice.isdigit() and 1 <= int(file_choice) <= len(files):
            calibration_file = os.path.join(calib_dir, files[int(file_choice) - 1])
            break
        else:
            print("❌ Invalid selection. Please enter a valid number.")

    try:
        subprocess.Popen([
            'roslaunch', 'ur_robot_driver', f'{robot_name}_bringup.launch',
            f'robot_ip:={robot_ip}',
            f'kinematics_config:={calibration_file}'
        ])
        print(f"✅ {robot_name.upper()} bringup started with robot_ip: {robot_ip} and calibration file: {calibration_file}")
    except FileNotFoundError:
        print("❌ ERROR: 'roslaunch' or 'ur_robot_driver' not found. Ensure ROS is sourced and installed.")

def run_backend():
    """Start Django backend."""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    backend_path = os.path.abspath(os.path.join(script_dir, '..', 'backend'))

    if platform.system() == 'Windows':
        python_executable = os.path.join(backend_path, 'venv', 'Scripts', 'python.exe')
    else:
        python_executable = os.path.join(backend_path, 'venv', 'bin', 'python')

    manage_py = os.path.join(backend_path, 'manage.py')

    if not os.path.isfile(python_executable):
        python_executable = 'python3'

    subprocess.Popen([python_executable, manage_py, 'runserver'], cwd=backend_path)
    print("✅ Backend started at http://localhost:8000")

def run_frontend():
    """Start React frontend."""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    frontend_path = os.path.abspath(os.path.join(script_dir, '..', 'frontend'))
    subprocess.Popen(['npm', 'start'], cwd=frontend_path, shell=True)
    print("✅ Frontend started at http://localhost:3000")

def main():
    parser = argparse.ArgumentParser(description='RoboCop CLI')
    parser.add_argument('command', choices=['run', 'status'], help='Command to run')
    parser.add_argument('--roscore', action='store_true', help='Also run roscore and robot bringup (Linux only)')
    args = parser.parse_args()

    if args.command == 'run':
        if args.roscore:
            if platform.system() == 'Linux':
                print("🚀 Starting roscore...")
                run_roscore()
                print("🚀 Starting Universal Robot bringup...")
                run_robot_bringup()
            else:
                print("⚠️  ROS integration is disabled on Windows. Skipping roscore and robot bringup.")

        print("🚀 Starting RoboCop backend...")
        run_backend()

        print("🚀 Starting RoboCop frontend...")
        run_frontend()

    elif args.command == 'status':
        print("✅ RoboCop CLI is ready and waiting.")

if __name__ == '__main__':
    main()
