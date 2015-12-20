$(document).ready(function() {
betabud.online = {};
var socket = io.connect('http://betabud.dandart.co.uk:8080');
function writeonline() {
    html = '';
    $.each(betabud.online, function(k,v) {
        html+= v+'<br/>';
    });
    $('.people').html(html);
}
function writemessage(data) {
    writeline(data.from + ' said: '+data.text);
}
function writeline(text) {
    html = $('.chatlog').html();
    $('.chatlog').html(html + text +'<br/>');
}
socket.on('connect', function() {
    socket.emit('heartbeat', {name: betabud.nickname});
    betabud.online[socket.id] = betabud.nickname;
    writeonline();
    $('.chatlog').html('');
});
socket.on('whosonline', function(data) {
    betabud.online = data;
    writeonline();
});
socket.on('offline', function(data) {
    writeline(betabud.online[data.id] + ' is offline');
    delete betabud.online[data.id];
    writeonline();
});
socket.on('online', function(data) {
    betabud.online[data.id] = data.name;
    writeonline();
    writeline(data.name + ' is online');
});
socket.on('message', function(data) {
    writemessage(data);
});
$('#form #submit').click(function(event) {
    event.preventDefault();
    text = $('#chatline').val();
    $('#chatline').val('');
    msg = {from:betabud.nickname, text:text};
    socket.emit('message',msg);
    writemessage(msg);
    return false;
});
});
