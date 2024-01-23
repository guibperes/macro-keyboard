#ifndef knob_h
#define knob_h

static const byte KNOB_TYPE = 1;
static const byte KNOB_QUANTITY = 2;
static const byte KNOB_MILLIS_DELAY = 200;
static const byte KNOB_READ_DELAY = 10;
static const byte ANALOG_PINS[] = { A0, A1, A2, A3, A4, A5 };

input analogs[KNOB_QUANTITY];

typedef enum {
  KNOB_LOWER = 0,
  KNOB_EQUAL = 1,
  KNOB_HIGHER = 2,
} knob_actions;

byte mapAnalogRead(byte pin) {
  return map(analogRead(pin), 0, 1023, 0, 100);
}

knob_actions compare_analog_value(byte first, byte second) {
  if (first > second) return KNOB_LOWER;
  else if (first < second) return KNOB_HIGHER;
  else return KNOB_EQUAL;
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
  for (byte i = 0; i < KNOB_QUANTITY; i++) {
    if (!check_input_last_millis(analogs[i], KNOB_MILLIS_DELAY)) continue;

    byte analog_read = mapAnalogRead(analogs[i].pin);

    byte analog_read_diff = analogs[i].last_read >= analog_read
                              ? analogs[i].last_read - analog_read
                              : analog_read - analogs[i].last_read;

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

#endif
