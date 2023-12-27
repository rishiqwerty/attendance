from django.shortcuts import render, redirect
from datetime import datetime, timedelta
# from models import EmployeeDetails, EmployeeAttendance
# # Create your views here.
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.response import Response

from .models import EmployeeAttendance, EmployeeDetails, EmployeePayDetails
# from django_filters.rest_framework import DjangoFilterBackend
from .serializers import EmployeeAttendanceSerializer, EmployeeDetailsSerializer

class EmployeeAttendanceFilterView(generics.ListAPIView):
    queryset = EmployeeAttendance.objects.all()
    serializer_class = EmployeeAttendanceSerializer
    # filterset_fields = {
    #     'employee_name': ['exact'],  # Allow exact match for employee_name
    #     'date': ['exact', 'gte', 'lte'],  # Allow exact match, greater than or equal, and less than or equal for date
    #     'status': ['exact'],  # Allow exact match for status
    # }

class EmployeeDetail(APIView):
    """
    Retrieve, update or delete a snippet instance.
    """
    def get(self, request, format=None):
        emp = EmployeeDetails.objects.all().order_by('-employee_name')
        serializer = EmployeeDetailsSerializer(emp, many=True)
        return Response(serializer.data)
    def post(self, request, format=None):
            print(request.data)
            serializer = EmployeeDetailsSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=200)
            return Response(serializer.errors, status=400)

class AttendanceDetails(APIView):
    def get(self, request, format=None):
        emp = EmployeeAttendance.objects.all().order_by('-employee_id')
        serializer = EmployeeAttendanceSerializer(emp, many=True)
        return Response(serializer.data)
    def post(self, request, format=None):
            serializer = EmployeeAttendanceSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=200)
            return Response(serializer.errors, status=400)

from django.shortcuts import render

# from .forms import AttendanceFormSet, EmployeeForm, AttendanceForm
# from .forms import EmployeeAttendanceForm



# def attendance_list(request):
#     records = EmployeeAttendance.objects.all()
#     return render(request, 'your_app/attendance_list.html', {'records': records})

# def attendance_form(request):
#     if request.method == 'POST':
#         form = EmployeeAttendanceForm(request.POST)
#         if form.is_valid():
#             form.save()
#             # Redirect or render a success page
#     else:
#         form = EmployeeAttendanceForm()
#     return render(request, 'your_app/attendance_form.html', {'form': form})


# def create_employee(request):
#     if request.method == 'POST':
#         form = EmployeeForm(request.POST)
#         if form.is_valid():
#             name = form.cleaned_data['employee_name']
#             if EmployeeDetails.objects.filter(employee_name=name).exists():
#                 form.add_error('employee_name', 'An employee with this name already exists.')
#             else:
#                 form.save()
#                 return redirect('list-employee')  # Redirect to the list of employees or a success page
#     else:
#         form = EmployeeForm()
#     return render(request, 'create_employee.html', {'form': form})

# def get_employee(request):
#     if request.method == 'GET':
#         records = EmployeeDetails.objects.all()
#     return render(request, 'employee_list.html', {'records': records})


def mark_attendance(request):
    
    if request.method == 'POST':
        # form = AttendanceForm(request.POST)
        # if form.is_valid():
        #     date = form.cleaned_data['date']
        #     employee = form.cleaned_data['employee']
        #     status = form.cleaned_data['status']
        #     notes = form.cleaned_data['notes']
        formset = AttendanceFormSet(request.POST)
        if formset.is_valid():
            for form in formset:
                date = form.cleaned_data['date']
                if date:
                    employee = form.cleaned_data['employee']
                    status = form.cleaned_data['status']
                    notes = form.cleaned_data['notes']
                    attendance, created = EmployeeAttendance.objects.get_or_create(employee_id=employee, attendance_date=date)
                    attendance.status = status
                    attendance.save()
            # Process attendance data here
            # Save the attendance record or perform any desired actions


    # elif request.method == 'GET':
    #     # Handle "GET" requests to retrieve and display attendance data
    #     date = request.GET.get('date')
    #     print("ff", date)
    #     attendance_records = EmployeeAttendance.objects.filter(attendance_date=date)
    #     if not attendance_records:
    #         formset = AttendanceFormSet()
    #     else:
    #         initial_data = [{'employee': record.employee_id, 'status': record.status, 'date': date} for record in attendance_records]
    #         formset = AttendanceFormSet(initial=initial_data)
    else:

        formset = AttendanceFormSet()

    return render(request, 'mark_attendance.html', {'form': formset})

# def select_date(request):
#     return render(request, 'select_date.html')


def pay_details(request):
    employee_pay = {}
    if request.method == 'GET':
        employee=EmployeeDetails.objects.all()
        for e in employee:
            try:
                pay_day = EmployeePayDetails.objects.filter(employee_id=e.id).order_by('-id')[0]
            except:
                continue

            payment_per_day = pay_day.employee_pay_per_day
            days = len(EmployeeAttendance.objects.filter(employee_id=e.id, status=True, attendace_date__gte=datetime.now().date().replace(day=1)))
            absent_days = len(EmployeeAttendance.objects.filter(employee_id=e.id, status=False, attendace_date__gte=datetime.now().date().replace(day=1)))
            employee_pay[e.employee_name] = {
                'days_worked': days,
                'Total_payment': payment_per_day*days,
                'absent_days': absent_days,
            }
        return render(request, '',{'data':employee_pay})
