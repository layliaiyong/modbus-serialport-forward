
export default class Base {
    classname: string;

    constructor() {
        this.classname = Object.getPrototypeOf(this).constructor.name;
    }
}