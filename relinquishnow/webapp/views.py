import json
import uuid

from django.contrib.auth import authenticate, login
from django.core.exceptions import ValidationError
from django.http.response import HttpResponse
from django.middleware import csrf
from django.shortcuts import render
from django.views import View

from api.models import User


class Index(View):
    def get(self, request):
        response = render(request, 'index.html', {})
        response.set_cookie(key='csrftoken', value=csrf.get_token(request))
        return response
 
    
class Login(View):
    def get(self, request):
        response = render(request, 'login.html', {})
        response.set_cookie(key='csrftoken', value=csrf.get_token(request))
        return response
        
    def post(self, request):
        response_data = {
            "status": "Failure",
            "http_status_code": 401
        }
        username = request.POST['user_login_email']
        password = request.POST['user_login_password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            if user.account_verification_status == 1:
                login(request, user)
                response_data["status"] = "Success"
                response_data["http_status_code"] = 200
            else:
                response_data["error_reason"] = "Account need to be verified"
                response_data["http_status_code"] = 403
                
            if user.is_deleted:
                response_data["error_reason"] = "Account has been deleted"
                response_data["http_status_code"] = 403
    
        else:
            response_data["error_reason"] = "Invalid Username/Password"
    
        return HttpResponse(json.dumps(response_data), status=response_data["http_status_code"])
    

class SignUp(View):
    def get(self, request):
        response = render(request, 'signup.html', {})
        response.set_cookie(key='csrftoken', value=csrf.get_token(request))
        return response
        
    def post(self, request):
        response_data = {
            "status": "Failure",
            "http_status_code": 500
        }

        if request.method == 'POST':
            user_first_name = request.POST.get("user_first_name")
            user_last_name = request.POST.get("user_last_name")
            user_email = request.POST.get("user_email")
            user_password = request.POST.get("user_password")
            user_phone = request.POST.get("user_phone")
    
            if not User.objects.filter(user_email=user_email).exists():
                try:
                    user_register_obj = User(
                        user_first_name=user_first_name,
                        user_last_name=user_last_name,
                        user_email=user_email,
                        user_phone=user_phone,
                        password=user_password)
    
                    user_register_obj.full_clean()
                    user_register_obj.set_password(user_password)
                    user_register_obj.save()
    
                    response_data["status"] = "Success"
                    response_data["http_status_code"] = 200
    
                except ValidationError:
                    response_data["error_reason"] = "Invalid Data Types"
                    response_data["http_status_code"] = 412
                except Exception as e:
                    print(e)
                    response_data["error_reason"] = "Error while saving user sign up information"
            else:
                response_data["error_reason"] = "Email already registered"
        else:
            response_data["error_reason"] = "Invalid Request"
            response_data["http_status_code"] = 405
    
        return HttpResponse(json.dumps(response_data), status=response_data["http_status_code"])


class Logout(View):
    def get(self):
        pass
    

class ContactUs(View):
    def get(self, request):
        response = render(request, 'contactus.html', {})
        response.set_cookie(key='csrftoken', value=csrf.get_token(request))
        return response

