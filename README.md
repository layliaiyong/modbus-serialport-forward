# Modbus串口转发

1. 当前版本只支持 Modbus RTU
2. 电脑通过虚拟串口工具连接至各大云平台
3. 虚拟本地串口的指令转发至真实串口

# 使用
```
# 安装
npm install 
# 运行
npm run app
# 或
npm run dev
```

# 注意
1. 使用到的第三方库jsmodbus存在一个BUG
2. 找到文件：./node_modules/jsmodbus/dist/response/write-single-coil.js
3. 第35行
```
this._value = value === 0xFF00 ? 0xFF00 : 0x0000;
# 修改为
this._value = value === 0xFF00 || value === true ? 0xFF00 : 0x0000;
```
