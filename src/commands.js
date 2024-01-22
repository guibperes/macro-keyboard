import { exec } from "node:child_process";
import { homedir } from "node:os";
import { getConfigs } from "./config.js";

const config = getConfigs();

const actionTypes = ["BUTTON", "KNOB"];
const knobActions = ["PREV", "NEXT"];

const executeProcess = ({ command, type, indexByte, action }) => {
  const logMessage = action
    ? `Executing command in ${type} ${indexByte} with action ${action}: ${command}`
    : `Executing command in ${type} ${indexByte}: ${command}`;

  console.log(logMessage);
  exec(command, { cwd: homedir() }).unref();
};

export const getMappedButtonCommands = () =>
  config.buttonCommands.map((command, indexByte) =>
    command === config.disabledString
      ? () => console.log(`Disabled command in BUTTON ${indexByte}`)
      : () => executeProcess({ command, indexByte, type: "BUTTON" })
  );

export const getMappedKnobCommands = () =>
  config.knobCommands.map((knob, indexByte) =>
    knob.map((command, actionIndex) =>
      command === config.disabledString
        ? () =>
            console.log(
              `Disabled command in KNOB ${indexByte} with action ${knobActions[actionIndex]}`
            )
        : () =>
            executeProcess({
              command,
              indexByte,
              type: "KNOB",
              action: knobActions[actionIndex],
            })
    )
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
