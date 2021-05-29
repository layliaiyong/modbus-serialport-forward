export default interface DefaultOptions {
    port: 'com4';
    baudrate: 115200|57600|38400|19200|9600|4800|2400|1800|1200|600|300|200|150|134|110|75|50|number;
    databits: 8|7|6|5;
    parity: 'none'|'even'|'mark'|'odd'|'space';
    stopbits: 1|2;
}
export const default_options = {
    port: 'com4',
    baudrate: 9600,
    databits: 8,
    parity: 'none',
    stopbits: 1,
}
