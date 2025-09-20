#include "lafvin2wd.h"
#define DECODE_NEC
#define USE_TIMER2
#include <IRremote.hpp>

Lafvin2wd::Lafvin2wd()
{
  remote.setup(PIN_IR, false);
  irDist[0].setup(PIN_IR_DIST_LEFT, false);
  irDist[1].setup(PIN_IR_DIST_RIGHT, false);
  light[0].setup(PIN_LIGHT_LEFT, true);
  light[1].setup(PIN_LIGHT_RIGHT, true);
  lineTrack[0].setup(PIN_LINE_LEFT, false);
  lineTrack[1].setup(PIN_LINE_RIGHT, false);
  ultrasound.setup(PIN_ULTRASONIC_IN, false);

  pinMode(PIN_ULTRASONIC_PULSE, OUTPUT);

  motor[0].setup(PIN_MOTOR_LEFT_DIR, PIN_MOTOR_LEFT_SPEED, false);
  motor[1].setup(PIN_MOTOR_RIGHT_DIR, PIN_MOTOR_RIGHT_SPEED, true);
}

void Lafvin2wd::setup()
{
  IrReceiver.begin(PIN_IR);

  servo.attach(PIN_SERVO);
  moveMotor(true, 0, true);
  moveMotor(false, 0, true);
  moveServo(90);
}

void Lafvin2wd::readRemote()
{
  if (IrReceiver.decode())
  {
    remote.setValue(IrReceiver.decodedIRData.command);
    //Serial.print("Received: 0x"); Serial.println(IrReceiver.decodedIRData.command, HEX);
    IrReceiver.resume();
  }
}

void Lafvin2wd::readIRDist()
{
  irDist[0].measure();
  irDist[1].measure();
}

void Lafvin2wd::readLight()
{
  light[0].measureLowRes();
  light[1].measureLowRes();
}

void Lafvin2wd::readLine()
{
  lineTrack[0].measure();
  lineTrack[1].measure();
}

void Lafvin2wd::readUltrasonic()
{
  digitalWrite(PIN_ULTRASONIC_PULSE, LOW);
  delayMicroseconds(2);
  digitalWrite(PIN_ULTRASONIC_PULSE, HIGH);
  delayMicroseconds(10);
  digitalWrite(PIN_ULTRASONIC_PULSE, LOW);
  float distance = pulseIn(PIN_ULTRASONIC_IN, HIGH) / 58.00;
  if(distance > 250) distance = 250;
  ultrasound.setValue((uint8_t)distance);
}

void Lafvin2wd::readAllSensors()
{
  readRemote();
  readIRDist();
  readLight();
  readLine();
  readUltrasonic();
}

bool Lafvin2wd::hasRemote()
{
  return remote.isDetected();
}

uint8_t Lafvin2wd::getRemote()
{
  uint8_t ret = remote.getValue();
  remote.resetValue();
  return ret;
}

bool Lafvin2wd::hasIRDistance(bool left)
{
  return irDist[left?0:1].isDetected();
}

uint8_t Lafvin2wd::getIRDistance(bool left)
{
  return irDist[left?0:1].getValue()==LOW?1:0; // inverted 1=detected
}

bool Lafvin2wd::hasLight(bool left)
{
  return light[left?0:1].isDetected();
}

uint8_t Lafvin2wd::getLightIntensity(bool left)
{
  uint16_t val = light[left?0:1].getValue();
  uint16_t maxv = light[left?0:1].getmaxAnalogValue();
  if(val > maxv) val = maxv;
  return (maxv - val) * 100 / maxv;
}

bool Lafvin2wd::hasLine(bool left)
{
  return lineTrack[left?0:1].isDetected();
}

uint8_t Lafvin2wd::getLine(bool left)
{
  return lineTrack[left?0:1].getValue()==LOW?0:1; // inverted 1=detected
}

bool Lafvin2wd::hasUltrasonic()
{
  return ultrasound.isDetected();
}

uint8_t Lafvin2wd::getUltrasonic()
{
  return ultrasound.getValue();
}

void Lafvin2wd::moveMotor(bool leftMotor, uint8_t speed, bool forward)
{
  if(leftMotor)
  {
    motor[0].move(speed, forward);
  }
  else
  {
    motor[1].move(speed, forward);
  }
}

void Lafvin2wd::move(uint8_t speed, bool forward)
{
  motor[0].move(speed, forward);
  motor[1].move(speed, forward);
}

void Lafvin2wd::stop()
{
  motor[0].move(0, true);
  motor[1].move(0, true);
}

void Lafvin2wd::rotate(uint8_t speed, bool left)
{
  motor[0].move(speed, !left);
  motor[1].move(speed, left);
}

void Lafvin2wd::moveServo(int16_t angle)
{
  servo.write(angle);
}


