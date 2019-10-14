const socket = io();
const containerElement = document.getElementById('container');

function listRooms(){
  fetch('/room_names')
    .then((response)=>{
      let result = response.headers.get('x-room-names');
      let rooms = JSON.parse( result);
   
      for(let room in rooms){
       const roomElement = document.createElement('div');
       roomElement.textContent = room;
       roomElement.className = 'room-name';
       const roomLink = document.createElement('a');
       roomLink.href = `/${room}`;
       roomLink.innerHTML = '&#9758 Join';
       containerElement.appendChild(roomElement);
       containerElement.appendChild(roomLink);
     }
    })
     
  };
listRooms();
