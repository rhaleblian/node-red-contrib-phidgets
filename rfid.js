module.exports = function(RED) {
    function PhidgetsRFIDNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        this.status({fill:"gray",shape:"dot",text:"unknown"});

        function sendMessage(message) {
            var msg = {'payload': message };
            node.send(msg);
        }

        function getProtocolName(protocol) {
            var protocolStr;
            switch (protocol) {
                case phidget22.RFIDProtocol.EM4100:
                    protocolStr = 'EM4100';
                    break;
                case phidget22.RFIDProtocol.ISO11785_FDX_B:
                    protocolStr = 'ISO11785_FDX_B';
                    break;
                case phidget22.RFIDProtocol.PHIDGET_TAG:
                    protocolStr = 'PHIDGET_TAG';
                    break;
            }
            return protocolStr;
        }

        function go() {
            console.log('connected to server');
            var ch = new phidget22.RFID();
        
            ch.onAttach = function (ch) {
                console.log(ch + ' attached');
                node.status({fill:"green",shape:"dot",text:"attached"});
            };
        
            ch.onDetach = function (ch) {
                console.log(ch + ' detached');
                node.status({fill:"red",shape:"dot",text:"detached"});
            };
        
            ch.onTag = function (tag, protocol) {
                var protocolStr = getProtocolName(protocol);
                console.log('Tag: ' + tag + "\tProtocol: " + protocolStr)
                var payload = {
                    'event': 'tag',
                    'protocol': protocolStr,
                    'id': tag };
                sendMessage(payload);
            }
        
            ch.onTagLost = function (tag, protocol) {
                var protocolStr = getProtocolName(protocol);        
                console.log('TagLost: ' + tag + "\tProtocol: " + protocolStr)
                var payload = {
                    'event': 'taglost',
                    'protocol': protocolStr,
                    'id': tag };
                sendMessage(payload);
            }
        
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
			console.error('Error running example:', err.message);
			process.exit(1);
		});
    }
    RED.nodes.registerType("rfid",PhidgetsRFIDNode);
}
