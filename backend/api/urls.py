from django.urls import path
from . import views

urlpatterns = [
    path('status/', views.robot_status),
    path('move/', views.move_robot),
    path('stop/', views.stop_robot),
    path('positions/', views.positions_list),
    path('positions/<str:name>/', views.position_detail),
]
