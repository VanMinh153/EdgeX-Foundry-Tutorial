function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

const deviceName = "my-custom-device";
let message = "test-message";
let json = {"name" : "My JSON"};

// DataSender sends async value to MQTT broker every 15 seconds
schedule('*/15 * * * * *', ()=>{
    let body = {
        "name": deviceName,
        "cmd": "randnum",
        "randnum": getRandomFloat(25,29).toFixed(1)
    };
    publish( 'DataTopic', JSON.stringify(body));
});

// CommandHandler receives commands and sends response to MQTT broker
// 1. Receive the reading request, then return the response
// 2. Receive the set request, then change the device value
subscribe( "CommandTopic" , (topic, val) => {
    var data = val;
    if (data.method == "set") {
        switch(data.cmd) {
            case "message":
                message = data[data.cmd];
              break;
            case "json":
                json = data[data.cmd];
                break;
        }
    }else{
        switch(data.cmd) {
            case "ping":
              data.ping = "pong";
              break;
            case "message":
              data.message = message;
              break;
            case "randnum":
                data.randnum = 12.123;
                break;
            case "json":
                data.json = json;
                break;
          }
    }
    publish( "ResponseTopic", JSON.stringify(data));
});
