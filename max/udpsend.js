const Max = require('max-api');

const dgram = require('dgram');
const client = dgram.createSocket('udp4');
const ip = '192.168.4.100';

// includes "Art-Net", port, and channel count
const header = [65, 114, 116, 45, 78, 101, 116, 0, 0, 80, 0, 14, 0, 0, 0, 0, 0, 132];

Max.addHandler('send', (...message) => {
    const packet = header.concat(message);
    client.send(Buffer.from(packet), 6454, ip);
})

Max.addHandler('close', () => {
    client.close();
})