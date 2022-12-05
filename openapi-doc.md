## Connect to /socket.io

- Add query param `ws://{{chat-endpoint}}/socket.io/?jwt_token={{jwt}}` for authentication

- If token is unauthenticated, service will return error message `Unauthorization`

### Events

- When user have new message, service will send to event name `NewMessage`

```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "timestamp": "2021-05-20T08:30:17.926Z",
  "content": "string",
  "sender_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "friendship_id": 0,
  "group_id": 0,
  "attachments": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "messageId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "group_id": 0,
      "url": "string",
      "created": "2021-05-20T08:30:17.926Z",
      "modified": "2021-05-20T08:30:17.926Z"
    }
  ]
}
```

- When having new member, service will send to event name `NewMember`

```json
{
  "member_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "group_id": 0,
  "viewed_message_time": "2021-05-20T08:32:35.923Z",
  "viewed_message_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "created": "2021-05-20T08:32:35.923Z",
  "modified": "2021-05-20T08:32:35.923Z",
  "member_info": {
    "uuid": "string",
    "id": 0,
    "username": "string",
    "email": "string",
    "profile": {
      "name": "string",
      "avatar": "string"
    }
  }
}
```

- When deleted member, server will send event `DeleteMember`

```json
{
  "member_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "group_id": 0,
  "viewed_message_time": "2021-05-20T08:32:35.923Z",
  "viewed_message_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "created": "2021-05-20T08:32:35.923Z",
  "modified": "2021-05-20T08:32:35.923Z"
}
```

- When user viewed, service will send to event name `ViewedMessage`

```json
{
  "member_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "group_id": 0,
  "viewed_message_time": "2021-05-20T08:32:35.923Z",
  "viewed_message_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "created": "2021-05-20T08:32:35.923Z",
  "modified": "2021-05-20T08:32:35.923Z"
}
```

- When group updated, service will send to event name `UpdatedGroup`

```json
{
  "id": 0,
  "name": "string",
  "owner_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "friend_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "group_avatar": "string",
  "last_message_time": "2021-05-20T08:36:15.139Z",
  "created": "2021-05-20T08:36:15.139Z",
  "modified": "2021-05-20T08:36:15.139Z"
}
```