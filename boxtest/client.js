

cloak.configure({
  // You'll add stuff here later.

  messages: {
    differentMessage: function(arg) {
      console.log('server said: ' + arg);
    }
  },

  serverEvents: {
  	connecting: function (arg) {
  		console.log("connecting?");
  	}
  }

});

function tmp_change_room ( new_room_id ) {
	cloak.message("change_room", { room_id : new_room_id })
}

cloak.run('http://localhost:8090');