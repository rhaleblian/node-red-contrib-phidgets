# node-red-phidget

Node wrappers for Phidgets devices.

This project is just getting started; nothing is yet releaseable.
Things that have tested positive:

* very basic RFID reading
* initialization of a 40x4 LCD with text

Some nodes are still just stubs.

## Development

### Prequisites

* @rhaleblian is using macOS
* [Phidget22 JavaScript Library](https://www.phidgets.com/docs/Language_-_JavaScript#Libraries)
* [Node-RED](https://nodered.org)

    npm install phidget22
    npm install node-red
    
### Running

    make install
    make test

will install to your .node-red directory and start the server.

### Guidelines

[JavaScript Standard Style](https://github.com/standard/standard#install) for style.
