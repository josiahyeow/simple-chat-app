const express = require('express')
const socketIO = require('socket.io')

const PORT = process.env.PORT || 3000
const INDEX = '/index.html'

const server = express()
    .use(express.static('public'))
    .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
    .listen(PORT, () => console.log(`Listening on ${PORT}`))

const io = socketIO(server)

const users = {}

io.on('connection', socket => {
    socket.on('new-user', name => {
        users[socket.id] = name
        io.emit('user-connected', name, users)
    })
    socket.on('send-chat-message', message => {
        socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
    })
    socket.on('disconnect', () => {
        const oldUser = users[socket.id]
        delete users[socket.id]
        socket.broadcast.emit('user-disconnected', oldUser, users)
    })
})