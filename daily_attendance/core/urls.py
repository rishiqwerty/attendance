from django.urls import path, include
from .views import create_employee, get_employee, mark_attendance, select_date, EmployeeDetail,AttendanceDetails

urlpatterns = [
    # path('employee_attendance/create/', EmployeeAttendanceCreateView.as_view(), name='employee-attendance-create'),
    path('employee/create/', create_employee, name='create-employee'),
    path('employee/get/', get_employee, name='list-employee'),
    path('mark-attendance', mark_attendance, name='mark-attendance'),
    path('select-date', select_date, name='date'),
    path('snippets/', EmployeeDetail.as_view()),
    path('attendance-details/', AttendanceDetails.as_view()),

]