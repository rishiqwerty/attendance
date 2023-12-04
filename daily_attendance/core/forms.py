from django import forms

from .models import EmployeeAttendance, EmployeeDetails

class EmployeeAttendanceForm(forms.ModelForm):
    class Meta:
        model = EmployeeAttendance
        fields = ['attendance_date', 'status', 'notes']

class AttendanceForm(forms.Form):
    employee = forms.ModelChoiceField(queryset=EmployeeDetails.objects.all(), empty_label="Select an employee")
    status = forms.ChoiceField(
        choices=[('Present', 'Present'), ('Absent', 'Absent')],
        widget=forms.RadioSelect
    )
    date = forms.DateField(widget=forms.DateInput(attrs={'type': 'date'}), required=False)
    notes = forms.CharField(widget=forms.Textarea, required=False)

AttendanceFormSet = forms.formset_factory(AttendanceForm, extra=0)

class EmployeeForm(forms.ModelForm):
    class Meta:
        model = EmployeeDetails
        fields = ['employee_name', 'phone_number']
    def clean_name(self):
        # Get the cleaned data for the 'name' field
        employee_name = self.cleaned_data.get('employee_name')
        
        # Check if an employee with the same name already exists
        if EmployeeDetails.objects.filter(employee_name=employee_name).exists():
            raise forms.ValidationError("An employee with this name already exists.")
        
        # If no existing employee with the same name is found, return the name
        return employee_name
