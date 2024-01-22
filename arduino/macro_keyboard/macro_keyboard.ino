#define BUTTON_TYPE 0
#define BUTTON_FIRST_PIN 7
#define BUTTON_QUANTITY 5
#define BUTTON_PRESS_TIME 200

#define KNOB_TYPE 1
#define KNOB_MILLIS_DELAY 200
#define KNOB_READ_DELAY 10

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

input buttons[BUTTON_QUANTITY];
input analogs[1];

bool check_input_last_millis(input button, long millis_timeout) {
  return millis() - button.last_millis >= millis_timeout;
}

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

    Serial.write(buttons[i].type);
    Serial.write(buttons[i].number);
    Serial.write(BUTTON_PUSH);

    buttons[i].last_millis = millis();
  }
}

byte mapAnalogRead(byte pin) {
  return map(analogRead(pin), 0, 1023, 0, 100);
}

byte compare_analog_value(byte first, byte second) {
  if (first > second) return 0;
  else if (first < second) return 2;
  else return 1;
}

void setup() {
  Serial.begin(9600);
  button_input_setup();

  analogs[0].pin = A0;
  analogs[0].number = 0;
  analogs[0].type = KNOB_TYPE;
  analogs[0].last_read = mapAnalogRead(analogs[0].pin);
  analogs[0].last_millis = KNOB_MILLIS_DELAY;
}

void loop() {
  button_input_loop();

  for (byte i = 0; i < 1; i++) {
    if (!check_input_last_millis(analogs[0], KNOB_MILLIS_DELAY)) continue;

    byte analog_read = mapAnalogRead(analogs[0].pin);
    byte analog_read_diff = analogs[0].last_read >= analog_read ? analogs[0].last_read - analog_read : analog_read - analogs[0].last_read;

    if (analog_read_diff < KNOB_READ_DELAY) continue;

    switch (compare_analog_value(analogs[0].last_read, analog_read)) {
      case 0:
        Serial.write(analogs[i].type);
        Serial.write(analogs[i].number);
        Serial.write(KNOB_PREV);
        break;

      case 2:
        Serial.write(analogs[i].type);
        Serial.write(analogs[i].number);
        Serial.write(KNOB_NEXT);
        break;
    }

    analogs[0].last_read = analog_read;
    analogs[0].last_millis = millis();
  }
}
