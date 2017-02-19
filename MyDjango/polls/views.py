#-*- coding:utf-8 -*-
from django.shortcuts import render, get_object_or_404, render_to_response
from django.http import HttpResponse, HttpResponseRedirect
from django.http import Http404
from django.template import Context, loader
from django.core.urlresolvers import reverse
from polls.models import Poll, Choice
from .models import UploadFileForm
import os
import csv
from io import BytesIO
from reportlab.pdfgen import canvas
from django.conf import settings
# Imaginary function to handle an uploaded file.
#from somewhere import handle_uploaded_file


def download_pdf(request):
# Create the HttpResponse object with the appropriate PDF headers.
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="somefilename.pdf"'
    buffer = BytesIO()
    # Create the PDF object, using the BytesIO object as its "file."
    p = canvas.Canvas(buffer)
    # Draw things on the PDF. Here's where the PDF generation happens.
    # See the ReportLab documentation for the full list of functionality.
    p.drawString(100, 100, "Hello world.")
    # Close the PDF object cleanly.
    p.showPage()
    p.save()
    # Get the value of the BytesIO buffer and write it to the response.
    pdf = buffer.getvalue()
    buffer.close()
    response.write(pdf)
    return response
#    response = HttpResponse(content_type='application/pdf')
#    response['Content-Disposition'] = 'attachment; filename="download.pdf"'
#    # Create the PDF object, using the response object as its "file."
#    p = canvas.Canvas(response)
#    # Draw things on the PDF. Here's where the PDF generation happens.
#    # See the ReportLab documentation for the full list of functionality.
#    p.drawString(200, 100, "你好.")
#    # Close the PDF object cleanly, and we're done.
#    p.showPage()
#    p.save()
#    return response

def download_csv(request):
# Create the HttpResponse object with the appropriate CSV header.
    response = HttpResponse(content_type='text/xls')
    response['Content-Disposition'] = 'attachment; filename="somefilename.xls"'
    writer = csv.writer(response)
    writer.writerow(['First row', 'Foo', 'Bar', 'Baz'])
    writer.writerow(['Second row', 'A', 'B', 'C', '"Testing"', "Here's a quote"])
    return response

#def upload_file(request):  
#    if request.method == "POST":    # 请求方法为POST时，进行处理
#        print request.POST 
#        myFile = request.FILES.get("myfile", None)    # 获取上传的文件，如果没有文件，则默认为None
#        print myFile
#        if not myFile:  
#            return HttpResponse("no files for upload!")
#        if not os.path.exists('E:\\upload'):
#            os.makedirs('E:\\upload')
#        destination = open(os.path.join("E:\\upload",myFile.name),'wb+')    # 打开特定的文件进行二进制的写操作  
#        for chunk in myFile.chunks():      # 分块写入文件  
#            destination.write(chunk)  
#        destination.close()  
#        return HttpResponse("upload over!")  
#    else:
#        return render(request, 'polls/upload.html')

def upload_file(request):
    if request.method == 'POST':
        print 'post'
        print settings.BASE_DIR
        form = UploadFileForm(request.POST, request.FILES)
        print form.is_valid()
        if form.is_valid():
            print request.FILES['file']
            handle_uploaded_file(request.FILES['file'])
            return HttpResponse("upload over!")
    else:
        form = UploadFileForm()
    return render(request, 'polls/upload.html', {'form': form})


def handle_uploaded_file(f):
    with open(os.path.join("E:\\upload", f.name),'wb+') as destination:
        for chunk in f.chunks():
            destination.write(chunk)
#def detail(request, poll_id):
#    try:
#        poll = get_object_or_404(Poll, pk=poll_id)
#    except Poll.DoesNotExist:
#        raise Http404
#    return render(request, 'polls/detail.html', {'poll': poll})
#
#def results(request, poll_id):
#    poll = get_object_or_404(Poll, pk=poll_id)
#    return render(request, 'polls/results.html', {'poll': poll})

def vote(request, poll_id):
    p = get_object_or_404(Poll, pk=poll_id)
    try:
        selected_choice = p.choice_set.get(pk=request.POST['choice'])
    except (KeyError, Choice.DoesNotExist):
    # Redisplay the poll voting form.
        return render(request, 'polls/detail.html', {
        'poll': p,
        'error_message': "You didn't select a choice.",
        })
    else:
        selected_choice.votes += 1
        selected_choice.save()
        # Always return an HttpResponseRedirect after successfully dealing
        # with POST data. This prevents data from being posted twice if a
        # user hits the Back button.
        return HttpResponseRedirect(reverse('polls:results', args=(p.id,)))

#def index(request):
#    latest_poll_list = Poll.objects.order_by('-pub_date')[:5]
##    template = loader.get_template('polls/index.html')
#    context = {'latest_poll_list': latest_poll_list}
##    context = Context({
##                   'latest_poll_list': latest_poll_list,
##    })
#    return render(request, 'polls/index.html', context)
#    return HttpResponse(template.render(context))

# Create your views here.
