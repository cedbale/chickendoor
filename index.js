const door = require('./lib/door.js');

(async () => {
    await door.init();
    if(door.isClosed()) {
        await door.open();
    } else {
        await door.close();
    }
    // process.exit(0);
})()
