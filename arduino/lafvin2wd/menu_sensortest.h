#pragma once
#include <Arduino.h>

bool readLeftSensor = true;

/*
 * Message sent:
 * Byte   Description
 *  1    '$' for sensor
 *  2    [R]emote, [D]istance IR, [L]ight intensity, [B]lack line, [U]ltrasound. [d],[l],[b] for left sensor
 *  3    '-' if message has only 1 byte or high byte of the value
 *  4    low byte of the value
*/

void loop_sensortest()
{
  uint8_t sensorVal = 0;
  readLeftSensor = !readLeftSensor;
  robo.readAllSensors();

  if(robo.hasRemote())
  {
    Serial.print("$R-");
    uint8_t charIndex = 0;
    uint8_t sensorVal = robo.getRemote();
    for(;charIndex<sizeof(IR_MAP);charIndex++)
    {
      if(IR_MAP[charIndex] == sensorVal)
      {
        Serial.println(IR_CHAR[charIndex]);
        break;
      }
    }
    if(charIndex >= sizeof(IR_MAP)) Serial.println("_");
  }
  if(robo.hasIRDistance(readLeftSensor))
  {
    sensorVal = robo.getIRDistance(readLeftSensor);
    Serial.print(readLeftSensor ? "$d-" : "$D-");
    Serial.print(sensorVal);
  }
  if(robo.hasLight(readLeftSensor))
  {
    sensorVal = robo.getLightIntensity(readLeftSensor);
    Serial.print(readLeftSensor ? "$l" : "$L");
    if(sensorVal < 0x10) Serial.print("0");
    Serial.print(sensorVal, HEX);
  }
  if(robo.hasLine(readLeftSensor))
  {
    sensorVal = robo.getLine(readLeftSensor);
    Serial.print(readLeftSensor ? "$b-" : "$B-");
    Serial.print(sensorVal);
  }
  if(robo.hasUltrasonic())
  {
    sensorVal = robo.getUltrasonic();
    Serial.print("$U");
    if(sensorVal < 0x10) Serial.print("0");
    Serial.print(sensorVal, HEX);
  }

  Serial.println();
  delay(200);
}