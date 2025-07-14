from django.urls import path
from . import views

urlpatterns = [
    path('status/', views.robot_status),                # GET robot status
    path('move/', views.move_robot),                   # POST move command
    path('stop/', views.stop_robot),                   # POST emergency stop
    path('positions/', views.positions_list),         # GET all positions, POST save new
    path('positions/<str:name>/', views.position_detail),  # PATCH update, DELETE remove
    path('logs/', views.get_logs),                     # ✅ GET logs (for LogPanel)
    path('clear-logs/', views.clear_logs),
    path('settings/', views.settings_view),
             # ✅ POST clear logs (optional)
]
