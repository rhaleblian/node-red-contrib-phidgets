module.exports = function (RED) {
  function PhidgetsRFIDNode (config) {
    RED.nodes.createNode(this, config)
    var node = this
    this.status({ fill: 'gray', shape: 'dot', text: 'unknown' })

    function log (ch, message) {
      console.log('[' + ch + '] ' + message)
    }

    function sendMessage (message) {
      var msg = { 'payload': message }
      node.send(msg)
    }

    function getProtocolName (protocol) {
      // Convert the protocol enum to a string.
      var name
      switch (protocol) {
        case phidget22.RFIDProtocol.EM4100:
          name = 'EM4100'
          break
        case phidget22.RFIDProtocol.ISO11785_FDX_B:
          name = 'ISO11785_FDX_B'
          break
        case phidget22.RFIDProtocol.PHIDGET_TAG:
          name = 'PHIDGET_TAG'
          break
      }
      return name
    }

    function go () {
      var ch = new phidget22.RFID()

      ch.onAttach = function (ch) {
        log(ch, 'is attached')
        log(ch, 'name: ' + ch.getDeviceName())
        log(ch, 'serial: ' + ch.getDeviceSerialNumber())
        node.status({ fill: 'green', shape: 'dot', text: 'attached' })
      }

      ch.onDetach = function (ch) {
        log(ch, 'is detached')
        node.status({ fill: 'red', shape: 'dot', text: 'detached' })
      }

      ch.onTag = function (tag, protocol) {
        var protocolStr = getProtocolName(protocol)
        log(ch, 'Tag: ' + tag + '\tProtocol: ' + protocolStr)
        var payload = {
          'event': 'tag',
          'protocol': protocolStr,
          'id': tag }
        sendMessage(payload)
      }

      ch.onTagLost = function (tag, protocol) {
        var protocolStr = getProtocolName(protocol)
        log(ch, 'TagLost: ' + tag + '\tProtocol: ' + protocolStr)
        var payload = {
          'event': 'taglost',
          'protocol': protocolStr,
          'id': tag }
        sendMessage(payload)
      }

      ch.open().then(function (ch) {
        log(ch, 'channel is open')
      }).catch(function (err) {
        log(ch, 'failed to open the channel:' + err)
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
  RED.nodes.registerType('rfid', PhidgetsRFIDNode)
}
