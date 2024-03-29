import { getByteParser, getSerialPort, onOpen } from "./serial.js";
import {
  getMappedButtonCommands,
  getMappedKnobCommands,
  runByteCommand,
} from "./commands.js";

const port = getSerialPort();
const parser = getByteParser();

port.pipe(parser);
port.open(onOpen);
parser.on(
  "data",
  runByteCommand([getMappedButtonCommands(), getMappedKnobCommands()])
);
