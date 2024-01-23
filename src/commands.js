import { exec } from "node:child_process";
import { homedir } from "node:os";
import { getConfigs } from "./config.js";
import { keyCommand } from "./keyboard.js";

const config = getConfigs();

const actionTypes = ["BUTTON", "KNOB"];
const knobActions = ["PREV", "NEXT"];

const resolveCommandType = (command = "") => {
  return command === "DISABLED"
    ? "DISABLED"
    : command.startsWith("KEYBOARD")
    ? "KEYBOARD"
    : "COMMAND";
};

const executeProcess = ({ command, type, indexByte, action }) => {
  const logMessage = action
    ? `Executing command in ${type} ${indexByte} with action ${action}: ${command}`
    : `Executing command in ${type} ${indexByte}: ${command}`;

  console.log(logMessage);
  exec(command, { cwd: homedir() }).unref();
};

export const getMappedButtonCommands = () =>
  config.buttonCommands.map((command, indexByte) => {
    const type = "BUTTON";

    switch (resolveCommandType(command)) {
      case "DISABLED":
        return () => console.log(`Disabled command in BUTTON ${indexByte}`);

      case "KEYBOARD":
        return () =>
          keyCommand({ type, indexByte, keys: command.split(" ")[1] });

      case "COMMAND":
        return () => executeProcess({ command, indexByte, type });
    }
  });

export const getMappedKnobCommands = () =>
  config.knobCommands.map((knob, indexByte) =>
    knob.map((command, actionIndex) => {
      const type = "KNOB";
      const action = knobActions[actionIndex];

      switch (resolveCommandType(command)) {
        case "DISABLED":
          return () =>
            console.log(
              `Disabled command in KNOB ${indexByte} with action ${action}`
            );

        case "KEYBOARD":
          return () =>
            keyCommand({
              type,
              indexByte,
              action,
              keys: command.split(" ")[1],
            });

        case "COMMAND":
          return () => executeProcess({ command, indexByte, type, action });
      }
    })
  );

export const runByteCommand = (commands) => (data) => {
  const inputType = data.readInt8();
  const inputIndex = data.readInt8(1);
  const inputAction = data.readInt8(2);

  const commandFunction =
    actionTypes[inputType] === "BUTTON"
      ? commands[inputType][inputIndex]
      : commands[inputType][inputIndex][inputAction];

  if (commandFunction) commandFunction();
};
