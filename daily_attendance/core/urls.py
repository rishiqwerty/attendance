from django.urls import path, include
from .views import EmployeeDetail,AttendanceDetails, EmployeePayDetailsView, UserListView, EmployeeDetailsUpdate

urlpatterns = [
    # path('mark-attendance', mark_attendance, name='mark-attendance'),
    path('employee-details/<int:id>/', EmployeeDetailsUpdate.as_view()),
    path('employee-details/', EmployeeDetail.as_view()),
    
    path('attendance-details/', AttendanceDetails.as_view()),
    path('pay-details/', EmployeePayDetailsView.as_view()),
    path('userList/', UserListView.as_view()),
]