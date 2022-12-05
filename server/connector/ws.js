import { Server } from 'socket.io';
import redis from "socket.io-redis";
import SocketEmitter from 'socket.io-emitter';

import { allowOrgins } from '#sv/env.js';
import { redisClient } from './redis.js';
import { parseJWT } from './auth.js';
import { setActiveUser, setDeacticeUser } from '#lib/check-user-active.js';

class SocketManager {
  constructor() {
    /** @type {{[k: string]: string}} */
    this.users = {};
  }

  init(server) {
    this._io = new Server(server, {
      allowEIO3: true,
      destroyUpgrade: false,
      cors: {
        origin: allowOrgins,
        methods: ["GET", "POST"],
      }
    })

    const subClient = redisClient.duplicate();
    this._io.adapter(redis({
      pubClient: redisClient,
      subClient,
    }))

    this._io.use(this._checkUser)
    this._io.on('connection', this._connection)

    // catch error from redis adapter
    this._io.of('/').adapter.on("error", function (error) {
      console.error(error);
    });
  }

  initWorker() {
    this._io = SocketEmitter(redisClient)
  }

  /**
   * @param {socketio.Socket} client
   * @param {Function} next
   */
  _checkUser = async (client, next) => {
    try {
      if (client.handshake.query['jwt_token']) {
        const info = parseJWT(client.handshake.query['jwt_token'])
        this.users[client.id] = info.sub
      } else if (client.handshake.headers['jwt_token']) {
        const info = parseJWT(client.handshake.headers['jwt_token'])
        this.users[client.id] = info.sub
      } else
        throw new Error()
      next()
    } catch (_) {
      client.emit('NewConnection', { success: false })
      next(new Error("Unauthorization"))
    }
  }

  /**
   * @param {socketio.Socket} client
   */
  _connection = async (client) => {
    // join to room of this user to support multi devices
    await client.join(this._getUserRoom(this.users[client.id]))

    await setActiveUser({
      userId: this.users[client.id],
      connectionId: client.id,
    })

    // event fired when the chat room is disconnected
    client.on("disconnect",async () => {
      for (const room of client.rooms) {
        if (typeof room === 'string') {
          await client.leave(room)
        }
      }

      await setDeacticeUser(this.users[client.id], client.id).catch(console.error)
      delete this.users[client.id]
    });

    // client.on('join-group-chat',async (id) => {
    //   const m = await Member.findOne({
    //     where: {
    //       member_id: this.users[client.id],
    //       group_id: id,
    //     }
    //   })
    //   if (m) {
    //     console.log(`WS: user ${this.users[client.id]} join group ${id}`);
    //     await client.join(this._getGroup(id))

    //     client.emit('join-group-chat', {success: true})
    //   } else
    //     client.emit('join-group-chat', {success: false})
    // })
    // client.on('leave-group-chat', async (id) => {
    //   const room = this._getGroup(id)
    //   if (client.rooms.has(room)) {
    //     console.log(`WS: user ${this.users[client.id]} leave group ${id}`);
    //     await client.leave(room)

    //     client.emit('leave-group-chat', {success: true})
    //   } else
    //     client.emit('leave-group-chat', {success: false})
    // })

    client.emit('NewConnection', {success: true})
  }

  /**
   * @param {string} id user id
   * @returns {string}
   */
  _getUserRoom(id) {
    return `/user-chat/${id}`
  }

  /**
   * @param {string} id user id
   * @returns {string}
   */
   _getGroup(id) {
    return `/group/${id}`
  }

  /**
   * @param {string} userId
   * @param {string} eventName
   * @param  {...any} data
   * @returns
   */
  sendUserEvent(userId, eventName, ...data) {
    console.log(`WS: ${eventName} send to ${userId}`);
    return this._io.to(this._getUserRoom(userId)).emit(eventName, ...data)
  }

  /**
   * @param {number} groupId
   * @param {string} eventName
   * @param  {...any} data
   * @returns
   */
  sendGroupEvent(groupId, eventName, ...data) {
    return this._io.to(this._getGroup(groupId)).emit(eventName, ...data)
  }

  sendNewMessage(groupId, ...data) {
    return this.sendGroupEvent(groupId, 'NewMessage', ...data)
  }

  sendNewMember(groupId, ...data) {
    return this.sendGroupEvent(groupId, 'NewMember', ...data)
  }

  sendViewedMessage(groupId, ...data) {
    return this.sendGroupEvent(groupId, 'ViewedMessage', ...data)
  }

  sendUpdatedGroup(groupId, ...data) {
    return this.sendGroupEvent(groupId, 'UpdatedGroup', ...data)
  }

  sendDeleteMember(groupId, ...data) {
    return this.sendGroupEvent(groupId, 'DeleteMember', ...data)
  }
}

export const socketManager = new SocketManager()
export const eventType = {
  NewMessage: 'NewMessage',
  NewMember: 'NewMember',
  ViewedMessage: 'ViewedMessage',
  UpdatedGroup: 'UpdatedGroup',
  DeleteMember: 'DeleteMember',
}
