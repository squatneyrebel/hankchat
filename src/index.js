const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/user')
const app = express()
const server = http.createServer(app)
// we have explicitly created a server here ^^^ instead of letting express do it behind the scene
// so that we have access to the server object in the next statement vvv
const io = socketio(server)

const port = process.env.PORT || 3400
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('new web socket connection')

    // When a user sends a message
    socket.on('join', (options, callback) => {
        const { error, user } = addUser({ id: socket.id, ...options })

        if (error) {
            return callback(error)
        }

        socket.join(user.room)

        // When a user connects
        socket.emit('messageEvent', generateMessage('Admin', 'Welcome!'))
        socket.broadcast.to(user.room).emit('messageEvent', generateMessage('Admin', `${user.username} has joined the chat`))
        io.to(user.room).emit('roomdata', {
            room: user.room,
            users: getUsersInRoom(user.room)

        })
        callback()

    })


    socket.on('sendMessage', (msg, acknowledge) => {
        const user = getUser(socket.id)
        const filter = new Filter()
        if (filter.isProfane(msg)) {
            return acknowledge('Profanity is not allowed!')
        }
        io.to(user.room).emit('messageEvent', generateMessage(user.username, msg))
        acknowledge()
    })
    // When a user sends their location
    socket.on('sendLocation', (coords, acknowledge) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessageEvent',
            generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
        )
        acknowledge()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if (user) {
            io.to(user.room).emit('messageEvent', generateMessage('Admin', `${user.username} has left ${user.room}`))
            io.to(user.room).emit('roomdata', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
})

server.listen(port, () => {
    console.log(`Chat server up and listening on ${port}`)
}) 