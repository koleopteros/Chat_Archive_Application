$(function(){
    // Make connection.
    // var socket = io.connect('http://localhost:3000');
    var socket = io();


    // Buttons and inputs
    //var message = $("#message");
    var messages = $(".messages");
    var username = $("#username");
    var send_message = $("#send_message");
    var send_username = $("#send_username");
    var chatroom = $("#chatroom");
    var usernameInput = $(".usernameInput");
    var inputMessage = $('.inputMessage'); // Input message input box
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
              username = clientUsername;
              loginPage.fadeOut();
              chatPage.show();
              loginPage.off('click');

              socket.emit('change_username', clientUsername);

              /*
              setTimeout(function() {
                window.location.href("public\\chatroom.ejs");
              }, 300)
              */
              
              //$currentInput = $inputMessage.focus();
        
              // Tell the server your username
              // socket.emit('add user', clientUsername);
              // socket.emit('change_username', clientUsername);
            }
          }

         clientWindow.keydown(event => {
            // Auto-focus the current input when a key is typed
            /*
            if (!(event.ctrlKey || event.metaKey || event.altKey)) {
              //$currentInput.focus();
            }
            */
            // When the client hits ENTER on their keyboard
            if (event.which === 13) {
              if (clientUsername) {
                sendMessage();
                // socket.emit('stop typing');
                // typing = false;
              } else {
                setUsername();
                console.log("Username submitted");
              }
            }
          });
        // ^ Attempting to recieve initial username value ^

        // Attempting to Send messages
        // Sends a chat message
        const sendMessage = () => {
            var providedMessage = inputMessage.val();
            // Prevent markup from being injected into the message
            // message = cleanInput(message);
            // if there is a non-empty message and a socket connection
            if (providedMessage) {
                inputMessage.val('');
                /*
                addChatMessage({
                    username: username,
                    message: message
                });
                */
               //var transmitData = {username: username, message: message}
            // tell server to execute 'new message' and send along one parameter
            // socket.emit('new message', message);
            socket.emit('new_message', {username: clientUsername, message: providedMessage});
            console.log("Emitting message clause passed.");
            }
        }

        // Adds the visual chat message to the message list
        const addChatMessage = (data) => {

            var usernameDiv = $('<span class="username"/>')
            .text(data.username)

            var messageBodyDiv = $('<span class="messageBody">')
            .text(data.message);

            var typingClass = data.typing ? 'typing' : '';
            var messageDiv = $('<li class="message"/>')
            .data('username', data.username)
            .addClass(typingClass)
            .append(usernameDiv, messageBodyDiv);

            addMessageElement(messageDiv);
        }
                
        const addMessageElement = (element) => {

            var element = $(element);
        
            //if (options.prepend) {
              messages.prepend(element);
            //} else {
              messages.append(element);
            //}
            //messages[0].scrollTop = messages[0].scrollHeight;
          }

        // ^ Attempting to Send messages ^

        // Default User Name
        socket.username = "Anonymous";

        // Emit message
        send_message.click(function(){
            socket.emit('new_message', {message : message.val()})
        });

        // Listen on new_message
        socket.on('new_message', (data) => {
            console.log(data)
            // chatroom.append("<p class='message'>" + data.username + ": " + data.message + "<p>")
            messages.append("<p class='message'>" + data.message.username + ": " + data.message.message + "<p>")

        });

        // Emit a username
        send_username.click(function(){
            console.log(username.val())
            socket.emit('change_username', {username : username.val()})
        });

        /*
        socket.on('change_username', (data) => {
            console.log(username.val() + "changed...");
            socket.username = data.username;
        });
        */

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
