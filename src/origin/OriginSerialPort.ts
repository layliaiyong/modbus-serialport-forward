"use strict"

import EventEmitter = require("events");
import { ModbusRTUServer } from "jsmodbus";
import { ReadCoilsRequestBody, ReadDiscreteInputsRequestBody, ReadHoldingRegistersRequestBody, ReadInputRegistersRequestBody, WriteMultipleCoilsRequestBody, WriteMultipleRegistersRequestBody, WriteSingleCoilRequestBody, WriteSingleRegisterRequestBody } from "jsmodbus/dist/request";
import ModbusRTURequest from "jsmodbus/dist/rtu-request";
import SerialPort = require("serialport");
import App from "../App";
import Base from "../Base";
import DefaultOptions, { default_options } from "../serial/DefaultOptions";


export default class OriginSerialPort extends Base {
    app: App;
    options: DefaultOptions;
    event: EventEmitter;
    socket: SerialPort;
    slaver: ModbusRTUServer;

    get autoopen(): boolean {
        return false;
    }

    get port(): string {
        return this.options.port;
    }

    get baudrate(): number {
        return this.options.baudrate;
    }

    get databits(): 8 | 7 | 6 | 5 {
        return this.options.databits;
    }

    get parity(): "none" | "even" | "mark" | "odd" | "space" {
        return this.options.parity;
    }

    get stopbits(): 1 | 2 {
        return this.options.stopbits;
    }

    constructor(app: App, options: DefaultOptions) {
        super();
        this.app = app;
        this.event = new EventEmitter;
        this.options = <DefaultOptions> Object.assign(default_options, options);
        this.socket = new SerialPort(this.port, { autoOpen: this.autoopen, baudRate: this.baudrate, dataBits: this.databits, parity: this.parity, stopBits: this.stopbits });
        // 注册丛站，自定义数据
        this.slaver = new ModbusRTUServer(this.socket, {coils: undefined, discrete: undefined, holding: undefined, input: undefined});
        // 监听事件
        this.slaver.addListener('readCoils', (request: ModbusRTURequest<ReadCoilsRequestBody>, cb: Function) => this.event.emit('data', request, cb));
        this.slaver.addListener('readDiscreteInputs', (request: ModbusRTURequest<ReadDiscreteInputsRequestBody>, cb: Function) => this.event.emit('data', request, cb));
        this.slaver.addListener('readHoldingRegisters', (request: ModbusRTURequest<ReadHoldingRegistersRequestBody>, cb: Function) => this.event.emit('data', request, cb));
        this.slaver.addListener('readInputRegisters', (request: ModbusRTURequest<ReadInputRegistersRequestBody>, cb: Function) => this.event.emit('data', request, cb));
        this.slaver.addListener('writeSingleCoil', (request: ModbusRTURequest<WriteSingleCoilRequestBody>, cb: Function) => this.event.emit('data', request, cb));
        this.slaver.addListener('writeMultipleCoils', (request: ModbusRTURequest<WriteMultipleCoilsRequestBody>, cb: Function) => this.event.emit('data', request, cb));
        this.slaver.addListener('writeSingleRegister', (request: ModbusRTURequest<WriteSingleRegisterRequestBody>, cb: Function) => this.event.emit('data', request, cb));
        this.slaver.addListener('writeMultipleRegisters', (request: ModbusRTURequest<WriteMultipleRegistersRequestBody>, cb: Function) => this.event.emit('data', request, cb));
    }

    start(callback ?: SerialPort.ErrorCallback) {
        this.socket.open(callback);
    }

    on(event: string, callback: (request: ModbusRTURequest, cb: Function) => any) {
        this.event.on(event, callback);
    }
}

