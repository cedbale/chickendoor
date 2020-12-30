const fs = require('fs').promises;
const gpio = require('rpi-gpio');

const OPEN_DELAY = 10; //in seconds
const CLOSE_DELAY = 10; //in seconds
const GPIO_CHANNELS = [{
    code: 16,
    dir: gpio.DIR_OUT,
    key: 'upper-door'
},{
    code: 20,
    dir: gpio.DIR_OUT,
    key: 'upper-door'
}];
const OPEN = 'open';
const CLOSED = 'closed';
const statusFilepath = './door_status';
const gpiop = gpio.promise;

gpio.setMode(gpio.MODE_BCM);

let gpios = null;
let fd = null;
let status = null;

const init = async () => {
    try {
        fd = await fs.open(statusFilepath, 'wx');
        const initialStatus = GPIO_CHANNELS.reduce((acc, cur) => ({ [cur.key]: CLOSED, ...acc }), {});
        await fs.writeFile(fd, JSON.stringify(initialStatus));
        console.log(`First initialisation, door(s) should be in "${CLOSED}" status`);
    } catch(err) {}

    const data = await fs.readFile(statusFilepath);
    try{
        status = JSONToMap(data);
    } catch(err) {
        console.error(`Bad data implementation from file "${statusFilepath}". Please, remove it`);
        process.exit(1);
    }

    status.forEach((value, key) => {
        console.log(`${key} status is "${value}"`);
    });

    gpios = await Promise.all(
        GPIO_CHANNELS.map(({ code, dir }) => gpiop.setup(code, dir).then(() => code))
    )
    .then(codes => codes.reduce((acc, code) => ({ [code]: code }), {}))
    .catch((err) => {
        console.error(`"${err.message}"... are you really running the script from a Linux system ?`);
        process.exit(1);
    });

    // gpios = {
    //     16: 16,
    //     20: 20
    // };

    if(status.size !== Object.keys(gpios).length / 2) {
        throw new Error(`Unsynchronised data. Please, remove file "${statusFilepath}"`);
    }
}

const open = async (key = 'upper-door') => {
    if(gpios === null) {
        throw new Error('door need to be initialised first');
    } else if(status.get(key) === OPEN) {
        throw new Error('door is already opened');
    }

    await Promise.all([
        gpiop.write(gpios[16], 1),
        gpiop.write(gpios[20], 0)
    ])
    .then(() => new Promise(resolve => setTimeout(resolve, OPEN_DELAY * 1000)))

    await Promise.all([
        gpiop.write(gpios[16], 0),
        gpiop.write(gpios[20], 0)
    ])

    console.log(`door is "${OPEN}"`);
    return fs.write(fd, OPEN);
};

const close = async (key = 'upper-door') => {
    if(gpios === null) {
        throw new Error('door need to be initialised first');
    } else if(status.get(key) === CLOSED) {
        throw new Error('door is already closed');
    }
    await Promise.all([
        gpiop.write(gpios[16], 0),
        gpiop.write(gpios[20], 1)
    ])
    .then(() => new Promise(resolve => setTimeout(resolve, CLOSE_DELAY * 1000)))

    await Promise.all([
        gpiop.write(gpios[16], 0),
        gpiop.write(gpios[20], 0)
    ])
    status.set(key, CLOSED);
    console.log(`door is "${CLOSED}"`);
    return fs.write(fd, mapToJSON(status));
};

const isClosed = (key = 'upper-door') => CLOSED === status.get(key);

module.exports = { open, close, init, isClosed };

function mapToJSON(data) {
    return JSON.stringify(Object.fromEntries(data));
}

function JSONToMap(data) {
    return new Map(Object.entries(JSON.parse(data)));
}
