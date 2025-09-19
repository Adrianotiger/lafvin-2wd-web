#pragma once
#include <Arduino.h>

/*
 * Message sent:
 * Byte   Description
 *  1    '@' for motor
 *  2    [L]eft motor, [R]ight motor, [S]ervo
 *  3    high byte of the value
 *  4    low byte of the value
*/

void loop_motortest()
{
  struct TMsg* pmsg = ser.getNextPacket(true);
  if(pmsg->type == '@')
  {
    Serial.println("GOT A MOTOR MESSAGE!");
    uint16_t speed = ser.parseValue(&pmsg->value[0], 2);
    
    bool isMotor = false;
    bool isForward = true;
    bool isLeft = false;
    if(pmsg->id == 'L' || pmsg->id == 'R')
    {
      isForward = true;
      isMotor = true;
      isLeft = pmsg->id == 'L';
    }
    else if(pmsg->id == 'l' || pmsg->id == 'r')
    {
      isForward = false;
      isMotor = true;
      isLeft = pmsg->id == 'l';
    }
    if(isMotor)
    {
      robo.moveMotor(isLeft, speed, isForward);
      delay(2000);
      robo.moveMotor(isLeft, 0, true);
    }
    else
    {
      robo.moveServo(speed);
    }
  }
}