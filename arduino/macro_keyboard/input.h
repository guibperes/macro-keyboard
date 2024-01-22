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

#endif
