from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from . import views
app_name = 'chat'


urlpatterns = (
    path('load_chats/',views.load_chats),
    path('load_messages/<int:pk>',views.load_messages),

    path('start_chat/',views.create_chat),
    path('users/',views.UserList.as_view()),
)
