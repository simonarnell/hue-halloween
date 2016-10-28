var Prob = require('prob.js');
var Hue = require("node-hue-api"),
    HueApi = Hue.HueApi,
    lightState = Hue.lightState;

const hostname = "INSERT YOUR HUE BRIDGE IP HERE",
    timeout = 20000,
    port = 80,
    username = "INSERT YOUR HUE BRIDGE API KEY HERE"; 
	
var hue = new HueApi(hostname, username, timeout, port);
	
const lights = [1,2,3];
const colours = [[0.408,0.517], //green
  [0.3787,0.1724], //magenta 
  [0.5951, 0.3872], //orange
  [0.3227,0.329]]; //white

var flashInterArrival = Prob.exponential(0.0005); // on average an event per bulb every two seconds
var flashDuration = Prob.normal(750, 150); // generates numbers mostly in the range of 350 - 1200 

function sequenceLight(lightId) {
  let nextIA = Math.floor(flashInterArrival())
  console.log("light:" + lightId + " - interarrvial:" + nextIA)
  setTimeout(function() {
    let colour = colours[Math.floor(Math.random() * colours.length)];
	let randomBrightness = Math.random();
	let state = lightState.create().on().xy(colour[0], colour[1]).bri(Math.floor((1 - (randomBrightness * randomBrightness))*255)).transitiontime(0);
	hue.setLightState(lightId, state);
	let duration = Math.floor(flashDuration())
	console.log("light:" + lightId + " - duration:" + duration)
	setTimeout(function() { 
	  let state = lightState.create().off().transitiontime(0);
	  hue.setLightState(lightId, state);
	  }, duration);
	sequenceLight(lightId)
  }, nextIA);
} 

for(light in lights)
  sequenceLight(lights[light])
