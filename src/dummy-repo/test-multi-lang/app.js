const utils = require('./utils');

class DataHandler {
    constructor() {
        this.items = [];
    }
    
    addItem(item) {
        this.items.push(item);
    }
    
    processItems() {
        return this.items.map(item => utils.transform(item));
    }
}

function main() {
    const handler = new DataHandler();
    handler.addItem("test");
    const result = handler.processItems();
    console.log(result);
}

module.exports = { DataHandler, main };

// Made with Bob
