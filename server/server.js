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
    from: 'John',
    text: 'See you then',
    createdAt: 123123
  })

  socket.on('createMessage', (message) => {
    console.log('createMessage', message)
  })

  socket.on('disconnect', () => {
    console.log('User was disconnected')
  })
})

const PORT = process.env.PORT || 3000
server.listen(PORT, () => console.log(`Listening on port ${PORT}`))