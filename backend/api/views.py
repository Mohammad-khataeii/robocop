from rest_framework.decorators import api_view
from rest_framework.response import Response
from . import robot_controller, position_manager

@api_view(['GET'])
def robot_status(request):
    status = robot_controller.get_status()
    return Response(status)

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
