import { exec } from "node:child_process";
import { ByteLengthParser, SerialPort } from "serialport";
import config from "./config.json" assert { type: "json" };

const executeProcess = (command) => {
  console.log(`Executing command: ${command}`);
  exec(command).unref();
};

const runByteCommand = (data) => {
  const actionNumber = Number.parseInt(data.toString("hex"), 16);
  const commandFunction = ACTIONS[actionNumber];

  if (commandFunction) commandFunction();
};

const ACTIONS = config.commands.map((command) => () => executeProcess(command));

const port = new SerialPort({
  autoOpen: false,
  path: config.serialPort,
  baudRate: config.baudRate,
});

port.pipe(new ByteLengthParser({ length: 1 }));
port.on("data", runByteCommand);
port.open(() => console.log("Connected on serial device"));
