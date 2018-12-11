import json

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.core.exceptions import ValidationError
from django.http.response import HttpResponse, HttpResponseRedirect, Http404, \
    JsonResponse
from django.middleware import csrf
from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.views import View

from api.models import User, HelpCenter, ContactRequest
from api.serializers import UserSerializer
from rest_framework import status
from rest_framework.response import Response


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


class SignUp(View):
    # This renders a sign up page to sign up a user.
    # If user is already logged in redirects to home page
    def get(self, request):
        if request.user.is_authenticated:
            return HttpResponseRedirect("/")
        
        response = render(request, 'signup.html', {})
        response.set_cookie(key='csrftoken', value=csrf.get_token(request))
        return response
    
    # This adds user details from sign up form to user table.
    # If user with email already exists raises a 400 response
    def post(self, request):
        data = json.loads(request.POST.get('data', '{}'))
        serializer = UserSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            userObj = User.objects.get(user_email=data.get("user_email"))
            userObj.set_password(data.get("user_password"))
            userObj.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=400)


class Login(View):
    # This renders login page based on user session status
    # If user is already logged redirect to index view else render login page
    def get(self, request):
        if request.user.is_authenticated:
            return HttpResponseRedirect("/")
        
        response = render(request, 'login.html', {})
        response.set_cookie(key='csrftoken', value=csrf.get_token(request))
        return response
    
    # This will authenticate the user credentials and create the user session
    # User object is saved in request going forward    
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

    
# This deleted the current user session and redirects back to home page
class Logout(View):
    def get(self, request):
        logout(request)
        return HttpResponseRedirect("/")
    

class Items(View):
    @method_decorator(login_required)
    def get(self, request, item_id):
        response = render(request, 'items.html', {})
        return response


class UserProfile(View):
    @method_decorator(login_required)
    def get(self, request, userId):
        try:
            user_details = User.objects.get(user_id=userId)
            current_user = request.user
            is_editable = True if user_details.user_id == current_user.user_id else False
                
            context = {'user_details': user_details,
                       'active_user': current_user,
                       'is_editable': is_editable,
                       }
            response = render(request, 'profile.html', context)
            return response
        except:
            raise Http404('User with this userId doesnt exist')

    
class HelpCenterProfile(View):
    @method_decorator(login_required)
    def get(self, request, hcId):
        hc_list = HelpCenter.objects.filter(hc_id=hcId)
        if hc_list:
            hc_details = hc_list[0]
        context = {'hc_details': hc_details}  
        response = render(request, 'helpcenter.html', context)
        return response
        

class ContactUs(View):
    def get(self, request):
        response = render(request, 'contactus.html', {})
        response.set_cookie(key='csrftoken', value=csrf.get_token(request))
        return response
    
    def post(self, request):
#         data = json.loads(request.POST.get('data', '{}'))
#         serializer = UserSerializer(data=data)
#         if serializer.is_valid():
#             serializer.save()
#             return JsonResponse(serializer.data)
#         return JsonResponse(serializer.errors, status=400)
#     
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

