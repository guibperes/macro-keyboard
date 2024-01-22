import { exec } from "node:child_process";
import { getConfigs } from "./config.js";

const config = getConfigs();

const executeProcess = (command, buttonByte) => {
  console.log(`Executing command in button ${buttonByte}: ${command}`);
  exec(command).unref();
};

export const getMappedCommands = () =>
  config.commands.map((command, buttonByte) =>
    command === config.disabledString
      ? () => console.log(`Disabled command in button ${buttonByte}`)
      : () => executeProcess(command, buttonByte)
  );

export const runByteCommand = (actions) => (data) => {
  const actionIndex = Number.parseInt(data.toString("hex"), 16);
  const commandFunction = actions[actionIndex];

  if (commandFunction) commandFunction();
};
