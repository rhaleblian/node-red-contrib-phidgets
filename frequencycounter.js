module.exports = function(RED) {
    function FrequencyCounterNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        this.status({fill:"red",shape:"dot",text:"not started"});

        function sendMessage() {

        }

        function go() {

            console.log('connected to server');
            var ch = new phidget22.FrequencyCounter();
        
            ch.onAttach = function (ch) {
                console.log(ch + ' attached');
                node.status({fill:"green",shape:"dot",text:"attached"});
            };
        
            ch.onDetach = function (ch) {
                console.log(ch + ' detached');
                node.status({fill:"red",shape:"dot",text:"detached"});
            };
        
            ch.open().then(function (ch) {
                console.log('channel open');
            }).catch(function (err) {
                console.log('failed to open the channel:' + err);
            });
        }

        var phidget22 = require('phidget22');
        var SERVER_HOSTNAME = "localhost";
        var SERVER_PORT = 5661;
        var conn = new phidget22.Connection(SERVER_PORT, SERVER_HOSTNAME , { name: 'Server Connection', passwd: '' });
        conn.connect()
		.then(go)
		.catch(function (err) {
			console.error('Error running frequency counter:', err.message);
			process.exit(1);
		});
    }
    RED.nodes.registerType("frequency", FrequencyCounterNode);
}
