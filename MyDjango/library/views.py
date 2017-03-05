#coding:utf-8
from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.contrib.auth.decorators import user_passes_test, login_required
from django.core.urlresolvers import reverse
from django.contrib.auth.models import User
from django.contrib import auth
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from .models import MyUser, Book, Image
import logging
logger = logging.getLogger("django") # 为loggers中定义的名称


def library(request):
    active_menu = 'homepage'
    print request.user.is_authenticated()
    user = request.user if request.user.is_authenticated() else None
    print dir(user)
    # content = {
    #     'active_menu': homepage,
    #     'user': user,
    # }

    return render(request, 'library/index.html', locals())

@login_required
def add_book(request):
    logger.info("add_book...")
    active_menu = 'add_book'
    user = request.user
    state = None
    if request.method == 'POST':
        new_book = Book(
                name=request.POST.get('name', ''),
                author=request.POST.get('author', ''),
                category=request.POST.get('category', ''),
                price=request.POST.get('price', 0),
                publish_date=request.POST.get('publish_date', '')
        )
        new_book.save()
        state = 'success'
    logger.info(locals())
    # content = {
    #     'user': user,
    #     'active_menu': 'add_book',
    #     'state': state,
    # }
    return render(request, 'library/add_book.html', locals())

def add_img(request):
    user = request.user
    state = None
    active_menu = 'add_img'
    if request.method == 'POST':
        try:
            new_img = Image(
                    name=request.POST.get('name', ''),
                    description=request.POST.get('description', ''),
                    img=request.FILES.get('img', ''),
                    book=Book.objects.get(pk=request.POST.get('book', ''))
            )
            new_img.save()
        except Book.DoesNotExist as e:
            state = 'error'
            print(e)
        else:
            state = 'success'
    book_list = Book.objects.all()

    return render(request, 'library/add_img.html', locals())

def view_book_list(request):
    print 'view_book_list'
    active_menu = 'view_book'
    category_list = Book.objects.values_list('category', flat=True).distinct()
    print category_list
    query_category = request.GET.get('category', 'all')
    if not query_category or Book.objects.filter(category=query_category).count() is 0:
        query_category = 'all'
        book_list = Book.objects.all()
    else:
        book_list = Book.objects.filter(category=query_category)

    if request.method == 'POST':
        keyword = request.POST.get('keyword', '')
        book_list = Book.objects.filter(name__contains=keyword)
        query_category = 'all'

    paginator = Paginator(book_list, 5)
    page = request.GET.get('page')
    try:
        book_list = paginator.page(page)
    except PageNotAnInteger:
        book_list = paginator.page(1)
    except EmptyPage:
        book_list = paginator.page(paginator.num_pages)
    return render(request, 'library/view_book_list.html', locals())

def signup(request):
    if request.user.is_authenticated():
        return HttpResponseRedirect(reverse('homepage'))
    state = None
    if request.method == 'POST':
        password = request.POST.get('password', '')
        repeat_password = request.POST.get('repeat_password', '')
        if password == '' or repeat_password == '':
            state = 'password is not empty'
        elif password != repeat_password:
            state = 'password repeat_error'
        else:
            username = request.POST.get('username', '')
            if User.objects.filter(username=username):
                state = 'user_exist'
            else:
                new_user = User.objects.create_user(username=username, password=password,
                                                    email=request.POST.get('email', ''))
                new_user.save()
                new_my_user = MyUser(user=new_user, nickname=request.POST.get('nickname', ''))
                new_my_user.save()
                state = 'success'
    # content = {
    #     'active_menu': 'homepage',
    #     'state': state,
    #     'user': None,
    # }
    return render(request, 'library/singup.html', locals())




def login(request):
    if request.user.is_authenticated():
        return HttpResponseRedirect(reverse('homepage'))
    state = None
    if request.method == 'POST':
        username = request.POST.get('username', '')
        password = request.POST.get('password', '')
        user = auth.authenticate(username=username, password=password)
        if user is not None:
            auth.login(request, user)
            return HttpResponseRedirect(reverse('homepage'))
        else:
            state = 'not_exist_or_password_error'
    # content = {
    #     'active_menu': 'homepage',
    #     'state': state,
    #     'user': None,
    # }
    return render(request, 'library/login.html', locals())

def logout(request):
    auth.logout(request)
    return HttpResponseRedirect(reverse('homepage'))

def set_password(request):
    user = request.user
    state = None
    active_menu = 'homepage'
    if request.method == 'POST':
        old_password = request.POST.get('old_password', '')
        new_password = request.POST.get('new_password', '')
        repeat_password = request.POST.get('repeat_password', '')
        if user.check_password(old_password):
            if not new_password:
                state = 'empty'
            elif new_password != repeat_password:
                state = 'repeat_error'
            else:
                user.set_password(new_password)
                user.save()
                state = 'success'
        else:
            state = 'password_error'

    return render(request, 'library/set_password.html', locals())

def bookdetail(request):
    user = request.user if request.user.is_authenticated() else None
    bookid = request.GET.get('id', '')

    book = Book.objects.get(pk=bookid)
    print book.image_set.all()
    for img in book.image_set.all():
        print img.img

    return render(request, 'library/detail.html', locals())
# Create your views here.
