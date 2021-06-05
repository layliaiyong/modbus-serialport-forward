import EventEmitter = require("events");
import { ModbusRTUClient } from "jsmodbus";
import { ReadCoilsRequestBody, ReadDiscreteInputsRequestBody, ReadHoldingRegistersRequestBody, ReadInputRegistersRequestBody, WriteMultipleCoilsRequestBody, WriteMultipleRegistersRequestBody, WriteSingleCoilRequestBody, WriteSingleRegisterRequestBody } from "jsmodbus/dist/request";
import ModbusRTURequest from "jsmodbus/dist/rtu-request";
import { IUserRequestResolve } from "jsmodbus/dist/user-request";
import SerialPort = require("serialport");
import { msleep } from "sleep";
import App from "../App";
import Base from "../Base";
import { config } from "../config";
import Helper from "../Helper";
import DefaultOptions, { default_options } from "../serial/DefaultOptions";

export default class TargetSerialPort extends Base {
    app: App;
    options: DefaultOptions;
    event: EventEmitter;
    socket: SerialPort;
    pollers: Map<number, ModbusRTUClient>;

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

    get callback() {
        return () => {};
    }

    get timeout(): number {
        return 1000;
    }

    constructor(app: App, options: DefaultOptions) {
        super();
        this.app = app;
        this.event = new EventEmitter;
        this.options = <DefaultOptions> Object.assign(default_options, options);
        this.socket = new SerialPort(this.port, { autoOpen: this.autoopen, baudRate: this.baudrate, dataBits: this.databits, parity: this.parity, stopBits: this.stopbits }, this.callback);
        this.pollers = new Map;
    }

    start(callback ?: SerialPort.ErrorCallback) {
        this.socket.open(callback);
    }

    async send(request: ModbusRTURequest, cb: Function) {
        try {
            Helper.debug(this.classname, 'send to target', request.createPayload());
            await this._send(request, (...args: any[]) => {
                // msleep(100);
                cb(...args);
            });
        } catch(err) {
            Helper.debug(this.classname, 'send to target error:', (err as Error).message);
        }
    }

    async _send(request: ModbusRTURequest, cb: Function) {
        // if(request.slaveId != 2) {
        //     return;
        // }
        let poller;
        if(!(poller = this.pollers.get(request.slaveId))) {
            poller = new ModbusRTUClient(this.socket, request.slaveId, this.timeout);
            this.pollers.set(request.slaveId, poller);
        }
        if(request.body instanceof ReadCoilsRequestBody) {
            // 标准
            const resolve = await poller.readCoils(request.body.start, request.body.count);
            // 深圳市艾尔赛科技有限公司，不支持读单个，使用读取8个
            // const resolve = await poller.readCoils(request.body.start, 8);
            const buffer = resolve.response.createPayload();
            Helper.debug(this.classname, 'ReadCoilsRequestBody cb buffer:', buffer);
            cb(buffer);
        }
        if(request.body instanceof ReadDiscreteInputsRequestBody) {
            const resolve = await poller.readDiscreteInputs(request.body.start, request.body.count);
            const buffer = resolve.response.createPayload();
            Helper.debug(this.classname, 'ReadDiscreteInputsRequestBody cb buffer:', buffer);
            cb(buffer);
        } else if(request.body instanceof ReadHoldingRegistersRequestBody) {
            const resolve = await poller.readHoldingRegisters(request.body.start, request.body.count);
            const buffer = resolve.response.createPayload();
            Helper.debug(this.classname, 'ReadHoldingRegistersRequestBody cb buffer:', buffer);
            cb(buffer);
        } else if(request.body instanceof ReadInputRegistersRequestBody) {
            const resolve = await poller.readInputRegisters(request.body.start, request.body.count);
            const buffer = resolve.response.createPayload();
            Helper.debug(this.classname, 'ReadInputRegistersRequestBody cb buffer:', buffer);
            cb(buffer);
        } else if(request.body instanceof WriteSingleCoilRequestBody) {
            const resolve = await poller.writeSingleCoil(request.body.address, request.body.value ? 1 : 0);
            // const buffer = resolve.response.createPayload();
            const buffer = request.createPayload();
            Helper.debug(this.classname, 'WriteSingleCoilRequestBody cb buffer:', buffer);
            cb(buffer);
        } else if(request.body instanceof WriteMultipleCoilsRequestBody) {
            const resolve = await poller.writeMultipleCoils(request.body.address, request.body.valuesAsArray);
            const buffer = resolve.response.createPayload();
            Helper.debug(this.classname, 'WriteMultipleCoilsRequestBody cb buffer:', buffer);
            cb(buffer);
        } else if(request.body instanceof WriteSingleRegisterRequestBody) {
            const resolve = await poller.writeSingleRegister(request.body.address, request.body.value);
            const buffer = resolve.response.createPayload();
            Helper.debug(this.classname, 'WriteSingleRegisterRequestBody cb buffer:', buffer);
            cb(buffer);
        } else if(request.body instanceof WriteMultipleRegistersRequestBody) {
            const resolve = await poller.writeMultipleRegisters(request.body.address, request.body.valuesAsArray);
            const buffer = resolve.response.createPayload();
            Helper.debug(this.classname, 'WriteMultipleRegistersRequestBody cb buffer:', buffer);
            cb(buffer);
        }
    }

    // on(event: string, callback: (request: ModbusRTURequest, cb: Function) => any) {
    //     this.event.on(event, callback);
    // }
}
