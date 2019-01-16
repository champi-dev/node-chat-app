const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const path = require('path')

const {generateMessage} = require('./utils/message')

const publicPath = path.join(__dirname, '../public')
const app = express()

app.use(express.static(publicPath))

const server = http.createServer(app)

const io = socketIO(server)
io.on('connection', (socket) => {
  console.log('New user connected')

  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'))

  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'))

  socket.on('createMessage', ({from, text}) => {
    io.emit('newMessage', generateMessage(from, text))
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