from rest_framework import permissions

from .models import Comment,Post,PostImage


class CommentPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if obj.post.author == request.user or obj.owner == request.user:
            return True
        return False
    def has_permission(self, request, view):
        if Comment.objects.get(id=view.kwargs.get('pk')).owner == request.user:
            return True
        if request.method == "DELETE":
            if Comment.objects.get(id=view.kwargs.get('pk')).post.author == request.user:
                return True
        return False

class ImagePermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if obj.owner == request.user:
            return True
        return False

    def has_permission(self, request, view):
        if PostImage.objects.get(id=view.kwargs.get('pk')).owner == request.user:
            return True
        if request.method == "DELETE":
            if PostImage.objects.get(id=view.kwargs.get('pk')).post.author == request.user:
                return True
        return False

class PostPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in ['GET', 'PUT'] and obj.author == request.user:
            return True
        return False
    def has_permission(self, request, view):
        if Post.objects.get(id=view.kwargs.get('pk')).author == request.user:
            return True
        return False
