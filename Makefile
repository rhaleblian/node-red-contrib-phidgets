
install:
	cd ~/.node-red/node_modules/ && npm install $(PWD)

test: install
	node-red