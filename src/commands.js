import { exec } from "node:child_process";
import { homedir } from "node:os";
import { getConfigs } from "./config.js";

const config = getConfigs();

const executeProcess = ({ command, type, indexByte }) => {
  console.log(`Executing command in ${type} ${indexByte}: ${command}`);
  exec(command, { cwd: homedir() }).unref();
};

export const getMappedButtonCommands = () =>
  config.buttonCommands.map((command, indexByte) =>
    command === config.disabledString
      ? () => console.log(`Disabled command in BUTTON ${indexByte}`)
      : () => executeProcess({ command, indexByte, type: "BUTTON" })
  );

export const runByteCommand = (commands) => (data) => {
  const actionIndex = data.readInt8();
  const inputType = data.readInt8(1);
  const commandFunction = commands[inputType][actionIndex];

  if (commandFunction) commandFunction();
};
