const socket = io("http://localhost:8000", { transports: ["websocket"] });

// Get DOM elements in respective js variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container')

// Audios that will play on receiving messages & if user joins(or left) the chat
var audio1 = new Audio('./audio1.mp3');
var audio2 = new Audio('./audio2.mp3');

// function which will append event info to container
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

// If form gets submitted send it to sever (When you send any message)
form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const message = messageInput.value;
    append(`You: \n${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
});


// Ask new user for his/her name and let the server know
const name = prompt("Enter your name to Join DigiChat")
socket.emit('new-user-joined', name)

// If new user joins,receive the event from server
socket.on('user-joined', name=>{
    append(`${name} joined the chat`, 'mid');
});

// If server sends a message receive it
socket.on('receive', data=>{
    append(`${data.name }:\n ${data.message}`, 'left')
});

// If user leaves chat send update to container
socket.on('left', name=>{
    append(`${name} left the chat`, 'mid');
});
