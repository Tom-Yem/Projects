const path = require('path');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server); 

let rooms = {};
let roomName ='';
app.use(express.urlencoded({extended:true}));

// for getting first page first image
app.get('/chat-image', (req,res) =>{
    res.sendFile(__dirname + '/chat-icon.png')
})

// for getting first page second image
app.get('/chat-image2', (req,res) =>{
    res.sendFile(__dirname + '/black.jpg')
});

app.get('/fetch.umd.js',(req,res) =>{
    res.sendFile(__dirname + '/fetch.umd.js')
});

//for getting second page's script
app.get('/script.js',(req,res) =>{
	res.sendFile(path.join(__dirname + '/script.js')) 
});

//for getting first pages's script
app.get('/script2.js',(req,res) =>{
	res.sendFile(path.join(__dirname + '/script2.js'))
});

app.get('/room_names', (req,res) =>{
	res.header('x-room-names',JSON.stringify(rooms)).send();
});

//Home-page route
app.get('/',(req,res) =>{
	res.sendFile(path.join(__dirname + '/rooms.html'));
});

//for registering rooms 
app.post('/room',(req,res) =>{
	if( rooms[req.body.room] != null){
		return res.redirect('/');
	}
   rooms[req.body.room] = { users:{} };
   res.redirect(req.body.room);  
});

//for fetching the current room-name
app.get('/room_name', (req,res) =>{
    res.header('x-room-name',roomName).send();  
});

//the chat-page route
app.get('/:room',( req,res) =>{
	if( rooms[req.params.room] == null){
        return res.redirect('/');
	};
	roomName = req.params.room;
	res.sendFile(path.join(__dirname + '/chat-page.html'));
});

//socket io's first and main event handler
io.on('connection',socket =>{
	socket.on('new-user',(room,name) =>{
	console.log(room);
	 rooms[room].users[socket.id] = name;
	 socket.join(room);
	 socket.to(room).broadcast.emit('user-connected',name);
	 
	});
    socket.on('chat-page-message',(room,message) =>{
	socket.to(room).broadcast.emit('chat-message',{message:message,name:rooms[room].users[socket.id]
	})
});
    socket.on('disconnect',() =>{
		getUserRooms(socket).forEach( room=>{
		   socket.to(room).broadcast.emit('user-disconnected',rooms[room].users[socket.id]);
		   delete rooms[room].users[socket.id];
		});
    });
function getUserRooms(socket){
	//for getting room-name of all disconnected users
	return Object.entries(rooms).reduce((names,[name,room]) =>{
	   if( room.users[socket.id] != null) names.push(name)
	   return names
	},[])
};
});

const port = process.env.PORT || 3000;
server.listen(port,() => console.log(`Listening on port ${port}...`));