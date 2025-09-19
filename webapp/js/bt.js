function _CN(e,t,r,n=null){var o=document.createElement(e);if("object"==typeof t)for(var a in t)o.setAttribute(a,t[a]);return Array.isArray(r)&&r.forEach(e=>{o.appendChild("string"==typeof e||"number"==typeof e?document.createTextNode(e):e)}),null!==n&&n.appendChild(o),o}

let bt = null;
let btMsg = [];

function findBT(butt)
{
  butt.style.display = "hidden";
  
  if(!bt)
  {
    bt = new BluetoothTerminal({
        // serviceUuid: 0xFFE0,
        // characteristicUuid: 0xFFE1,
        // characteristicValueSize: 20,
        // receiveSeparator: '\n',
        // sendSeparator: '\n',
        // logLevel: 'log',
    });

    // Set a callback that will be called when an incoming message from the
    // connected device is received.
    bt.onReceive((message) => {
      console.info(`Message received: "${message}"`);
      while(message.length > 0)
      {
        btMsg.push(message[0]);
        message = message.slice(1);
      }
      while(btMsg.length >= 4)
      {
        parseBTData();
      }
    });

    // Open the browser Bluetooth device picker to select a device if none was
    // previously selected, establish a connection with the selected device, and
    // initiate communication.
    bt.connect().then(() => {
      // Retrieve the name of the currently connected device.
      console.info(`Device "${bt.getDeviceName()}" successfully connected`);
      document.getElementById("connectionDiv").getElementsByTagName("th")[0].textContent = bt.getDeviceName();

      document.getElementById("connectionDiv").style.height = "25px";

      [...document.getElementsByClassName("controlDiv")].forEach(ct=>{ct.style.height = "80vh"});

      globalTabs[0].show();
    });

    bt.onDisconnect(() => {
      document.getElementById("connectionDiv").style.height = "";
      butt.style.display = "";
      document.getElementById("connectionDiv").getElementsByTagName("th")[0].textContent = "Disconnected";
      [...document.getElementsByTagName("controlDiv")].forEach(ct=>{ct.style.height = "2vh"});
    });
  }
  
  console.log(bt);
}

function parseBTData()
{
  switch(btMsg[0])
  {
    case '$': // sensor value $XYY [X=Sensor, Y=Value(hex)]
    {
      if(btMsg.length >= 4)
      {
        activeTab.eval(btMsg.splice(0, 4).join(""));
      }
      break;
    }
    case '#': // menu #X [X=Menu], stop the current loop
    {
      if(btMsg.length >= 2)
      {
        activeTab.eval(btMsg.splice(0, 2).join(""));
      }
      break;
    }
    default: // unable to find a valid command, remove this char
    {
      btMsg.splice(0, 1);
      break;
    }
  }
}