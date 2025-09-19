struct TMsg {
  uint8_t len;
  union
  {
    struct
    {
      char type;
      char id;
      uint8_t value[4];
      uint8_t extra[2];
    };
    char ch[8];
  };
};

class SerialMsg
{
private:
  struct TMsg _msg[16];
  uint8_t _msgIndex;
  uint8_t _msgCount;
  char _temp;

  createPacket()
  {
    _msgIndex = (_msgIndex + 1) % 16;
    _msg[_msgIndex].len = 0;
    _msgCount++;
    if(_msgCount > 15) _msgCount = 15;
  }

public:
  SerialMsg()
  {
    _msgCount = 0;
    _msgIndex = 0;

    _msg[0].len = 0;
  }

  parseSerial()
  {
    while(Serial.available() > 0)
    {
      _temp = Serial.read();
      if(_msg[_msgIndex].len == 0)
      {
        if(_temp == '@' || _temp == '#' || _temp == '$' || _temp == '>')
        {
          _msg[_msgIndex].type = _temp;
          _msg[_msgIndex].len++;
        }
      }
      else
      {
        _msg[_msgIndex].ch[_msg[_msgIndex].len] = _temp;
        _msg[_msgIndex].len++;
        if(_msg[_msgIndex].type == '#' && _msg[_msgIndex].len >= 2) createPacket();       // menu
        else if(_msg[_msgIndex].type == '$' && _msg[_msgIndex].len >= 2) createPacket();  // sensor request
        else if(_msg[_msgIndex].type == '@' && _msg[_msgIndex].len >= 4) createPacket();  // motor
        else if(_msg[_msgIndex].type == '>' && _msg[_msgIndex].len == 8) createPacket();  // motor
      }
    }
  }

  bool hasPackets()
  {
    return _msgCount > 0;
  }

  bool hasMenuPacket()
  {
    return hasPackets() && getNextPacket(false)->type == '#';
  }

  struct TMsg* getNextPacket(bool remove)
  {
    if(_msgCount == 0) return NULL;

    uint8_t index = (_msgIndex + 16 - _msgCount) % 16;
    if(remove) _msgCount--;
    
    return &_msg[index];
  }

  uint16_t parseValue(char* val, uint8_t bytes)
  {
    uint16_t ret = 0;
    for(uint8_t j=0;j<bytes;j++)
    {
      ret *= 16;
      if(val[j] <= '9') ret += (val[j] - '0');
      else if(val[j] < 'a') ret += (val[j] - 'A' + 10);
      else ret += (val[j] - 'a' + 10);
    }
    Serial.print("parse value: "); Serial.println(ret); 
    return ret;
  }
};




