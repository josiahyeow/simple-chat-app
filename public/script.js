const socket = io()

const usersContainer = document.getElementById('users-container')

const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')

const name = prompt('What is your name?')
socket.emit('new-user', name)

socket.on('user-connected', (newUser, allUsers) => {
    appendMessage('BOT', `${newUser} connected`)
    updateUsers(allUsers)
})

socket.on('chat-message', data => {
    appendMessage(data.name, data.message)
})

socket.on('user-disconnected', (oldUser, allUsers) => {
    appendMessage('BOT', `${oldUser} disconnected`)
    updateUsers(allUsers)
})

messageForm.addEventListener('submit', e => {
    e.preventDefault()
    const message = messageInput.value
    socket.emit('send-chat-message', message)
    messageInput.value = ''
    appendMessage('You', message)
})

function appendMessage(author, message) {
    const nameSpan = document.createElement('span')
    nameSpan.className = 'name'
    nameSpan.innerText = `${author}: `

    const messageSpan = document.createElement('span')
    messageSpan.innerText = message

    const messageDiv = document.createElement('div')
    messageDiv.className = 'bubble'
    messageDiv.appendChild(nameSpan)
    messageDiv.appendChild(messageSpan)

    const rowDiv = document.createElement('div')
    if(author == 'You') {
        rowDiv.className = 'row you'
    }
    else {
        rowDiv.className = 'row'
    }
    rowDiv.appendChild(messageDiv)

    messageContainer.append(rowDiv)
    messageContainer.scrollTop = messageContainer.scrollHeight
}

function updateUsers(users) {
    usersContainer.innerHTML = ''
    Object.values(users).forEach(user => {
        console.log(user)
        appendUser(user)
    })
}

function appendUser(user) {
    const userDiv = document.createElement('div')
    userDiv.id = 'user'
    userDiv.className = 'box'
    userDiv.innerText = user
    usersContainer.append(userDiv)
}