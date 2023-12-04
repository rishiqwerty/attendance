from django.contrib import admin
from .models import EmployeeAttendance, EmployeeDetails, EmployeePayDetails
# Register your models here.

class EmployeeNameFilter(admin.SimpleListFilter):
    title = 'Employee Name'
    parameter_name = 'employee_name'

    def lookups(self, request, model_admin):
        # Get a list of unique author names
        return EmployeeDetails.objects.values_list('employee_name', 'employee_name').distinct()

    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(employee_id__employee_name=self.value())


class EmployeeAttendanceAdmin(admin.ModelAdmin):
    list_display = ('employee_name', 'attendance_date', 'status')
    list_filter = ('status', 'attendance_date', EmployeeNameFilter)
    def employee_name(self, obj):
        return obj.employee_id.employee_name
admin.site.register(EmployeeAttendance, EmployeeAttendanceAdmin)

class EmployeeDetailsAdmin(admin.ModelAdmin):
    list_display = ('employee_name', 'phone_number', 'joined_date')
admin.site.register(EmployeeDetails, EmployeeDetailsAdmin)

class EmployeePayDetailsAdmin(admin.ModelAdmin):
    list_display = ('employee_name', 'employee_pay_per_day', 'creation_date')
    def employee_name(self, obj):
        return obj.employee_id.employee_name
admin.site.register(EmployeePayDetails, EmployeePayDetailsAdmin)
