from rest_framework import serializers
from .models import EmployeeAttendance, EmployeeDetails

class EmployeeAttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeAttendance
        fields = ('id', 'employee_id', 'attendance_date', 'status', 'notes')

class EmployeeDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeDetails
        fields = ('id', 'employee_name', 'joined_date', 'phone_number')

