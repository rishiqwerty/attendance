# Generated by Django 4.2.6 on 2023-10-28 03:53

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='EmployeeDetails',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('joined_date', models.DateTimeField(auto_created=True, auto_now_add=True)),
                ('employee_name', models.CharField(max_length=100)),
                ('phone_number', models.CharField(max_length=10, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='EmployeeAttendance',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('attendance_date', models.DateField()),
                ('status', models.CharField(choices=[('Present', 'Present'), ('Absent', 'Absent')], max_length=10)),
                ('notes', models.TextField(blank=True, null=True)),
                ('employee_id', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='core.employeedetails')),
            ],
        ),
    ]
