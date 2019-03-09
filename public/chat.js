$(function(){
    // Make connection.
    // var socket = io.connect('http://localhost:3000');
    var socket = io();


    // Buttons and inputs
    var message = $("#message");
    var username = $("#username");
    var send_message = $("#send_message");
    var send_username = $("#send_username");
    var chatroom = $("#chatroom");
    var usernameInput = $(".usernameInput");
    var clientWindow = $(window);

    var loginPage = $('.login.page'); // The login page
    var chatPage = $('.chat.page'); // The chatroom page

    var clientUsername;
    var currentUsernameInput = usernameInput.focus();

    // Listen for connections
    // io.on('connection', (socket) => {
        console.log('New user connected.');

        // Attempting to recieve initial username value
        socket.usernameInput = "Anonymous";

        const setUsername = () => {
            // clientUsername = cleanInput(currentUsernameInput.val().trim());
            clientUsername = currentUsernameInput.val().trim();

            // If the username is valid
            if (clientUsername) {
              loginPage.fadeOut();
              chatPage.show();
              loginPage.off('click');
              //$currentInput = $inputMessage.focus();
        
              // Tell the server your username
              // socket.emit('add user', clientUsername);
              socket.emit('change_username', clientUsername);
            }
          }

         clientWindow.keydown(event => {
            // Auto-focus the current input when a key is typed
            if (!(event.ctrlKey || event.metaKey || event.altKey)) {
              //$currentInput.focus();
            }
            // When the client hits ENTER on their keyboard
            if (event.which === 13) {
              if (clientUsername) {
                // sendMessage();
                // socket.emit('stop typing');
                // typing = false;
              } else {
                setUsername();
                console.log("Username submitted");
              }
            }
          });
        // ^ Attempting to recieve initial username value ^

        // Default User Name
        socket.username = "Anonymous";

        // Emit message
        send_message.click(function(){
            socket.emit('new_message', {message : message.val()})
        });

        // Listen on new_message
        socket.on("new_message", (data) => {
            console.log(data)
            chatroom.append("<p class='message'>" + data.username + ": " + data.message + "<p>")
        });

        // Emit a username
        send_username.click(function(){
            console.log(username.val())
            socket.emit('change_username', {username : username.val()})
        });

        socket.on('change_username', (data) => {
            console.log(username.val() + "changed...");
            socket.username = data.username;
        });

        // below this point, optional code can be found 
        // Emit typing
        message.bind("keypress", () => {
            socket.emit('typing')
        });

        // Listen on typing
        socket.on('typing', (data) => {
            feedback.html("<p><i>" + data.username + " is typing a message..." + "</p></i>")
        });

        // Listen on typing
        socket.on('typing', (data) => {
            socket.broadcast.emit('typing', {username : socket.username})
        });
        // above this point, optional code can be found ^^

    // });

});
