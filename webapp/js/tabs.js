let globalTabs = [];
let activeTab = null;

class Tab
{
  #tab = null;
  #div = null;
  #name = "invalid";

  constructor(name)
  {
    this.#name = name;

    this.#tab = _CN("div", {class:"controlTab", style:`left:${1+globalTabs.length * 30}vw`}, [_CN("table", {}, [_CN("tr", {}, [_CN("td", {}, [name])])])], document.body);
    this.#div = _CN("div", {class:"controlDiv"}, [], document.body);

    _CN("h2", {}, [name], this.#div);
    _CN("hr", {}, [], this.#div);

    this.#tab.addEventListener("click", ()=>{
      this.show();
    });

    globalTabs.push(this);
  }

  getDiv()
  {
    return this.#div;
  }

  async show()
  {
    globalTabs.forEach(gt=>{
      if(gt !== this)
        gt.hide();
    });

    activeTab = this;
    this.#div.style.height = "86%";
    this.#div.style.zIndex = 205;
    this.#div.style.opacity = 1.0;
    console.log("Start " + this.#name + "...");
    try {
      // Send a message to enter right menu.
      await bt.send("#" + this.#name[0]);
    } catch (error) {
      console.log(error, 'error');
    }
  }

  async hide()
  {
    this.#div.style.height = "1vh";
    this.#div.style.opacity = 0.1;
    setTimeout(()=>{
      this.#div.style.zIndex = 200;
    });
  }

  eval(msg)
  {
    if(msg[0] === '#')
    {
      if(msg[1] === 'S') // sensors
      {
        
      }
    }
  }
}