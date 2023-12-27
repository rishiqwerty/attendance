from django.urls import path, include
from .views import mark_attendance, EmployeeDetail,AttendanceDetails

urlpatterns = [
    path('mark-attendance', mark_attendance, name='mark-attendance'),
    path('employee-details/', EmployeeDetail.as_view()),
    path('attendance-details/', AttendanceDetails.as_view()),

]