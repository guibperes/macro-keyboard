import { getByteParser, getSerialPort } from "./serial.js";
import { getMappedCommands, runByteCommand } from "./commands.js";

const actions = getMappedCommands();
const port = getSerialPort();

port.pipe(getByteParser());
port.on("data", runByteCommand(actions));
port.open(() => console.log("Connected on serial device"));
