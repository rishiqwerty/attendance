from datetime import datetime, timedelta
import json
# from models import EmployeeDetails, EmployeeAttendance
# # Create your views here.
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.response import Response
from .pagination import StandardResultsSetPagination

from .models import EmployeeAttendance, EmployeeDetails, EmployeePayDetails
# from django_filters.rest_framework import DjangoFilterBackend
from .serializers import EmployeeAttendanceSerializer, EmployeeDetailsSerializer, PaySerializers,EmployeeSerializer, EmployeeUpdateSerializer

class EmployeeAttendanceFilterView(generics.ListAPIView):
    pagination_class = StandardResultsSetPagination
    queryset = EmployeeAttendance.objects.all()
    serializer_class = EmployeeAttendanceSerializer
    # filterset_fields = {
    #     'employee_name': ['exact'],  # Allow exact match for employee_name
    #     'date': ['exact', 'gte', 'lte'],  # Allow exact match, greater than or equal, and less than or equal for date
    #     'status': ['exact'],  # Allow exact match for status
    # }
class EmployeeDetailsUpdate(generics.UpdateAPIView):
    queryset = EmployeeDetails.objects.all()
    serializer_class = EmployeeUpdateSerializer
    lookup_url_kwarg = 'id'  

class EmployeeDetail(generics.ListAPIView):
    """
    Retrieve, update or delete a snippet instance.
    """
    queryset = EmployeeDetails.objects.all().order_by('-employee_name')
    pagination_class = StandardResultsSetPagination
    serializer_class = EmployeeDetailsSerializer

    # def get(self, request, format=None):
    #     emp = EmployeeDetails.objects.all().order_by('-employee_name')
    #     page = self.paginate_queryset(emp)
    #     if page is not None:
    #         serializer = EmployeeDetailsSerializer(page, many=True)
    #         return Response(serializer.data)
    def post(self, request, format=None):
        serializer = EmployeeDetailsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)

    def update(self, request, format=None):
        serializer = EmployeeDetailsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)

class AttendanceDetails(generics.ListAPIView):
    queryset = EmployeeAttendance.objects.all().order_by('-employee_id')
    pagination_class = StandardResultsSetPagination
    serializer_class = EmployeeAttendanceSerializer


    def get_queryset(self):
        queryset = super().get_queryset()

        # Filter based on query parameters
        attendance_date = self.request.query_params.get('attendance_date')
        employee_id = self.request.query_params.get('employee_id')
        att_start_date = self.request.query_params.get('attendance_start_date')
        att_end_date = self.request.query_params.get('attendance_end_date')
        if attendance_date:
            queryset = queryset.filter(attendance_date=attendance_date, employee_id=employee_id)
        if employee_id:
            queryset = queryset.filter(employee_id=employee_id)
        if att_start_date and att_end_date:
            queryset = queryset.filter(attendance_date__gte=att_start_date, attendance_date__lte=att_end_date)
        # Additional filtering options as needed
        return queryset

    # def get(self, request, format=None):
    #     emp = EmployeeAttendance.objects.all().order_by('-employee_id')
    #     page = self.paginate_queryset(emp)
    #     if page is not None:
    #         serializer = EmployeeAttendanceSerializer(page, many=True)
            # return Response(serializer.data)
    def post(self, request, format=None):
        employee_id = request.data.get('employee_id')
        attendance_date = request.data.get('attendance_date')
        # print("Emplot--->",employee_id, attendance_date)
        # Retrieve existing entry, if any
        existing_entry = EmployeeAttendance.objects.filter(
            employee_id=employee_id, attendance_date=attendance_date
        ).first()

        if existing_entry:
            serializer = EmployeeAttendanceSerializer(existing_entry, data=request.data, partial=True)
            # print("Yes",existing_entry)
        else:
            serializer = EmployeeAttendanceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)


class EmployeePayDetailsView(APIView):
    def get(self, request):
        id = request.query_params.get('employee_id')
        attendance_start_date = request.query_params.get('attendance_start_date')
        attendance_end_date = request.query_params.get('attendance_end_date')

        employee_pay = {}
        employee=EmployeeDetails.objects.filter(pk=id)
        for e in employee:
            try:
                pay_day = EmployeePayDetails.objects.filter(employee_id=e).order_by('-id')[0]
            except Exception as c:
                print("safsa", c, id)
                continue

            payment_per_day = pay_day.employee_pay_per_day
            days = len(EmployeeAttendance.objects.filter(employee_id=e.id, status='Present', attendance_date__gte=attendance_start_date,attendance_date__lte=attendance_end_date ))
            print("********s",EmployeeAttendance.objects.filter(employee_id=e, status='Present', attendance_date__gte=attendance_start_date,attendance_date__lte=attendance_end_date))
            absent_days = len(EmployeeAttendance.objects.filter(employee_id=e.id, status='Absent', attendance_date__gte=attendance_start_date,attendance_date__lte=attendance_end_date))
            print(e.employee_name, days,absent_days, payment_per_day)
            employee_pay = {
                'days_worked': days if days else 0,
                'Total_payment': payment_per_day*days if days else 0,
                'absent_days': absent_days if absent_days else 0,
            }
        pay_serial = PaySerializers(data=employee_pay)
        if pay_serial.is_valid():
            return Response(pay_serial.data, status=200)
        return Response(pay_serial.errors, status=400)

    def post(self, request):
        id = request.query_params.get('employee_id')
        employee=EmployeeDetails.objects.filter(pk=id)
        employee_id = request.data.get("employee_id")

        if employee:
            pay_serial = PaySerializers(data=employee)
        
        else:
            pay_serial = PaySerializers(data=request.data)


class UserListView(APIView):
    def get(self, request):
        employee= EmployeeDetails.objects.all().values('id', 'employee_name')
        if employee:
            emp_serial = EmployeeSerializer(employee, many=True)
            # print(emp_serial.data)
            return Response(emp_serial.data, status=200)
            