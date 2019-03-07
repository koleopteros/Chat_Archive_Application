const app = require("./backend/app");
const http = require('http');
const io = require('socket.io');
// const sapp = require("./socketFiles/sapp");

const user = io.listen(3000).sockets;
const hostname = '127.0.0.1';
const port = process.env.PORT || "3000";

app.set("port", port);

const server = http.createServer(app);
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);

  user.on('connction', function(socket) {

    // let chat = db.collection('chats'); This line was from the video

    // Sending status to client
    status = (param) => {
      socket.emit('status', param);
    }

    /*
    // Get chats from mongo collection
    chat.find().limit(100).sort({_id:1}).toArray(function(err, res){
      if(err){
        throw err;
      }

      // Emit the messages
      socket.emit('output', res);
    });
    */

    // Handle input events
    socket.on('input', function(data){
      let name = data.name;
      let message = data.messge;

      // Check for name and message
      if (name == "" || message == "") {

        // Send error status
        status('please enter a name/message.');
      } else {

        // Insert message
        chat.insert({name: name, message: message}, function(){
          sio.emit('output', [data]);

          // Send status object
          status({
            message: 'message sent',
            clear: true
          });

        });

      }

    });

    // Handle clear
    socket.on('clear', function(data){

      // remove all chats from the colelction
      chat.remove({}, function(){

        // Emit cleared
        socket.emit('cleared');

      });

    });

  });

});
