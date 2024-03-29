import { ByteLengthParser, SerialPort } from "serialport";
import { getConfigs } from "./config.js";

const config = getConfigs();

export const getSerialPort = () =>
  new SerialPort({
    autoOpen: false,
    path: config.serialPort,
    baudRate: config.baudRate,
  });

export const getByteParser = () => new ByteLengthParser({ length: 3 });

export const onOpen = () =>
  console.log(`Connected on serial device ${config.serialPort}`);
