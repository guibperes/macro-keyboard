import { exec } from "node:child_process";
import { ByteLengthParser, SerialPort } from "serialport";
import config from "./config.json" assert { type: "json" };

const executeProcess = (command, buttonByte) => {
  console.log(`Executing command in button ${buttonByte}: ${command}`);
  exec(command).unref();
};

const runByteCommand = (data) => {
  const actionNumber = Number.parseInt(data.toString("hex"), 16);
  const commandFunction = ACTIONS[actionNumber];

  if (commandFunction) commandFunction();
};

const ACTIONS = config.commands.map((command, buttonByte) =>
  command === config.disabledString
    ? () => console.log(`Disabled command in button ${buttonByte}`)
    : () => executeProcess(command, buttonByte)
);

const port = new SerialPort({
  autoOpen: false,
  path: config.serialPort,
  baudRate: config.baudRate,
});

port.pipe(new ByteLengthParser({ length: 1 }));
port.on("data", runByteCommand);
port.open(() => console.log("Connected on serial device"));
