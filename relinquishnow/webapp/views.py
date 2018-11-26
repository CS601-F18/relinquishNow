from django.shortcuts import render
from django.views import View


class Index(View):
    def get(self, request):
        response = render(request, 'index.html', {})
        return response
 
    
class Login(View):
    def get(self, request):
        response = render(request, 'login.html', {})
        return response
        
    def post(self):
        pass
    

class SignUp(View):
    def get(self, request):
        response = render(request, 'signup.html', {})
        return response
        
    def post(self):
        pass


class Logout(View):
    def get(self):
        pass
    

class ContactUs(View):
    def get(self, request):
        response = render(request, 'contactus.html', {})
        return response

