const beeBot = new class extends Tab
{
  #cmd = [];
  #cmddiv = null;
  #isExecuting = false;
  #forwardTime = 0x380;
  #rotateTime = 0x29a;
  #speed = 0x30;
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
    if(this.#cmd[index].cmd === 'F' || this.#cmd[index].cmd === 'B')
    {
      timeout = this.#forwardTime;
      str += this.#forwardTime.toString(16).padStart(4, '0');
      str += this.#speed.toString(16).padStart(2, '0');
    }
    else if(this.#cmd[index].cmd === 'L' || this.#cmd[index].cmd === 'R')
    {
      timeout = this.#rotateTime;
      str += this.#rotateTime.toString(16).padStart(4, '0');
      str += this.#speed.toString(16).padStart(2, '0');
    }
    else
    {
      str += "000000";
    }

    bt.send(str);

    setTimeout(()=>{
      this.#executeProgram(index+1);
    }, this.#rotateTime + 1000);
  }

  addCommand(cmd)
  {
    cmd.div = _CN("button", {style:"width:32px;height:32px;line-height:32px;background:#aaa;padding:0px;margin:1px;"}, [cmd.symbol], this.#cmddiv);
    this.#cmd.push(cmd);
  }

  eval(msg)
  {
    super.eval(msg);
  }
};