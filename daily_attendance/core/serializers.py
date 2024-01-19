from rest_framework import serializers
from .models import EmployeeAttendance, EmployeeDetails, EmployeePayDetails

class EmployeeAttendanceSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee_id.employee_name', read_only=True)
    class Meta:
        model = EmployeeAttendance
        fields = ('id', 'employee_id', 'attendance_date', 'status', 'notes', 'employee_name')

class EmployeePayDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeePayDetails
        fields = ('employee_pay_per_day','employee_ot_pay')

class EmployeeDetailsSerializer(serializers.ModelSerializer):
    employee_pay = serializers.SerializerMethodField()
    joined_date = serializers.DateTimeField(format='%d-%m-%Y', read_only=True)
    class Meta:
        model = EmployeeDetails
        fields = ('id', 'employee_name', 'joined_date', 'phone_number', 'employee_pay')

    def get_employee_pay(self, employee_details):
        try:
            pay_q = EmployeePayDetails.objects.get(employee_id=employee_details)
        except EmployeePayDetails.DoesNotExist:
            return None

        pay_serializers = EmployeePayDetailsSerializer(pay_q)
        return pay_serializers.data
    
    def validate(self, data):
        try:
            if data.get('phone_number') != None:
                if EmployeeDetails.objects.filter(phone_number=data.get('phone_number')).exists():
                    raise serializers.ValidationError({"phone_number":"User with this phone number already exists"})
                    return
        except Exception as e:
            print(f"Exception: {e}")

        return data

    def create(self, validated_data):
        # Validate again before saving to ensure no record is saved
        phone_number = validated_data.get('phone_number')
        if phone_number is not None and EmployeeDetails.objects.filter(phone_number=phone_number).exists():
            raise serializers.ValidationError("User with this phone number already exists")

        # If validation passes, create the record in the database
        return super().create(validated_data)

class PaySerializers(serializers.Serializer):
    days_worked = serializers.IntegerField()
    Total_payment = serializers.IntegerField()
    absent_days = serializers.IntegerField()

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeDetails
        fields = ('id', 'employee_name')
        # read_only = True

class EmployeeUpdateSerializer(serializers.ModelSerializer):
    employee_pay = serializers.SerializerMethodField()
    joined_date = serializers.DateTimeField(format='%d-%m-%Y', read_only=True)
    class Meta:
        model = EmployeeDetails
        fields = ('id', 'employee_name', 'joined_date', 'phone_number', 'employee_pay')

    def get_employee_pay(self, employee_details):
        frontend_data = self.context['request'].data
        pay_info = frontend_data.get('employee_pay', None)
        if not pay_info:
            return None
        try:
            pay_q = EmployeePayDetails.objects.get(employee_id=employee_details)
            pay_q.employee_pay_per_day=pay_info
            pay_q.save()
        except EmployeePayDetails.DoesNotExist:
            pay_q, created = EmployeePayDetails.objects.get_or_create(employee_id=employee_details, employee_pay_per_day=pay_info) 
        
        pay_serializers = EmployeePayDetailsSerializer(pay_q)
        return pay_serializers.data