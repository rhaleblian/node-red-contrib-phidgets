module.exports = function(RED) {
    function PhidgetsLCDNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        this.status({fill:"gray",shape:"dot",text:"unknown"});

        function go() {
            console.log('connected to server');
            var ch = new phidget22.LCD();
        
            ch.onAttach = function (ch) {
                console.log(ch + ' attached');
                if (ch.getDeviceID() === phidget22.DeviceID.PN_1204)
                    ch.setScreenSize(phidget22.LCDScreenSize.DIMENSIONS_2X40);
                ch.setBacklight(1);
                ch.writeText(phidget22.LCDFont.DIMENSIONS_5X8, 0, 0, "Phidgets");
                ch.flush();
                node.status({fill:"green",shape:"dot",text:"attached"});
            };

            ch.onDetach = function (ch) {
                console.log(ch + ' detached');
                node.status({fill:"red",shape:"dot",text:"detached"});
            };
        
            ch.open().then(function (ch) {
                console.log('LCD channel open');
                ch.initialize();

                //console.log('name: ' + ch.getDeviceName());
                //console.log('serial: ' + ch.getDeviceSerialNumber());
                //console.log(ch.getBacklight());

            }).catch(function (err) {
                console.log('LCD failed to open the channel:' + err);
            });

            node.on('input', function(msg) {
                console.log(msg.payload);
                if (msg.payload['event'] == 'tag')
                    ch.writeText(phidget22.LCDFont.DIMENSIONS_5X8, 0, 0, msg.payload['id']);
                else if (msg.payload['event'] == 'taglost')
                    ch.writeText(phidget22.LCDFont.DIMENSIONS_5X8, 0, 0, '               ');
                ch.flush();
            });
        }

        var phidget22 = require('phidget22');
        var SERVER_HOSTNAME = "localhost";
        var SERVER_PORT = 5661;
        var conn = new phidget22.Connection(SERVER_PORT, SERVER_HOSTNAME , { name: 'Server Connection', passwd: '' });
        conn.connect()
		.then(go)
		.catch(function (err) {
			console.error('Error running LCD:', err.message);
			process.exit(1);
		});
    }
    RED.nodes.registerType('lcd', PhidgetsLCDNode);
}
