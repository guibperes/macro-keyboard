#ifndef knob_h
#define knob_h

static const byte KNOB_TYPE = 1;
static const byte KNOB_QUANTITY = 1;
static const byte KNOB_MILLIS_DELAY = 200;
static const byte KNOB_READ_DELAY = 10;
static const byte ANALOG_PINS[] = { A0, A1, A2, A3, A4, A5 };

byte mapAnalogRead(byte pin) {
  return map(analogRead(pin), 0, 1023, 0, 100);
}

byte compare_analog_value(byte first, byte second) {
  if (first > second) return 0;
  else if (first < second) return 2;
  else return 1;
}

#endif
