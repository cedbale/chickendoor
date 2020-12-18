import gpio from 'rpi-gpio';

const TIME_UP = 45;
const TIME_DOWN = 36;
const FILENAME = '/opt/chickendoor/status.txt';
const LOGFILE = '/opt/chickendoor/chicken.log';
const PIN_CODE = 7;

gpio.setMode(gpio.MODE_BCM);
const gpiop = gpio.promise;

export const open = async () => {
    console.log('door is opening');
    gpiop.setup(PIN_CODE, gpiop.DIR_OUT).then(() => write(PIN_CODE, true));
}

export const close = async () => {
    console.log('door is closing');
    gpiop.setup(PIN_CODE, gpiop.DIR_OUT).then(() => write(PIN_CODE, false));
}

export default { open, close };
