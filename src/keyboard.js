import robot from "robotjs";

export const keyCommand = ({ keys, indexByte, type, action }) => {
  const logMessage = action
    ? `Executing key command in ${type} ${indexByte} with action ${action}: ${keys}`
    : `Executing key command in ${type} ${indexByte}: ${keys}`;

  const [modifier, key] = keys.includes("+") ? keys.split("+") : [[], keys];

  console.log(logMessage);
  robot.keyTap(key, modifier);
};
