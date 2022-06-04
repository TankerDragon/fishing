from django.http import HttpResponse
from django.shortcuts import render
import string
from .fishing import added

def main(request):
    return HttpResponse('added')
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