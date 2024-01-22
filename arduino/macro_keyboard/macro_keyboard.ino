#include "input.h"
#include "button.h"
#include "knob.h"

void button_input_loop() {
  for (byte i = 0; i < BUTTON_QUANTITY; i++) {
    buttons[i].last_read = digitalRead(buttons[i].pin);

    if (!check_input_last_millis(buttons[i], BUTTON_PRESS_TIME) || buttons[i].last_read == HIGH) continue;

    write_bytes_serial(buttons[i], BUTTON_PUSH);
    buttons[i].last_millis = millis();
  }
}

void knob_input_setup() {
  for (byte i = 0; i < KNOB_QUANTITY; i++) {
    analogs[i].pin = ANALOG_PINS[i];
    analogs[i].number = i;
    analogs[i].type = KNOB_TYPE;
    analogs[i].last_read = mapAnalogRead(analogs[i].pin);
    analogs[i].last_millis = KNOB_MILLIS_DELAY;
  }
}

void knob_input_loop() {
  for (byte i = 0; i < 1; i++) {
    if (!check_input_last_millis(analogs[i], KNOB_MILLIS_DELAY)) continue;

    byte analog_read = mapAnalogRead(analogs[i].pin);
    byte analog_read_diff = analogs[i].last_read >= analog_read ? analogs[i].last_read - analog_read : analog_read - analogs[i].last_read;

    if (analog_read_diff < KNOB_READ_DELAY) continue;

    switch (compare_analog_value(analogs[i].last_read, analog_read)) {
      case KNOB_LOWER:
        write_bytes_serial(analogs[i], KNOB_PREV);
        break;

      case KNOB_HIGHER:
        write_bytes_serial(analogs[i], KNOB_NEXT);
        break;
    }

    analogs[i].last_read = analog_read;
    analogs[i].last_millis = millis();
  }
}

void setup() {
  Serial.begin(9600);

  button_input_setup();
  knob_input_setup();
}

void loop() {
  button_input_loop();
  knob_input_loop();
}
