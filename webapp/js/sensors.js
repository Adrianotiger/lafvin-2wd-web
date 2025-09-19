const sensorTest = new class extends Tab
{
  #trs = [];
  constructor()
  {
    super("Sensors Test");

    super.getDiv().style.height = "1vh";
    
    let table = _CN("table", {}, [], super.getDiv());
    _CN("tr", {}, [
      _CN("th", {}, ["Sensor"]),
      _CN("th", {style:"width:15vw;"}, ["Left"]),
      _CN("th", {style:"width:15vw;"}, ["Right"]),
      _CN("th", {}, ["Info"]),
    ], table);
    this.#trs['u'] = _CN("tr", {}, [
      _CN("td", {}, [_CN("img",{src:"images/ultrasonic.png"}), _CN("br"), "Ultrasonic Distance"]),
      _CN("td", {colspan:2,class:"b_val"}, ["∞ cm"]),
      _CN("td", {}, ["The HC-SR0 sensor is able to measure the distance from 2cm up to 250cm (analog)."]),
    ], table);
    this.#trs['d'] = _CN("tr", {}, [
      _CN("td", {}, [_CN("img",{src:"images/ir.png"}), _CN("br"), "Infrared Distance"]),
      _CN("td", {class:"b_val"}, ["🔴"]),
      _CN("td", {class:"b_val"}, ["🔴"]), //🟢
      _CN("td", {}, ["The IR-08H is an infrared sensor able to detect a reflection from 1 to 20cm set by the potentiometer (digital)."]),
    ], table);
    this.#trs['b'] = _CN("tr", {}, [
      _CN("td", {}, [_CN("img",{src:"images/line.png"}), _CN("br"), "Infrared Detector"]),
      _CN("td", {class:"b_val"}, ["⚪"]),
      _CN("td", {class:"b_val"}, ["⚪"]), /* ⚫ */
      _CN("td", {}, ["The KY-033 will just report if it detects a black surface (digital)."]),
    ], table);
    this.#trs['l'] = _CN("tr", {}, [
      _CN("td", {}, [_CN("img",{src:"images/light.png"}), _CN("br"), "Light"]),
      _CN("td", {class:"b_val"}, ["🌑", _CN("b",{style:"font-size:70%;"})]),
      _CN("td", {class:"b_val"}, ["🌑", _CN("b",{style:"font-size:70%;"})]), /* 🌒 🌓 🌔 🌕 */
      _CN("td", {}, ["Simple LDR, returning the light itensity (analog)"]),
    ], table);
    this.#trs['r'] = _CN("tr", {}, [
      _CN("td", {}, [_CN("img",{src:"images/remote.png"}), _CN("br"), "Remote"]),
      _CN("td", {colspan:2,class:"b_val"}, ["🔟 ", _CN("b")]),
      _CN("td", {}, ["A value, returned from the remote."]),
    ], table);

  }

  #colorize(tr)
  {
    tr.style.backgroundColor = "#8f8";
    setTimeout(()=>{
      tr.style.backgroundColor = "";
    }, 800);
  }

  eval(msg)
  {
    super.eval(msg);

    //Expect: $XYY
    if(msg[0] !=='$') return;

    switch(msg[1])
    {
      case 'R': // remote - $R0X
      {
        const s = {'U':"UP", 'D':"DOWN", 'L':"LEFT", 'R':"RIGHT", 'O':"OK", 'S':"STAR", 'H':"HASH", '0':"0", '1':"1", '2':"2", '3':"3", '4':"4", '5':"5", '6':"6", '7':"7", '8':"8", '9':"9", '_':"INVALID"}
        this.#colorize(this.#trs['r']);
        this.#trs['r'].getElementsByTagName("b")[0].textContent = s[msg[3]];
        break;
      }
      case 'd': // ir distance left - $d0X
      case 'D': // ir distance right - $D0X
      {
        this.#colorize(this.#trs['d']);
        const td = this.#trs['d'].getElementsByTagName("td")[msg[1]==='d'?1:2];
        switch(msg[3])
        {
          case '0': td.textContent = '🔴'; break;
          case '1': td.textContent = '🟢'; break;
          default: td.textContent = '🤔'; break;
        }
        
        break;
      }
      case 'l': // light left - $lXX
      case 'L': // light right - $LXX 🌑 🌒 🌓 🌔 🌕
      {
        this.#colorize(this.#trs['l']);
        const td = this.#trs['l'].getElementsByTagName("td")[msg[1]==='l'?1:2];
        const b = this.#trs['l'].getElementsByTagName("b")[msg[1]==='l'?0:1];
        const light = Number.parseInt(msg.substring(2, 4), 16);
        td.childNodes[0].textContent = ["🌑","🌒","🌓","🌔","🌕"][parseInt(light / 51)];
        b.textContent = light;
        
        break;
      }
      case 'b': // black line left - $b0X
      case 'B': // black line right - $B0X
      {
        this.#colorize(this.#trs['b']);
        const td = this.#trs['b'].getElementsByTagName("td")[msg[1]==='b'?1:2];
        switch(msg[3])
        {
          case '0': td.textContent = '⚪'; break;
          case '1': td.textContent = '⚫'; break;
          default: td.textContent = '🤔'; break;
        }
        
        break;
      }
      case 'U': // Ultrasonic distance - $UXX
      {
        this.#colorize(this.#trs['u']);
        const td = this.#trs['u'].getElementsByTagName("td")[1];
        const dist = Number.parseInt(msg.substring(2, 4), 16);
        td.textContent = (dist > 250 ? "∞ cm" : dist + " cm");
        break;
      }
    }
  }
};