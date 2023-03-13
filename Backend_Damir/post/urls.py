from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from . import views
app_name = 'post'
urlpatterns = (
    # path('post_comments_count/<int:pk>/', views.count_comments),  # count comments
    path('users/',views.UserViewSet.as_view({'get': 'list'})),
    path('author_posts/<int:pk>', views.author_posts), # get author posts
    path('post_comments/<int:pk>', views.post_comments), # get post comments
    path('all_posts/', views.all_posts), # get all posts
    path('own_posts/', views.own_posts), # get own posts
    path('bookmarked_posts/', views.bookmarked_posts), # get bookmarked posts

    path('make_post/', views.make_post), # make post
    path('create_comment/', views.create_comment), # create comment

    path('delete_post/<int:pk>', views.delete_post),
    path('delete_comment/<int:pk>', views.delete_comment),

    path('like_post/<int:pk>/', views.PostLikeView.as_view()), # like post
    path('like_comment/<int:pk>/', views.CommentLikeView.as_view()), # like comment
    path('bookmark_post/<int:pk>/', views.PostMarkView.as_view()), # bookmark post

    path('edit_post/<int:pk>/',views.PostUpdate.as_view()), # edit post
    path('edit_comment/<int:pk>/',views.CommentUpdate.as_view()), # edit comment

    path('register/',views.register), # register
    path('login/', obtain_auth_token, name='api_token_auth')) # get token
