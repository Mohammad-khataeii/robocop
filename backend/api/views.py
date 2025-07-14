from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from . import robot_controller, position_manager

# Optional: store current settings in-memory (can later move to DB)
current_settings = {}

@api_view(['GET'])
def robot_status(request):
    status_data = robot_controller.get_status()
    return Response(status_data)

@api_view(['POST'])
def move_robot(request):
    data = request.data
    result = robot_controller.move_robot(data)
    return Response({"message": result})

@api_view(['POST'])
def stop_robot(request):
    result = robot_controller.emergency_stop()
    return Response({"message": result})

@api_view(['GET', 'POST'])
def positions_list(request):
    if request.method == 'GET':
        positions = position_manager.load_saved_positions()
        return Response({"positions": positions})
    elif request.method == 'POST':
        name = request.data.get('name')
        positions = request.data.get('positions')
        result = position_manager.save_position(name, positions)
        return Response({"message": result})

@api_view(['PATCH', 'DELETE'])
def position_detail(request, name):
    if request.method == 'PATCH':
        positions = request.data.get('positions')
        result = position_manager.update_position(name, positions)
        return Response({"message": result})
    elif request.method == 'DELETE':
        result = position_manager.delete_position(name)
        return Response({"message": result})

@api_view(['GET'])
def get_logs(request):
    logs = robot_controller.get_logs()
    return Response({"logs": logs})

@api_view(['POST'])
def clear_logs(request):
    robot_controller.clear_logs()
    return Response({"message": "Logs cleared."})

@api_view(['GET', 'POST'])
def settings_view(request):
    global current_settings

    # Default settings if none saved yet
    default_settings = {
        'ipAddress': '192.168.1.100',
        'port': '9090',
        'duration': '5',
        'speedFactor': '1',
        'autoHome': True,
        'saveLogs': False,
        'softLimits': True,
        'collisionAvoidance': True,
    }

    if request.method == 'GET':
        # Return current settings or defaults
        if not current_settings:
            current_settings = default_settings.copy()
        return Response(current_settings)

    elif request.method == 'POST':
        required_fields = [
            'ipAddress', 'port', 'duration', 'speedFactor',
            'autoHome', 'saveLogs', 'softLimits', 'collisionAvoidance'
        ]
        data = request.data

        missing = [field for field in required_fields if field not in data]
        if missing:
            return Response(
                {'error': f'Missing fields: {", ".join(missing)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Save settings (you can add validation or conversion here)
        current_settings = data

        print("Received and saved settings:", current_settings)

        return Response({'message': 'Settings saved successfully.'})
