#include <Arduino.h>
#include "const.h"

#include <Servo.h>

class Sensor
{
private:
  uint16_t _value;
  bool    _changed;
  bool    _analog;
  bool    _analogLow;
  uint8_t _pin;
public:
  Sensor() {}
  void setup(uint8_t pin, bool isAnalog) { pinMode(pin, INPUT); _pin=pin; _analog=isAnalog; _value=0; }
  void measure() { _analogLow = false; if(_analog) setValue(analogRead(_pin)); else setValue(digitalRead(_pin)); }
  void measureLowRes() { _analogLow = true; if(_analog) setValue(analogRead(_pin) / 16); else setValue(digitalRead(_pin)); }
  uint16_t getmaxAnalogValue() { return _analogLow ? 512/16 : 512; }
  void setValue(uint16_t val) { if(val != _value) {_value=val; _changed=true;} }
  bool isDetected() { return _changed; }
  uint16_t getValue() { _changed = false; return _value; }
  void resetValue() { _value = 0; }
};

class Motor
{
private:
  uint8_t _speed;
  int8_t _dir;
  bool _invert;
  uint8_t _pinDir;
  uint8_t _pinSpeed;
public:
  Motor() { }
  void setup(uint8_t pinDir, uint8_t pinSpeed, bool invert=false) 
  { 
    _speed=0; 
    _invert = invert;
    _pinDir = pinDir;
    _pinSpeed = pinSpeed; 
    pinMode(pinDir, OUTPUT); 
    pinMode(pinSpeed, OUTPUT); 
  }

  void move(uint8_t speed, bool forward)
  {
    _speed = speed;
    if(forward)
    {
      _dir = 1;
      digitalWrite(_pinDir, _invert ? LOW : HIGH);
    }
    else
    {
      _dir = -1;
      digitalWrite(_pinDir, _invert ? HIGH : LOW);
    }
    analogWrite(_pinSpeed, speed);
  }
};

class Lafvin2wd
{
private:
  Sensor remote;
  Sensor irDist[2];
  Sensor light[2];
  Sensor lineTrack[2];
  Sensor ultrasound;
  Motor motor[2];
  Servo  servo;
public:
  Lafvin2wd();

  void setup();
  void readAllSensors();
  void readRemote();
  void readIRDist();
  void readLight();
  void readLine();
  void readUltrasonic();

  bool hasRemote();
  uint8_t getRemote();

  bool hasIRDistance(bool left);
  uint8_t getIRDistance(bool left);

  bool hasLight(bool left);
  uint8_t getLightIntensity(bool left);

  bool hasLine(bool left);
  uint8_t getLine(bool left);

  bool hasUltrasonic();
  uint8_t getUltrasonic();

  void moveMotor(bool leftMotor, uint8_t speed, bool forward);
  void moveServo(int16_t angle);

  void move(uint8_t speed, bool forward);
  void stop();
  void rotate(uint8_t speed, bool left);
};
