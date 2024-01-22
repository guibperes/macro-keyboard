import { exec } from "node:child_process";
import { SerialPort } from "serialport";

const executeProcess = (command, { unref } = { unref: true }) => {
  console.log(`Executing command: ${command}`);
  const subprocess = exec(command);

  if (unref) subprocess.unref();
};

const ACTIONS = {
  7: () => executeProcess('echo "Testando" > teste.txt'),
  8: () => executeProcess("librewolf"),
  9: () => executeProcess("playerctl previous"),
  10: () => executeProcess("playerctl play-pause"),
  11: () => executeProcess("playerctl next"),
};

const port = new SerialPort({
  path: "/dev/ttyACM0",
  baudRate: 9600,
  autoOpen: false,
});

port.on("data", (data) => {
  const actionNumber = Number.parseInt(Buffer.from(data).toString("hex"), 16);
  ACTIONS[actionNumber]();
});

port.open(() => console.log("Connected on serial device"));
