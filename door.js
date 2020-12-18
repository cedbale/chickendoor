import fs from 'fs/promises';
import gpio from 'rpi-gpio';

const TIME_UP = 45;
const TIME_DOWN = 36;
const FILENAME = '/opt/chickendoor/status.txt';
const LOGFILE = '/opt/chickendoor/chicken.log';
const PINS_CODES = [7];
const OPEN = 'open';
const CLOSED = 'closed';
const statusFilepath = './door_status';

gpio.setMode(gpio.MODE_BCM);
const gpiop = gpio.promise;
const isInitialised = false;
let fd = null;

try {
    fd = await fs.open(statusFilepath, 'wx');
    await fs.writeFile(fd, 'CLOSED');
    console.log(`first initialisation, door should be in "${CLOSED}" status`);
} catch(err) {}

const status = await fs.readFile(statusFilepath);
console.log(`door status is "${status}"`);

export const init = async () => {
    return Promise.all(
        PINS_CODES.map(channel => gpiop.setup(channel, gpiop.DIR_OUT)
    ).then(() => {
        isInitialised = true;
    })
}

export const open = async () => {
    if(!isInitialised) {
        throw new Error('door need to be initialised');
    } else if(status === OPEN) {
        throw new Error('door is already opened');
    }
    await gpiop.setup(PIN_CODE, gpiop.DIR_OUT).then(() => gpiop.write(PIN_CODE, true));
    console.log(`door is "${OPEN}"`);
    return fs.write(fd, OPEN);
}

export const close = async () => {
    if(!isInitialised) {
        throw new Error('door need to be initialised');
    } else if(status === CLOSED) {
        throw new Error('door is already closed');
    }
    await gpiop.setup(PIN_CODE, gpiop.DIR_OUT).then(() => gpiop.write(PIN_CODE, false));
    console.log(`door is "${CLOSED}"`);
    return fs.write(fd, CLOSED);
}

export const isClosed = () => CLOSED === status;

export default { open, close, init };
