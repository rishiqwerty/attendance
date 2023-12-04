from django.db import models

class EmployeeDetails(models.Model):
    employee_name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=10, null=True)
    joined_date = models.DateTimeField(auto_created=True, auto_now_add=True)
    def __str__(self):
        return self.employee_name

class EmployeeAttendance(models.Model):
    employee_id = models.ForeignKey(EmployeeDetails, on_delete=models.PROTECT)
    attendance_date = models.DateField()
    status = models.CharField(max_length=10, choices=[('Present', 'Present'), ('Absent', 'Absent')])
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.employee_id} - {self.attendance_date}"

class EmployeePayDetails(models.Model):
    employee_id = models.ForeignKey(EmployeeDetails, on_delete=models.PROTECT)
    employee_pay_per_day = models.IntegerField(blank=False, null=False)
    employee_ot_pay = models.IntegerField(blank=True, null=True)
    creation_date = models.DateTimeField(auto_created=True, auto_now_add=True)

