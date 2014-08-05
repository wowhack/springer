var cloak = require('cloak');

cloak.configure({
  port: 8090,

  messages: {
    myMessage: function(arg, user) {
      console.log('message from client received!');
    },
    change_room: function (arg, user) {
    	console.log("user", user.id, "wants to change room to:", arg)
    	var new_room = cloak.createRoom( arg.room_id );
    	user.joinRoom( new_room );
    }
  },

  lobby: {
    newMember: function (arg) {
    	console.log("new member!!");
    },
    memberLeaves: function (arg) {
    	console.log("goodboy member!");
    }
  }
});

// var allowCrossDomain = function(req, res, next) {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//     res.header('Access-Control-Allow-Headers', 'Content-Type');

//     next();
// }

// cloak.use(allowCrossDomain);

cloak.run();

