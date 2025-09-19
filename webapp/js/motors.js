const motorTest = new class extends Tab
{
  #trs = [];
  #inps = [];
  constructor()
  {
    super("Motors Test");

    super.getDiv().style.height = "1vh";

    let table = _CN("table", {}, [], super.getDiv());
    _CN("tr", {}, [
      _CN("th", {}, ["Device"]),
      _CN("th", {style:"width:40vw;"}, ["Control"]),
      _CN("th", {}, ["Info"]),
    ], table);

    this.#trs['l'] = _CN("tr", {}, [
      _CN("td", {}, [_CN("img",{src:"images/motor.png"}), _CN("br"), "Left motor"]),
      _CN("td", {}, [_CN("input", {type:"range",min:-100,max:100,value:0,step:1,style:"width:80%;"}),_CN("br"),_CN("b",{},["Power: 0%"])]),
      _CN("td", {}, ["The left gear motor can be powered over a PWM signal."]),
    ], table);

    this.#trs['r'] = _CN("tr", {}, [
      _CN("td", {}, [_CN("img",{src:"images/motor.png"}), _CN("br"), "Right motor"]),
      _CN("td", {}, [_CN("input", {type:"range",min:-100,max:100,value:0,step:1,style:"width:80%;"}),_CN("br"),_CN("b",{},["Power: 0%"])]),
      _CN("td", {}, ["The right gear motor can be powered over a PWM signal."]),
    ], table);

    this.#trs['s'] = _CN("tr", {}, [
      _CN("td", {}, [_CN("img",{src:"images/servo.png"}), _CN("br"), "Ultrasonic Servo"]),
      _CN("td", {}, [_CN("input", {type:"range",min:0,max:180,value:90,step:1,style:"width:80%;"}),_CN("br"),_CN("b",{},["Angle: 90°"])]),
      _CN("td", {}, ["The servo can move 90° to the left or right."]),
    ], table);

    const motors = [
        {text:"Power: *%", factor:1.25, key:'@L'}, 
        {text:"Power: *%", factor:1.25, key:'@R'}, 
        {text:"Angle: *°", factor:1, key:'@S'}
    ];
    Object.keys(this.#trs).forEach((trk, index)=>{
      const inp = this.#trs[trk].getElementsByTagName("input")[0];
      this.#inps.push(inp);

      inp.addEventListener("change", ()=>{
        this.#trs[trk].getElementsByTagName("b")[0].textContent = motors[index].text.replace("*", inp.value);
        console.log("Changed");
        if(inp.value < 0)
        {
          this.sendValue(motors[index].key.toLowerCase(), -inp.value * motors[index].factor);
        }
        else
        {
          this.sendValue(motors[index].key, inp.value * motors[index].factor);
        }
        if(inp.value !== 0 && index < 2)
        {
          setTimeout(()=>{inp.value = 0;},2000);
        }
      });
      inp.addEventListener("input", ()=>{
        this.#trs[trk].getElementsByTagName("b")[0].textContent = motors[index].text.replace("*", inp.value);
      });
    });
  }

  sendValue(motor, val)
  {
    let v = parseInt(val).toString(16);
    if(v.length < 2) v = '0' + v;
    else if(v.length > 2) v = v.substring(0,2);
    bt.send(motor + v);
  }
}