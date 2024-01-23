#ifndef button_h
#define button_h

static const byte BUTTON_TYPE = 0;
static const byte BUTTON_FIRST_PIN = 7;
static const byte BUTTON_QUANTITY = 5;
static const byte BUTTON_PRESS_TIME = 200;

input buttons[BUTTON_QUANTITY];

void button_input_setup() {
  for (byte i = 0; i < BUTTON_QUANTITY; i++) {
    byte pin = BUTTON_FIRST_PIN + i;

    buttons[i].pin = pin;
    buttons[i].number = i;
    buttons[i].type = BUTTON_TYPE;
    buttons[i].last_read = 0;
    buttons[i].last_millis = BUTTON_PRESS_TIME;

    pinMode(pin, INPUT_PULLUP);
  }
}

void button_input_loop() {
  for (byte i = 0; i < BUTTON_QUANTITY; i++) {
    buttons[i].last_read = digitalRead(buttons[i].pin);

    if (!check_input_last_millis(buttons[i], BUTTON_PRESS_TIME) || buttons[i].last_read == HIGH) continue;

    write_bytes_serial(buttons[i], BUTTON_PUSH);
    buttons[i].last_millis = millis();
  }
}

#endif
