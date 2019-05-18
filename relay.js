module.exports = function(RED) {
    function RelayNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        this.status({fill:"gray",shape:"dot",text:"unknown"});

        function go() {
            console.log('connected to server');
            var ch = new phidget22.Relay();
        
            ch.onAttach = function (ch) {
                console.log(ch + ' attached');
                node.status({fill:"green",shape:"dot",text:"attached"});
            };

            ch.onDetach = function (ch) {
                console.log(ch + ' detached');
                node.status({fill:"red",shape:"dot",text:"detached"});
            };
        
            ch.open().then(function (ch) {
                console.log('Relay channel open');
                ch.initialize();

                //console.log('name: ' + ch.getDeviceName());
                //console.log('serial: ' + ch.getDeviceSerialNumber());
                //console.log(ch.getBacklight());

            }).catch(function (err) {
                console.log('Relay failed to open the channel:' + err);
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
			console.error('Error running Relay:', err.message);
			process.exit(1);
		});
    }
    RED.nodes.registerType('Relay', RelayNode);
}
