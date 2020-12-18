import door from '../door.js';

jest.mock('../door.js');

test('door should failed if not initialised', async () => {
    expect(() => {
        door.open();
    }).toThrow();
});
