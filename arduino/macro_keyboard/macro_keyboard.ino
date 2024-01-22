#define BUTTON_FIRST_PIN 7
#define BUTTON_QUANTITY 5
#define BUTTON_PRESS_TIME 200

#define BUTTON_TYPE 0
#define KNOB_TYPE 1

struct button {
  byte pin;
  byte number;
  byte type;
  long last_press;
};

button buttons[BUTTON_QUANTITY];

bool check_button_last_press(button btn) {
  return millis() - btn.last_press >= BUTTON_PRESS_TIME;
}

void setup() {
  Serial.begin(9600);

  for (byte i = 0; i < BUTTON_QUANTITY; i++) {
    byte pin = BUTTON_FIRST_PIN + i;

    buttons[i].pin = pin;
    buttons[i].number = i;
    buttons[i].type = BUTTON_TYPE;
    buttons[i].last_press = BUTTON_PRESS_TIME;

    pinMode(pin, INPUT_PULLUP);
  }
}

void loop() {
  for (byte i = 0; i < BUTTON_QUANTITY; i++) {
    bool button_state = digitalRead(buttons[i].pin);

    if (check_button_last_press(buttons[i]) && button_state == LOW) {
      Serial.write(buttons[i].number);
      Serial.write(buttons[i].type);
      buttons[i].last_press = millis();
    }
  }
}
