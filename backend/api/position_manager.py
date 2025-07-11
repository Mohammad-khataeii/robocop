import csv
from datetime import datetime

CSV_FILENAME = 'saved_positions.csv'
joint_names = [
    'shoulder_pan_joint', 'shoulder_lift_joint', 'elbow_joint',
    'wrist_1_joint', 'wrist_2_joint', 'wrist_3_joint'
]

def load_saved_positions():
    saved = {}
    try:
        with open(CSV_FILENAME, mode='r') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                saved[row['name']] = [float(row[j]) for j in joint_names]
    except FileNotFoundError:
        pass
    return saved

def save_position(name, positions):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    fieldnames = ['timestamp', 'name'] + joint_names
    rows = []

    # Load existing, remove if name matches
    try:
        with open(CSV_FILENAME, mode='r') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                if row['name'] != name:
                    rows.append(row)
    except FileNotFoundError:
        pass

    new_row = {'timestamp': timestamp, 'name': name}
    for i, joint in enumerate(joint_names):
        new_row[joint] = positions[i]
    rows.append(new_row)

    with open(CSV_FILENAME, mode='w', newline='') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for row in rows:
            writer.writerow(row)
    return f"Position '{name}' saved."

def update_position(name, positions):
    return save_position(name, positions)

def delete_position(name):
    fieldnames = ['timestamp', 'name'] + joint_names
    rows = []
    found = False

    try:
        with open(CSV_FILENAME, mode='r') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                if row['name'] != name:
                    rows.append(row)
                else:
                    found = True
    except FileNotFoundError:
        pass

    if not found:
        return f"Position '{name}' not found."

    with open(CSV_FILENAME, mode='w', newline='') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for row in rows:
            writer.writerow(row)
    return f"Position '{name}' deleted."
