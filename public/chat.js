$(function(){
    // Make connection.
    // var socket = io.connect('http://localhost:3000');
    var socket = io();


    // Buttons and inputs
    //var message = $("#message");
    var UNDA = $("#usernameDisplayArea");
    var messages = $(".messages");
    var username = $("#username");
    var send_message = $("#send_message");
    var send_username = $("#send_username");
    var chatroom = $("#chatroom");
    var usernameInput = $("#usernameInput");
    var chatroomInput = $("#chatroomInput");
    var inputMessage = $('.inputMessage'); // Input message input box
    var clientWindow = $(window);

    var loginPage = $('.login.page'); // The login page
    var chatPage = $('.chat.page'); // The chatroom page

    var clientUsername;
    var clientChatroom;
    var currentUsernameInput = usernameInput.focus();


    console.log('New user connected.');

    // Attempting to recieve initial username value
    socket.usernameInput = "Anonymous";

    const setUsername = () => {

        clientUsername = currentUsernameInput.val().trim();
        clientChatroom = chatroomInput.val();
        // If the username is valid
        if (clientUsername) {
            username = clientUsername;
            loginPage.fadeOut();
            chatPage.show();
            loginPage.off('click');

            socket.emit('change_username', {
                username: clientUsername,
                chatroom: clientChatroom,
            });
            
        }
    }

    clientWindow.keydown(event => {

        // When the client hits ENTER on their keyboard
        if (event.which === 13) {

            if (clientUsername) {
                sendMessage();
            } else {
                setUsername();
                UNDA.append(clientUsername + `<pre>    Room: ${clientChatroom}</pre>`);
                socket.emit('username_selected', {
                    username: clientUsername,
                    chatroom: clientChatroom,
                });
                socket.emit('add_user',{ 
                    username: clientUsername, 
                    chatroom: clientChatroom,
                 });
            }
        }
    });
    // ^ Attempting to recieve initial username value ^

    // Attempting to Send messages
    // Sends a chat message
    const sendMessage = () => {
        var providedMessage = inputMessage.val();

        if (providedMessage) {

            inputMessage.val('');

            socket.emit('new_message', {
                username: clientUsername, 
                chatroom: clientChatroom, 
                message: providedMessage
            });
            console.log("Emitting message clause passed.");
            messages.append("<p class='message'>" + clientUsername + ": " + providedMessage + "<p>")
        }
    }
    // ^ Attempting to Send messages ^

    // Default User Name
    socket.username = "Anonymous";

    // Emit message
    send_message.click(function(){
        socket.emit('new_message', {
            username: clientUsername,
            chatroom: clientChatroom,
            message : inputMessage.val(),
        })
    });

    // Listen for an login emit
    socket.on('login',(data) => {
        updateUserList(data.userlist);
    })

    // Listen on new_message
    socket.on('new_message', (data) => {
        console.log(data)
        // chatroom.append("<p class='message'>" + data.username + ": " + data.message + "<p>")
        messages.append("<p class='message'>" + data.message.username + ": " + data.message.message + "</p>")
    });

    // Client side announcement of a new incoming user.
    socket.on('client_connection', (data) => {
        updateUserList(data.userlist);
        messages.append("<p class='message'>" + data.message + "</p>");
    });

    // Client side announcement of a username selected. aka user joined
    socket.on('username_selected', (data) => {
        updateUserList(data.userlist);
        console.log(data.userlist);
        messages.append("<p class='message'>" + data.username + " has joined. " + "</p>")
    });

    socket.on('user left', (data) => {
        updateUserList(data.userlist);
        messages.append(`<p class='message'>${data.username} has left room ${data.chatroom}.</p>`)
    });

    // Emit a username
    send_username.click(() => {
        console.log(username.val())
        socket.emit('change_username', {
            username : username.val(),
            chatroom: clientChatroom,
        })
    });

    /*
    socket.on('change_username', (data) => {
        console.log(username.val() + "changed...");
        socket.username = data.username;
    });
    */
   
    function updateUserList(userlist){
        let userlistDisplay = document.getElementById("users");

        let displayString = ``;
        for(user of userlist){
            console.log(`adding ${user} to list`);
            displayString = displayString.concat(`<p class='message'>${user}</p>`);    
        }
        userlistDisplay.innerHTML = displayString;
    }
});