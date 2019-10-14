const socket = io();
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');
const messageContainer = document.getElementById('message-container');

function setUp(){
    fetch('/room_name')
     .then((response) =>{
        let result = response.headers.get('x-room-name');
        let roomName = result;
        let name = prompt('What is your name?');
        if(name) {
        appendMessage('You Joined','user');}
    
        socket.emit('new-user',roomName,name);
        socket.on('user-connected',name =>{
          appendMessage(`${name}:connected`,'friend');
        });
    
        messageForm.addEventListener('submit',e =>{
            e.preventDefault();
            const message = messageInput.value;
            appendMessage(`You:${message}`,'user')
            socket.emit('chat-page-message',roomName,message);
            messageInput.value = '';
         })
     })
    };
setUp();

socket.on('chat-message',data =>{
	appendMessage(`${data.name}:${data.message}`,'friend');
});

socket.on('user-disconnected',name =>{
    appendMessage(`${name}:disconnected`,'friend');
});



function appendMessage(message,className){
	const messageElement = document.createElement('div');
    messageElement.innerHTML = message;
    messageElement.className = className;
	messageContainer.appendChild(messageElement);
    document.documentElement.scrollTop = 99999;
}
