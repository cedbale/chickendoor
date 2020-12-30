const fs = require('fs').promises;
const gpio = require('rpi-gpio');

const OPEN_DELAY = 10; //in seconds
const CLOSE_DELAY = 36; //in seconds

const GPIO_CODES = [16,20];
gpio.setMode(gpio.MODE_BCM);
console.log(`mode set to ${gpio.MODE_BCM}`);
const gpiop = gpio.promise;


(async function() {
        console.log('prepare to turn RIGHT');
        await gpiop.setup(GPIO_CODES[0], gpiop.DIR_OUT).catch(console.error);
        console.log(`setup output to GPIO ${GPIO_CODES[0]}`);
        await gpiop.write(GPIO_CODES[0], 0).catch(console.error);
        console.log(`command sent ${GPIO_CODES[0]}`);

        await gpiop.setup(GPIO_CODES[1], gpiop.DIR_OUT).catch(console.error);
        console.log(`setup output to GPIO ${GPIO_CODES[1]}`);
        await gpiop.write(GPIO_CODES[1], 1).catch(console.error);
        console.log(`command sent ${GPIO_CODES[1]}`);

        await new Promise(resolve => setTimeout(resolve, OPEN_DELAY * 1000));

        console.log('prepare to turn LEFT');
        await gpiop.setup(GPIO_CODES[0], gpiop.DIR_OUT).catch(console.error);
        console.log(`setup output to GPIO ${GPIO_CODES[0]}`);
        await gpiop.write(GPIO_CODES[0], 1).catch(console.error);
        console.log(`command sent ${GPIO_CODES[0]}`);

        await gpiop.setup(GPIO_CODES[1], gpiop.DIR_OUT).catch(console.error);
        console.log(`setup output to GPIO ${GPIO_CODES[1]}`);
        await gpiop.write(GPIO_CODES[1], 0).catch(console.error);
        console.log(`command sent ${GPIO_CODES[1]}`);

        await new Promise(resolve => setTimeout(resolve, OPEN_DELAY * 1000));

        await gpiop.write(GPIO_CODES[0], 0).catch(console.error);
        await gpiop.write(GPIO_CODES[1], 0).catch(console.error);
        console.log('stop all');

        process.exit(0);
})()
