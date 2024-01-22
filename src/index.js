import { getByteParser, getSerialPort } from "./serial.js";
import { getMappedButtonCommands, runByteCommand } from "./commands.js";

const port = getSerialPort();
const parser = getByteParser();

port.pipe(parser);
port.open(() => console.log("Connected on serial device"));
parser.on("data", runByteCommand([getMappedButtonCommands(), []]));
