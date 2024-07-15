from channels.generic.websocket import AsyncWebsocketConsumer
import json


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope["user"]
        if not user.is_authenticated:
            await self.close()

        self.conversation_id = self.scope["url_route"]["kwargs"]["conversation_id"]
        self.room_group_name = f"conversation_{self.conversation_id}"

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def send_chat_message(self, message_type, message):
        await self.send(
            text_data=json.dumps(
                {
                    "type": message_type,
                    "message": message,
                }
            )
        )

    async def chat_message_sent(self, event):
        await self.send_chat_message("message_sent", event["message"])

    async def chat_message_deleted(self, event):
        await self.send_chat_message("message_deleted", event["message"])

    async def chat_message_updated(self, event):
        await self.send_chat_message("message_updated", event["message"])
