import gpio from 'rpi-gpio';
import { open, close, init } from '../door.js';

jest.mock('rpi-gpio');

test('door should failed if not initialised', async () => {
    expect(async () => open().rejects.toThrow());
    expect(async () => close().rejects.toThrow());
});

test('door should pass if initialised', async () => {
    expect(async () => init().then(() => open().resolves);
    expect(async () => init().then(() => close().resolves);
});
