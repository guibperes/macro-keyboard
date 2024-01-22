#ifndef input_h
#define input_h

typedef enum {
  BUTTON_PUSH = 0,
  KNOB_PREV = 0,
  KNOB_NEXT = 1,
} input_action;

struct input {
  byte pin;
  byte number;
  byte type;
  byte last_read;
  long last_millis;
};

bool check_input_last_millis(input input_device, long millis_timeout) {
  return millis() - input_device.last_millis >= millis_timeout;
}

void write_bytes_serial(input input_device, input_action action) {
  Serial.write(input_device.type);
  Serial.write(input_device.number);
  Serial.write(action);
}

#endif
