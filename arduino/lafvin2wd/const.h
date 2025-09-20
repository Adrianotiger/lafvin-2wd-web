#pragma once

#define PIN_IR                 3
#define PIN_IR_DIST_LEFT      A1
#define PIN_IR_DIST_RIGHT     A2
#define PIN_LIGHT_LEFT        A0
#define PIN_LIGHT_RIGHT       A3
#define PIN_RESERVE_SDA       A4
#define PIN_RESERVE_SCL       A5
#define PIN_SDA               18
#define PIN_SCL               19
#define PIN_LINE_LEFT          7
#define PIN_LINE_RIGHT         9
#define PIN_ULTRASONIC_PULSE  12
#define PIN_ULTRASONIC_IN     13
#define PIN_MOTOR_LEFT_DIR     2
#define PIN_MOTOR_LEFT_SPEED   5
#define PIN_MOTOR_RIGHT_DIR    4
#define PIN_MOTOR_RIGHT_SPEED  6
#define PIN_SERVO             10

#define PIN_FREE_CUSTOM_1      8
#define PIN_FREE_CUSTOM_2     11

/* RESERVED PINS
* #define PIN_TX               1  ==> used from the BT module and from the USB serial
* #define PIN_RX               0  ==> used from the BT module and from the USB serial
* #define PIN_A0              14  ==> 
* #define PIN_A1              15  ==> 
* #define PIN_A2              16  ==> 
* #define PIN_A3              17  ==> 
* #define PIN_A4              18  ==> 
* #define PIN_A5              19  ==> 
*/

#define IR_UP                 0x46
#define IR_LEFT               0x44
#define IR_RIGHT              0x43
#define IR_DOWN               0x15
#define IR_OK                 0x40
const uint8_t IR_KEY[] =      {0x52, 0x16, 0x19, 0x0D, 0x0C, 0x18, 0x5E, 0x08, 0x1C, 0x5A};
#define IR_STAR               0x42
#define IR_HASH               0x4A
const char IR_CHAR[] = {'L','U','R','D','O','H','S','0','1','2','3','4','5','6','7','8','9'};
const uint8_t IR_MAP[] = {IR_LEFT,IR_UP,IR_RIGHT,IR_DOWN,IR_OK,IR_HASH,IR_STAR,IR_KEY[0],IR_KEY[1],IR_KEY[2],IR_KEY[3],IR_KEY[4],IR_KEY[5],IR_KEY[6],IR_KEY[7],IR_KEY[8],IR_KEY[9]};

#define SERVO_MIN             0
#define SERVO_MAX           180

#define MENU_MAIN             0
#define MENU_SENSORTEST       1
#define MENU_MOTORTEST        2
#define MENU_BEEBOT           3

