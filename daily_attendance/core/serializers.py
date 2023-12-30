from rest_framework import serializers
from .models import EmployeeAttendance, EmployeeDetails

class EmployeeAttendanceSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee_id.employee_name')
    class Meta:
        model = EmployeeAttendance
        fields = ('id', 'employee_id', 'attendance_date', 'status', 'notes', 'employee_name')

class EmployeeDetailsSerializer(serializers.ModelSerializer):
    joined_date = serializers.DateTimeField(format='%d-%m-%Y')
    class Meta:
        model = EmployeeDetails
        fields = ('id', 'employee_name', 'joined_date', 'phone_number')

