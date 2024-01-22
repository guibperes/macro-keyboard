import { exec } from "node:child_process";
import { ByteLengthParser, SerialPort } from "serialport";

const executeProcess = (command, { unref } = { unref: true }) => {
  console.log(`Executing command: ${command}`);
  const subprocess = exec(command);

  if (unref) subprocess.unref();
};

const ACTIONS = {
  0: () => executeProcess('echo "Testando" > teste.txt'),
  1: () => executeProcess("librewolf"),
  2: () => executeProcess("playerctl previous"),
  3: () => executeProcess("playerctl play-pause"),
  4: () => executeProcess("playerctl next"),
};

const port = new SerialPort({
  path: "/dev/ttyACM0",
  baudRate: 9600,
  autoOpen: false,
});

port.pipe(new ByteLengthParser({ length: 1 }));

port.on("data", (data) => {
  const actionNumber = Number.parseInt(data.toString("hex"), 16);
  ACTIONS[actionNumber]();
});

port.open(() => console.log("Connected on serial device"));
