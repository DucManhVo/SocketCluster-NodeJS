const express = require('express');
const nodemon = require('nodemon');
const socketClusterClient = require('socketcluster-client');
const app = express()
const port = 4000

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
  let client2Channel = socket.subscribe('client2');

  for await (let data of client2Channel) {
    // ... Handle channel data.
    console.log('Listen clientChannel: ' + data);
  }
})();

/*------ publish data to channel 'kai' ---------*/

let interval = setInterval(function () {
  let date = new Date();
  socket.transmitPublish('client1', 'client 2 send data test' + date.toISOString());
}, 5000);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
