const socket = io("http://localhost:8000", { transports: ["websocket"] });

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container')

var audio1 = new Audio('./audio1.mp3');
var audio2 = new Audio('./audio2.mp3');

const append = (message, position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position)
    messageContainer.append(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;
    if(position == 'left'){
        console.log('sound is playing');
        audio1.play();
    }
    else if(position == 'mid'){
        console.log('sound is playing');
        audio2.play();
    }
}

form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const message = messageInput.value;
    append(`You: \n${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
})

const name = prompt("Enter your name to Join DigiChat")
socket.emit('new-user-joined', name)

socket.on('user-joined', name=>{
    append(`${name} joined the chat`, 'mid');
})

socket.on('receive', data=>{
    append(`${data.name }:\n ${data.message}`, 'left')
})

socket.on('left', name=>{
    append(`${name} left the chat`, 'mid');
})