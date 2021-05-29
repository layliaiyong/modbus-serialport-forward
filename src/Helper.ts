
import debug from "debug";
import * as DateFormat from "dateformat";

export default class Helper {
    static date_format(date?: Date, fmt: string | undefined = 'yyyy-mm-dd hh:MM:ss.l') {
        return DateFormat(date, fmt);
    }
    static random_int(max: number) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    static debug(tag: string, ...content: any) {
        debug(`App.${tag}`)(`[${Helper.date_format(new Date)}]`, ...content);
    }
}
