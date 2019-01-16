const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const path = require('path')

const publicPath = path.join(__dirname, '../public')
const app = express()

app.use(express.static(publicPath))

const server = http.createServer(app)

const io = socketIO(server)
io.on('connection', (socket) => {
  console.log('New user connected')

  socket.emit('newMessage', {
    from: 'Admin',
    text: 'Welcome to the chat app',
    createdAt: Date.now()
  })

  socket.broadcast.emit('newMessage', {
    from: 'Admin',
    text: 'New user joined',
    createdAt: Date.now()
  })

  socket.on('createMessage', (message) => {
    console.log('createMessage', message)
    io.emit('newMessage', {
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime()
    })
    // socket.broadcast.emit('newMessage', {
    //   from: message.from,
    //   text: message.text,
    //   createdAt: Date.now()
    // })
  })

  socket.on('disconnect', () => {
    console.log('User was disconnected')
  })
})

const PORT = process.env.PORT || 3000
server.listen(PORT, () => console.log(`Listening on port ${PORT}`))