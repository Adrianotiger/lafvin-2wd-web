const beeBot = new class extends Tab
{
  #cmd = [];
  #cmddiv = null;
  #isExecuting = false;
  #forwardTime = null;
  #rotateTime = null;
  #speed = null;
  #playDiv = null;

  #commands = {
    up:{symbol:"⬆",cmd:"F"},     /* 0x0800ms, speed:0x40 */
    down:{symbol:"⬇",cmd:"B"},   /* 0x0800ms, speed:0x40 */
    left:{symbol:"↺",cmd:"L"},   /* 0x0100ms, speed:0x40 */
    right:{symbol:"↻",cmd:"R"}   /* 0x0100ms, speed:0x40 */
  };

  constructor()
  {
    super("BeeBot emulation");

    const div = super.getDiv();
    div.style.height = "1vh";

    this.#cmd = [];

    _CN("button", {class:"beebot_button beebot_reset"}, ["🗘"], div).addEventListener("click",()=>{
      this.#cmddiv.innerHTML = "";
      this.#cmd = [];
    });

    _CN("button", {class:"beebot_button"}, ["↺"], div).addEventListener("click",()=>{this.addCommand({...this.#commands.left})});
    _CN("button", {class:"beebot_button"}, ["⬆"], div).addEventListener("click",()=>{this.addCommand({...this.#commands.up})});
    _CN("button", {class:"beebot_button"}, ["⬇"], div).addEventListener("click",()=>{this.addCommand({...this.#commands.down})});
    _CN("button", {class:"beebot_button"}, ["↻"], div).addEventListener("click",()=>{this.addCommand({...this.#commands.right})});
    this.#playDiv = _CN("button", {class:"beebot_button beebot_start"}, ["▶"], div);
    this.#playDiv.addEventListener("click",()=>{
      if(this.#isExecuting)
      {
        this.#stopExecuting();
      }
      else if(this.#cmd.length > 0)
      {
        this.#isExecuting = true;
        this.#playDiv.textContent = "⛔";
        this.#executeProgram(0);
      }
    });

    this.#cmddiv = _CN("div", {style:"background:#cc5;width:96%;height:30vh;margin:0 auto;"}, [], div);

    let config = _CN("div", {style:"border-radius:2vh;width:90%;margin:0 auto;background:#ee0;"}, [_CN("h2", {style:"text-align:left;margin:5px;"}, ["⚙️"])], div);
    let confF = _CN("span", {style:"width:25vw;display:inline-block;margin:2vw;"}, ["Forward time (ms): "], config);
    let confR = _CN("span", {style:"width:25vw;display:inline-block;margin:2vw;"}, ["Rotate time (ms): "], config);
    let confS = _CN("span", {style:"width:25vw;display:inline-block;margin:2vw;"}, ["Speed (%): "], config);

    this.#forwardTime = _CN("input", {type:"range", value:"1060", min:400, max:3000, step:20, style:"width:100%;"}, [], confF);
    this.#forwardTime.value = 1060;
    this.#forwardTime.addEventListener("input", (ev)=>{
      confF.getElementsByTagName("b")[0].textContent = this.#forwardTime.value + " ms";
    });
    this.#rotateTime = _CN("input", {type:"range", value:"800", min:400, max:3000, step:20, style:"width:100%;"}, [], confR);
    this.#rotateTime.value = 800;
    this.#rotateTime.addEventListener("input", (ev)=>{
      confR.getElementsByTagName("b")[0].textContent = this.#rotateTime.value + " ms";
    });
    this.#speed = _CN("input", {type:"range", value:"50", min:20, max:100, step:2, style:"width:100%;"}, [], confS);
    this.#speed.value = 50;
    this.#speed.addEventListener("input", (ev)=>{
      confS.getElementsByTagName("b")[0].textContent = this.#speed.value + " %";
    });
    _CN("b", {}, [`${this.#forwardTime.value} ms`], confF);
    _CN("b", {}, [`${this.#rotateTime.value} ms`], confR);
    _CN("b", {}, [`${this.#speed.value} %`], confS);
    
  }

  #stopExecuting()
  {
    this.#playDiv.textContent = "▶";
    this.#isExecuting = false;
  }

  #executeProgram(index)
  {
    if(index > 0) this.#cmd[index-1].div.style.background="#aaa";
    if(index >= this.#cmd.length || !this.#isExecuting)
    {
      this.#stopExecuting();
      return;
    }
    this.#cmd[index].div.style.background="#ffa";

    let str = ">" + this.#cmd[index].cmd;
    let timeout = 1000;
    let speed = parseInt(this.#speed.value);
    if(this.#cmd[index].cmd === 'F' || this.#cmd[index].cmd === 'B')
    {
      timeout = parseInt(this.#forwardTime.value);
      str += timeout.toString(16).padStart(4, '0');
      str += speed.toString(16).padStart(2, '0');
    }
    else if(this.#cmd[index].cmd === 'L' || this.#cmd[index].cmd === 'R')
    {
      timeout = parseInt(this.#rotateTime.value);
      str += timeout.toString(16).padStart(4, '0');
      str += speed.toString(16).padStart(2, '0');
    }
    else
    {
      str += "000000";
    }

    bt.send(str);

    setTimeout(()=>{
      this.#executeProgram(index+1);
    }, timeout + 500);
  }

  addCommand(cmd)
  {
    cmd.div = _CN("button", {style:"width:32px;height:32px;line-height:32px;background:#aaa;padding:0px;margin:1px;"}, [cmd.symbol], this.#cmddiv);
    cmd.div.addEventListener("click", ()=>{
      this.#cmd.forEach((c, i)=>{
        if(c === cmd)
        {
          this.#cmddiv.removeChild(c.div);
          this.#cmd.splice(i, 1);
        } 
      });
    });
    this.#cmd.push(cmd);
  }

  eval(msg)
  {
    super.eval(msg);
  }
};