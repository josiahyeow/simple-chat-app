const socket = io()
const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')

const name = prompt('What is your name?')
appendMessage('BOT', 'You joined')
socket.emit('new-user', name)

socket.on('user-connected', name => {
    appendMessage('BOT', `${name} connected`)
})

socket.on('chat-message', data => {
    appendMessage(data.name, data.message)
})

socket.on('user-disconnected', name => {
    appendMessage('BOT', `${name} disconnected`)
})

messageForm.addEventListener('submit', e => {
    e.preventDefault()
    const message = messageInput.value
    socket.emit('send-chat-message', message)
    messageInput.value = ''
    appendMessage('You', message)
})

function appendMessage(author, message) {
    const messageDiv = document.createElement('div')
    const nameSpan = document.createElement('span')
    nameSpan.className = 'name'
    const messageSpan = document.createElement('span')
    nameSpan.innerText = `${author}: `
    messageSpan.innerText = message
    messageDiv.appendChild(nameSpan)
    messageDiv.appendChild(messageSpan)
    messageContainer.append(messageDiv)
    messageContainer.scrollTop = messageContainer.scrollHeight
}