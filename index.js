import door from './door.js';

await door.init();
if(door.isClosed()) {
    door.open();
} else {
    door.close();
}
