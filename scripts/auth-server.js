import { createServer } from 'http';

const data = {
  'Token 123456789': {
    "uuid": "9c0d9603-b2bb-4bfa-a317-c7ec71a15a6e",
    "profile": {
      "name": "user0353557412",
    },
  },
  'Token 1234567891': {
    "uuid": "9c0d9603-123b-4bfa-a317-c7ec71a15a6e",
    "profile": {
      "name": "123b",
    },
  },
}

/** @type {http.RequestListener} */
const requestListener = function (req, res) {
  const userInfo = data[req.headers.authorization]
  if (!userInfo) {
    res.writeHead(401);
    res.end(JSON.stringify({
      error: 'invalid token'
    }))
  }

  res.writeHead(200);
  if (req.url.startsWith('/api/auth/user/')) {
    res.end(JSON.stringify(userInfo));
  } else if (req.url.startsWith('/api/auth/list-user/')) {
    const content = []
    for (const key in data) {
      if (key !== req.headers.authorization)
        content.push(data[key])
    }

    res.end(JSON.stringify(content))
  } else {
    res.end('')
  }
}

const server = createServer(requestListener);
server.listen(8008);