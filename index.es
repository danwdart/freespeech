import socketio from 'socket.io';

var io = socketio.listen(8080);
io.sockets.on('connection', (socket) => {
    socket.on('message', (msg) => socket.broadcast.emit('message', msg)
});
