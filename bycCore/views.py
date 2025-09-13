"""
Vistas principales del sistema BYC Core
"""

from django.shortcuts import render

def home(request):
    """
    Vista principal del sistema - Dashboard
    """
    context = {
        'page_title': 'Dashboard Principal',
        'user_name': 'Alina Mclourd',
        'user_role': 'VP, People Manager',
    }
    return render(request, 'pages/home.html', context)