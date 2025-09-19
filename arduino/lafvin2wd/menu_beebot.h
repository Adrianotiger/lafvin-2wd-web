#pragma once
#include <Arduino.h>

/*
 * Message sent:
 * Byte   Description
 *  1    '>' for execute
 *  2    [F]orward, [B]ackwards, [L]eft, [R]ight
 *  3,4  for F and B, the quantity in cm  
 *       for L and R, the quantity of 45°
*/

void loop_beebot()
{
  struct TMsg* pmsg = ser.getNextPacket(true);
  if(pmsg->type == '>')
  {
    Serial.println("Sending program code");
    uint16_t duration = ser.parseValue(&pmsg->value[0], 4);
    uint8_t speed = ser.parseValue(&pmsg->extra[0], 2);

    switch(pmsg->id)
    {
      case 'F': robo.move(speed, true); break;
      case 'B': robo.move(speed, false); break;
      case 'L': robo.rotate(speed, true); break;
      case 'R': robo.rotate(speed, false); break;
    }
    delay(duration);
    robo.stop();
  }
}