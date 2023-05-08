const express = require('express')
const socketClusterClient = require('socketcluster-client');
const app = express()
const port = 3000

const socket = socketClusterClient.create({
  hostname: 'localhost',
  port: 8000
});

(async () => {
  for await (let { error } of socket.listener('error')) {
    console.error(error);
  }
})();

(async () => {
  for await (let event of socket.listener('connect')) {
    console.log('Socket is connected');
  }
})();

//Subscrise and watch mess
(async () => {

  // Subscribe to a channel.
  let client1Channel = socket.subscribe('client1');

  for await (let data of client1Channel) {
    // ... Handle channel data.
    console.log('Listen client1Channel: ' + data);
  }
})();

/*------ publish data to channel '2' ---------*/

let interval = setInterval(function () {
  let date = new Date();
  socket.transmitPublish('client2', 'client 1 send data test' + date.toISOString());
}, 5000);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
