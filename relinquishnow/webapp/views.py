import json

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.core.exceptions import ValidationError
from django.http.response import HttpResponse, HttpResponseRedirect
from django.middleware import csrf
from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.views import View

from api.models import User, HelpCenter, ContactRequest


# This renders page based on user session status
# If user is not logged in return index.html else return home.html 
class Index(View):
    def get(self, request):
        if request.user.is_authenticated:
            response = render(request, 'home.html', {"active_user": request.user})
        else:
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
            login(request, user)
            response_data["status"] = "Success"
            response_data["http_status_code"] = 200
                
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
    
        return HttpResponse(json.dumps(response_data), status=response_data["http_status_code"])


class Items(View):
    @method_decorator(login_required)
    def get(self, request, item_id):
        response = render(request, 'items.html', {})
        return response


class UserProfile(View):
    @method_decorator(login_required)
    def get(self, request, userId):
        current_user = request.user
        context = {'user_details': current_user}
        response = render(request, 'profile.html', context)
        return response

    
class HelpCenterProfile(View):
    @method_decorator(login_required)
    def get(self, request, hcId):
        hc_list = HelpCenter.objects.filter(hc_id=hcId)
        if hc_list:
            hc_details = hc_list[0]
        context = {'hc_details': hc_details}  
        response = render(request, 'helpcenter.html', context)
        return response
        

class Logout(View):
    def get(self, request):
        logout(request)
        return HttpResponseRedirect("/")
    

class ContactUs(View):
    def get(self, request):
        response = render(request, 'contactus.html', {})
        response.set_cookie(key='csrftoken', value=csrf.get_token(request))
        return response
    
    def post(self, request):
        response_data = {
            "status": "Failure",
            "http_status_code": 500
        }
        
        user_name = request.POST.get("user_name")
        user_email = request.POST.get("user_email")
        user_phone = request.POST.get("user_phone")
        user_subject = request.POST.get("user_subject")
        user_message = request.POST.get("user_message")
        try:
            contact_obj = ContactRequest(user_name=user_name,
                                    user_email=user_email,
                                    user_phone=user_phone,
                                    user_subject=user_subject,
                                    user_message=user_message
                                    )
            contact_obj.full_clean()
            contact_obj.save()

            response_data["status"] = "Success"
            response_data["http_status_code"] = 200
            
        except ValidationError:
            response_data["error_reason"] = "Invalid Data Types"
            response_data["http_status_code"] = 412
        except:
            response_data["error_reason"] = "Error while sending email"
            response_data["http_status_code"] = 500

        return HttpResponse(json.dumps(response_data), status=response_data["http_status_code"])

