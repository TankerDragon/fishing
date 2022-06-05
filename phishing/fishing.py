from telethon import TelegramClient, events
import datetime
from .models import Fish
from asgiref.sync import sync_to_async
from string import punctuation

added = 0
ch_array = ['~', ':', "'", '+', '[', '\\', '@', '^', '{', '%', '(', '-', '"', '*', '|', ',', '&', '<', '`', '}', '.', '_', '=', ']', '!', '>', ';', '?', '#', '$', ')', '/', ' ', '\n', '\t']
# Use your own values from my.telegram.org
api_id = 19217253
api_hash = 'a54f03b2dbe152fd65e26e4549ec8fe9'

client = TelegramClient('session', api_id, api_hash)

myChannelIDs = [-1001279009032,  #UZBroker-cha
                -1001170427503,  #All about trucks
                -1001200307642,  #UTXL
                -1001588755123,  #redwood load requests
                -1001260797603,  #fedex ups amazon
                -1001446810164,  #Trucking Dispatching has ID 
                -1001400105693,  #Truckers.group has ID 
                -1001493152718,  #UZBroker - chat
                -1001405278937,  #Dispatch Time
                -1001730877604,  #GOLD All About TRUCKS
                -1001461660790,  # Trucking Dispatching Brokers
                -1001400105693,  #Truckers.group
                -1001446810164,  #Trucking Dispatching
                ]     

@client.on(events.NewMessage(chats=myChannelIDs))
async def my_event_handler(event):    
    print(event.peer_id.channel_id)  #qaysi kanaldan keldi?
    # ch = event.peer_id.channel_id
    # ch = await client.get_entity(ch)
    # print('channel title: ', ch.title)  
    
    # print('######', event)
    # if event.from_id != None:
    #     print(event.from_id.user_id)     #.user_id   kim jo'natdi?
               
    print(event.message.id)          #msg id 'si
    print(event.date + datetime.timedelta(hours=5))  #jo'natilgan vaqt Toshkent vaqti
    f = Fish()
    f.message_id = event.message.id
    f.channel_id = event.peer_id.channel_id
    f.time = event.date + datetime.timedelta(hours=5)
    new_text = ''
    for character in event.text:
        if character.isalnum() or character in ch_array:
            new_text += character
    print(new_text)
    print(len(new_text))
    if len(new_text) > 2000:
        new_text = new_text[:2000]
    f.text = new_text
    print('*********************')
    if new_text != '':
        await sync_to_async(f.save)()


client.start()
client.run_until_disconnected()