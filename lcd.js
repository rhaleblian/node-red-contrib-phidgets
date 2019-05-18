module.exports = function (RED) {
  function PhidgetsLCDNode (config) {
    RED.nodes.createNode(this, config)
    var node = this
    this.status({ fill: 'gray', shape: 'dot', text: 'unknown' })

    function log (ch, message) {
      console.log('[' + ch + '] ' + message)
    }

    function go () {
      var ch = new phidget22.LCD()
      var font = phidget22.LCDFont.DIMENSIONS_5X8

      ch.onAttach = function (ch) {
        log(ch, 'is attached')
        if (ch.getDeviceID() === phidget22.DeviceID.PN_1204) {
          ch.setScreenSize(phidget22.LCDScreenSize.DIMENSIONS_2X40)
        }
        log(ch, 'name: ' + ch.getDeviceName())
        log(ch, 'serial: ' + ch.getDeviceSerialNumber())
        ch.setBacklight(1)
        node.status({ fill: 'green', shape: 'dot', text: 'attached' })
      }

      ch.onDetach = function (ch) {
        log(ch, 'is detached')
        node.status({ fill: 'red', shape: 'dot', text: 'detached' })
      }

      ch.open().then(function (ch) {
        log(ch, 'channel is open')
        ch.initialize()
        var banner = 'node-red-phidget'
        ch.writeText(font, 14, 0, banner)
        ch.flush()
      }).catch(function (err) {
        console.log('LCD failed to open the channel:' + err)
      })

      node.on('input', function (msg) {
        log(ch, 'input ' + msg.payload)
        if (msg.payload['event'] === 'tag') {
          ch.writeText(phidget22.LCDFont.DIMENSIONS_5X8, 0, 0, msg.payload['id'])
        } else if (msg.payload['event'] === 'taglost') {
          ch.writeText(phidget22.LCDFont.DIMENSIONS_5X8, 0, 0, '               ')
        }
        ch.flush()
      })
    }

    var phidget22 = require('phidget22')
    var SERVER_HOSTNAME = 'localhost'
    var SERVER_PORT = 5661
    var conn = new phidget22.Connection(SERVER_PORT, SERVER_HOSTNAME, { name: 'Server Connection', passwd: '' })
    conn.connect()
      .then(go)
      .catch(function (err) {
        console.error(node + ': could not go(). ', err.message)
        process.exit(1)
      })
  }
  RED.nodes.registerType('lcd', PhidgetsLCDNode)
}
