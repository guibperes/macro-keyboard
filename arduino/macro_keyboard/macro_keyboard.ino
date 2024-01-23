#include "input.h"
#include "button.h"
#include "knob.h"

void setup() {
  Serial.begin(9600);

  button_input_setup();
  knob_input_setup();
}

void loop() {
  button_input_loop();
  knob_input_loop();
}
