const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const path = require('path')

const { generateMessage, generateLocationMessage } = require('./utils/message')
const { isRealString } = require('./utils/validation')
const { Users } = require('./utils/users')

const publicPath = path.join(__dirname, '../public')
const app = express()

app.use(express.static(publicPath))

const server = http.createServer(app)
const users = new Users()

const io = socketIO(server)
io.on('connection', (socket) => {
	console.log('New user connected')

	socket.on('join', (params, callback) => {
		if (!isRealString(params.name) || !isRealString(params.room)) {
			return callback('Name and room name are required.')
		}

		socket.join(params.room)
		users.removeUser(socket.id)
		users.addUser(socket.id, params.name, params.room)

		io.to(params.room).emit('updateUserList', users.getUserList(params.room))
		socket.emit(
			'newMessage',
			generateMessage('Admin', 'Welcome to the chat app')
		)
		socket.broadcast
			.to(params.room)
			.emit(
				'newMessage',
				generateMessage('Admin', `${params.name} has joined.`)
			)

		callback()
	})

	socket.on('createMessage', ({ from, text }, callback) => {
		io.emit('newMessage', generateMessage(from, text))
		callback()
	})

	socket.on('createLocationMessage', ({ latitude, longitude }) => {
		io.emit(
			'newLocationMessage',
			generateLocationMessage('Admin', latitude, longitude)
		)
	})

	socket.on('disconnect', () => {
		var user = users.removeUser(socket.id)

		if (user) {
			io.to(user.room).emit('updateUserList', users.getUserList(user.room))
			io
				.to(user.room)
				.emit('newMessage', generateMessage('Admin', `${user.name} has left.`))
		}
	})
})

const PORT = process.env.PORT || 3000
server.listen(PORT, () => console.log(`Listening on port ${PORT}`))
