import { exec } from "node:child_process";
import { ByteLengthParser, SerialPort } from "serialport";

const executeProcess = (command, { unref } = { unref: true }) => {
  console.log(`Executing command: ${command}`);
  const subprocess = exec(command);

  if (unref) subprocess.unref();
};

const ACTIONS = [
  () => executeProcess('echo "Testando" > teste.txt'),
  () => executeProcess("librewolf"),
  () => executeProcess("playerctl previous"),
  () => executeProcess("playerctl play-pause"),
  () => executeProcess("playerctl next"),
];

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
