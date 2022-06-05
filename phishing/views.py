from django import http
from django.http import HttpResponse
from django.shortcuts import render
import string
from rest_framework.response import Response
from .models import Fish
from rest_framework.decorators import api_view
from .serializers import FishSerializer
# from .fishing import added``

def main(request):
    return render(request, 'telesam.html')


@api_view(['GET'])
def getData(request):
    if request.method == "GET":
            queryset = Fish.objects.all().order_by('-time')
            serializer = FishSerializer(queryset, many=True)
            return Response(serializer.data)
    else:
        return HttpResponse('This page does not support the type of your request')


#bir sutka davomida chiqqan yuklarni hammasini DIV qilib olsin, 
#kerSSak bo'lganlarini, search qilib bersin. Type qilishi bilan filtrlanaversin.



# async def main():
#     for c in myChannelIDs:
#         ch = await client.get_entity(c)
#         print('channel ID: ', ch.id)
#         print('channel title: ', ch.title)
#         print('channel username: ', ch.username)
#         print()
    
# with client:
#     client.loop.run_until_complete(main())