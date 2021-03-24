const socketio = require('socket.io');
const redis = require("socket.io-redis");
const jwt = require('jsonwebtoken');

const { secretKey, redisSettings } = require('@sv/env');

exports.SocketManager = class {
  constructor(server) {
    this.users = {};

    /** @type {socketio.Server} */
    this._io = socketio(server, {
      destroyUpgrade: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      }
    })

    this._io.adapter(redis({ host: redisSettings.host, port: redisSettings.port }))
    this._io.use(this._checkUser)
    this._io.on('connection', this._connection)
  }

  _checkUser = async (client, next) => {
    try {
      const { AccessToken } = this._models;

      if (!client.handshake.query['access_token']) {
        return next(new Error("Unauthorization"))
      }

      try {
        const token = jwt.verify(client.handshake.query['access_token'], secretKey)
        this.users[client.id] = token.userId
        next()
      } catch (_) {
        next(new Error("Unauthorization"))
      }
    } catch (error) {
      console.error(error);
      next(new Error('Internal Error'))
    }
  }

  /**
   * @param {socketio.Socket} client
   */
  _connection = async (client) => {
    // join to room of this user to support multi devices
    await client.join(this._getUserRoom(this.users[client.id]))

    // event fired when the chat room is disconnected
    client.on("disconnect",async () => {
      for (const room of client.rooms) {
        if (typeof room === 'string') {
          await client.leave(room)
        }
      }
      delete this.users[client.id]
    });
  }

  /**
   * @param {string} id user id
   * @returns {string}
   */
  _getUserRoom(id) {
    return `/user-chat/${id}`
  }

  /**
   * @param {*} userId
   * @param  {...any} data
   * @returns
   */
  sendNewMessage(userId, ...data) {
    return this._io.to(this._getUserRoom(userId)).emit('NewMessage', ...data)
  }
}