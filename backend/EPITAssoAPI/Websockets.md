# WebSocket Messaging Documentation
## WebSocket Endpoint
### WebSocket URL
`ws/chat/<conversation_id>/`

- Method: WebSocket
- Path Parameter:
    - conversation_id: The ID of the conversation to which the message belongs.
- Query Parameter:
    - token: The authentication token of the user.

Example:
`ws://example.com/ws/chat/1/?token=jwtToken`

### WebSocket Event Types
The WebSocket connection supports the following event types:

#### 1. message_sent
**Description**: Sent when a new message is created in the conversation.

Message Format:

```json
{
  "type": "message_sent",
  "message": {
    "id": 1,
    "content": "Hello, World!",
    "sent_at": "2024-07-15T12:34:56Z",
    "author": {
      "id": 1,
      "username": "user1"
    },
    "association_sender": {
      "id": 1,
      "name": "Association 1"
    },
    "conversation": 1,
    "updated_at": "2024-07-15T12:34:56Z"
  }
}
```

##### Event Description:

- **type**: Indicates that the event is a message_sent event.
- **message**: Contains details of the message that was sent.

#### 2. message_deleted
**Description**: Sent when a message is deleted from the conversation.

```json
{
  "type": "message_deleted",
  "message": {
    "id": 1
  }
}
```

##### Event Description:

**type**: Indicates that the event is a message_deleted event.
**message**: Contains the ID of the message that was deleted.

#### 3. message_updated
**Description**: Sent when a message's content is updated in the conversation.

Message Format:

```json
{
  "type": "message_updated",
  "message": {
    "id": 1,
    "content": "Updated message content"
  }
}
```
Event Description:

**type**: Indicates that the event is a message_updated event.
**message**: Contains the updated content of the message.