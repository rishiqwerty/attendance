from django.urls import path, include
from .views import EmployeeDetail,AttendanceDetails, EmployeePayDetailsView

urlpatterns = [
    # path('mark-attendance', mark_attendance, name='mark-attendance'),
    path('employee-details/', EmployeeDetail.as_view()),
    path('attendance-details/', AttendanceDetails.as_view()),
    path('pay-details/', EmployeePayDetailsView.as_view()),
]