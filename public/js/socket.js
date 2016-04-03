let freespeech = {
    nickname: 'Anonymous'+String(Math.floor(1000000*Math.random())),
    online: {}
};

function writeonline() {
    html = '';
    $.each(freespeech.online, function(k,v) {
        html+= v+'<br/>';
    });
    $('.people').html(html);
}
function writemessage(data) {
    writeline(data.from + ' said: '+data.text);
}
function writeline(text) {
    $('.chatlog').html(getchatlog() + text +'<br/>');
}
function clearchatlog() {
    $('.chatlog').html('');
}
function getchatlog() {
    return $('.chatlog').html();
}
function clearchatline() {
    $('#chatline').val('');
}
function getchatline() {
    return $('#chatline').val()
}
function genmessage(text) {
    return {
        from: freespeech.nickname,
        text: text
    };
}

$(document).ready(() => {
    let socket = io.connect(window.location.host);

    socket.on('connect', function() {
        socket.emit('heartbeat', {name: freespeech.nickname});
        freespeech.online[socket.id] = freespeech.nickname;
        writeonline();
        clearchatlog()
    });
    socket.on('whosonline', function(data) {
        freespeech.online = data;
        writeonline();
    });
    socket.on('offline', function(data) {
        writeline(freespeech.online[data.id] + ' is offline');
        delete freespeech.online[data.id];
        writeonline();
    });
    socket.on('online', function(data) {
        freespeech.online[data.id] = data.name;
        writeonline();
        writeline(data.name + ' is online');
    });
    socket.on('message', function(data) {
        writemessage(data);
    });

    $('#form').submit((event) => {
        event.preventDefault();
        let msg = genmessage(getchatline());

        clearchatline();

        socket.emit('message', msg);
        writemessage(msg);
    });
});
