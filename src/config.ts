
export const config = {
    socket_type_serialport: 0,
    socket_type_socket: 1,

    origins: [{
        socket_type: 0,
        port: 'com14',
        baudrate: 9600,
        databits: 8,
        parity: 'none',
        stopbits: 1,
    }],

    targets: [{
        socket_type: 0,
        port: 'com4',
        baudrate: 9600,
        databits: 8,
        parity: 'none',
        stopbits: 1,
    }],
}
