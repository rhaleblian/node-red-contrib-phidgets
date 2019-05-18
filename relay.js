module.exports = function(RED) {
    function RelayNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        this.status({fill:"gray",shape:"dot",text:"unknown"});

        function log(ch,message) {
            console.log('[' + ch + '] ' + message);
        }

        function go() {
            var ch = new phidget22.Relay();        

            ch.onAttach = function (ch) {
                console.log(ch + ' attached');
                log(ch,'name: ' + ch.getDeviceName());
                log(ch,'serial: ' + ch.getDeviceSerialNumber());
                node.status({fill:"green",shape:"dot",text:"attached"});
            };

            ch.onDetach = function (ch) {
                log(ch,'is detached');
                node.status({fill:"red",shape:"dot",text:"detached"});
            };
        
            ch.open().then(function (ch) {
                log(ch,'channel is open');
                ch.initialize();
            }).catch(function (err) {
                log(ch,'failed to open the channel:' + err);
            });

            node.on('input', function(msg) {
                console.log(msg.payload);
            });
        }

        var phidget22 = require('phidget22');
        var SERVER_HOSTNAME = "localhost";
        var SERVER_PORT = 5661;
        var conn = new phidget22.Connection(SERVER_PORT, SERVER_HOSTNAME , { name: 'Server Connection', passwd: '' });
        conn.connect()
		.then(go)
		.catch(function (err) {
			console.error(node + ': could not go(). ',err.message);
			process.exit(1);
		});
    }
    RED.nodes.registerType('relay', RelayNode);
}
