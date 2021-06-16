import ModbusRTURequest from "jsmodbus/dist/rtu-request";
import Base from "./Base";
import { config } from "./config";
import Helper from "./Helper";
import OriginSerialPort from "./origin/OriginSerialPort";
import DefaultOptions from "./serial/DefaultOptions";
import TargetSerialPort from "./target/TargetSerialPort";

export default class App extends Base {
    origins: OriginSerialPort[] = [];
    targets: TargetSerialPort[] = [];

    constructor() {
        super()

        // 初始化
        for (const origin_options of config.origins) {
            this.origins.push(new OriginSerialPort(this, <DefaultOptions> origin_options));
        }
        for (const target_options of config.targets) {
            this.targets.push(new TargetSerialPort(this, <DefaultOptions> target_options));
        }
    }

    start() {
        const target_open_callback = (error?: Error | null) => {
            error && Helper.debug(this.classname, 'ERROR', 'target_open_callback', error);
        };
        const origin_open_callback = (error?: Error | null) => {
            error && Helper.debug(this.classname, 'ERROR', 'origin_open_callback', error);
        };
        const origin_listener = async (request: ModbusRTURequest, cb: Function) => {
            // Helper.debug(this.classname, 'origin_listener', request.createPayload());

            for (const target of this.targets) {
                await target.send(request, cb);
            }
        };
        // listener
        for (const origin of this.origins) {
            origin.on('data', origin_listener);
        }
        // start
        for (const target of this.targets) {
            target.start(origin_open_callback);
        }
        for (const origin of this.origins) {
            origin.start(target_open_callback);
        }
    }
}
