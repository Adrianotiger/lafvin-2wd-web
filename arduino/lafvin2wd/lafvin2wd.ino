
#include "lafvin2wd.h"
#include "serial.h"

extern Lafvin2wd robo = Lafvin2wd();
extern SerialMsg ser = SerialMsg();
int8_t menu = MENU_MAIN;

#include "menu_sensortest.h"
#include "menu_motortest.h"
#include "menu_beebot.h"

void setup() 
{
  Serial.begin(9600);
  
  robo.setup();
}

void loop_main();

void loop() 
{
  ser.parseSerial();

  if(ser.hasMenuPacket()) loop_main();

  switch(menu)
  {
    case MENU_MAIN:
          break;
    case MENU_SENSORTEST: 
          loop_sensortest(); 
          break;
    case MENU_MOTORTEST:
          loop_motortest();
          break;
    case MENU_BEEBOT:
          loop_beebot();
          break;
  }
}

void loop_main()
{
  struct TMsg* pmsg = ser.getNextPacket(true);
  switch(pmsg->id) 
  {
    case 'S': menu = MENU_SENSORTEST; Serial.println("ENTER SENSOR TEST"); break;
    case 'M': menu = MENU_MOTORTEST; Serial.println("ENTER MOTOR TEST"); break;
    case 'B': menu = MENU_BEEBOT; Serial.println("ENTER BEE BOT PROGRAMMING"); break;
    default: break;
  }
}
