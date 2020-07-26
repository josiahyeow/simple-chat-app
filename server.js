const express = require('express')
const socketIO = require('socket.io')

const PORT = process.env.PORT || 3000
const INDEX = '/index.html'

const app = express()
const server = app
    .set('views', './views')
    .set('view engine', 'ejs')
    .use(express.static('public'))
    .use(express.urlencoded({ extended: true }))
    .listen(PORT, () => console.log(`Listening on ${PORT}`))

const io = socketIO(server)

const rooms = { }

app.get('/', (req, res) => {
    res.render('index', { rooms: rooms })
})

app.post('/room', (req, res) => {
    if(rooms[req.body.room] != null){
        return res.redirect('/')
    }
    rooms[req.body.room] = { users: {} }
    res.redirect(req.body.room)
    io.emit('room-created', req.body.room)
})

app.get('/:room', (req, res) => {
    if(rooms[req.params.room] == null) {
        return res.redirect('/')
    }
    res.render('room', { roomName: req.params.room })
})

io.on('connection', socket => {
    socket.on('new-user', (room, name) => {
        socket.join(room)
        rooms[room].users[socket.id] = name
        io.to(room).emit('user-connected', name, rooms[room].users)
    })
    socket.on('send-chat-message', (room, message) => {
        socket.to(room).emit('chat-message', { message: message, name: rooms[room].users[socket.id] })
    })
    socket.on('disconnect', () => {
        getUserRooms(socket).forEach(room => {
            const oldUser = rooms[room].users[socket.id]
            delete rooms[room].users[socket.id]
            socket.to(room).emit('user-disconnected', oldUser, rooms[room].users)
        })
    })
})

function getUserRooms(socket) {
    return Object.entries(rooms).reduce((names, [name, room]) => {
        if (room.users[socket.id] != null) names.push(name)
        return names
    }, [])
}