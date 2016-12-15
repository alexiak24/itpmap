var data;
var countries = {};
var img;

var vid;
var playing = false;
var completion;
var baseDiameter = 10;
var currentCountry;
var currentVideo;

var videoX, videoY;
var videoWidth = 400;
var videoHeight = 300;

var numVideosForCountry = 0;

var canvas;

function preload() {
  data = loadJSON("ITP.JSON");
  img = loadImage("world_map.jpg");
}

function setup() {
  canvas = createCanvas(1280, 758);

  buildCountryData();
  
}

function draw() {

  //button.mousePressed("https://goo.gl/6HTFeS");
  background(50);
  image(img, 0, 0);

  noStroke();
  textAlign(CENTER);
  textStyle(BOLD);
  push();
  translate(615, 477);

  for (var key in countries) {
    var c = countries[key];
    var x = 3.70 * c.long; //convert degrees to pixels    37.0 pixels= 10'degrees
    var y = -4.92 * c.lat; //convert degrees to pixels, and flip y axis for canvas

    var diameter = baseDiameter * Math.sqrt(c.count); //the more people from the country, the bigger the circle

    if (!x || !y) continue; //ignore countries that are missing latitude and longitude data


    fill(c.countryColor);
    noStroke();
    ellipse(x, y, diameter, diameter); //draw circle


    if (dist(x, y, mouseX - 615, mouseY - 477) < diameter / 2) {
      fill(0)
      videoX = mouseX;
      videoY = mouseY;

      text(key, x, y); //draw name of country
     
    }
  }

  pop();
  
  canvas.mousePressed(hideVideo)

}

function hideVideo(){
  if (currentVideo) {
    currentVideo.stop();
    currentVideo.hide();
    var leftArrow = select('#leftArrow');
    if (leftArrow) {
      leftArrow.hide();
    }
    var rightArrow = select('#rightArrow');
    if (rightArrow) {
      rightArrow.hide();
    }
  }
  
}

function nextVideo() {
  console.log("in next video function");
  console.log(currentCountry.currentVideo);
  currentCountry.currentVideo = Math.min(data[currentCountry.index]["videos"].length - 1, currentCountry.currentVideo + 1);
  console.log(currentCountry.currentVideo);
  playVideoAtIndex(currentCountry.currentVideo, currentCountry.x, currentCountry.y);
}

function previousVideo() {
  console.log("in prev video function");
  console.log(currentCountry.currentVideo);
  currentCountry.currentVideo = Math.max(0, currentCountry.currentVideo - 1);
  console.log(currentCountry.currentVideo);
  playVideoAtIndex(currentCountry.currentVideo, currentCountry.x, currentCountry.y);
}

function buildCountryData() {
  for (var i = 0; i < 59; i++) {
    //console.log(i);
    var countryName = data[i].country;
    //populate our custom countries object with data from json file
    if (countries.hasOwnProperty(countryName)) {
      //if we've already seen this particular country, add one to the count
      countries[countryName].count++;
    } else {
      //if we haven't seen this particular country, then create a new object

      countries[countryName] = {
        count: 1,
        index: i,
        currentVideo: 0,
        lat: data[i].latitude,
        long: data[i].longtitude,
        countryColor: color(random(100, 200), random(100, 200), random(100, 200), 200)
      };
    }
  }
  //println(countries);
}

function playVideoAtIndex(index, videoX, videoY) {
  // Bring things that would be far to the right back towards the middle
  videoX = Math.min(800, videoX);
  videoY = Math.min(500, videoY);

  if (typeof leftArrow !== 'undefined') {
    leftArrow.remove();
    rightArrow.remove();
  }
  var c = currentCountry;
  if (currentVideo) {
    currentVideo.stop();
    currentVideo.hide();
  }


  var controlBarOffset = -37;
  var textY = videoHeight + videoY + controlBarOffset;
  numVideosForCountry = data[currentCountry.index].videos.length;
  
  if (numVideosForCountry > 1) {
    leftArrow = createElement('div', '<');
    leftArrow.id('leftArrow');
    rightArrow = createElement('div', '>');
    rightArrow.id('rightArrow');
    leftArrow.position(videoX + 10, textY + 50);
    leftArrow.mousePressed(previousVideo);
    rightArrow.position(videoX + videoWidth - 40, textY + 50);
    rightArrow.mousePressed(nextVideo);
  }

  if (numVideosForCountry != 0) {
    video = data[currentCountry.index].videos[currentCountry.currentVideo];
    videoObject = createVideo('videos/' + video);
    videoObject.size(videoWidth, videoHeight);
    videoObject.show();
    videoObject.position(videoX, videoY);
    videoObject.play();
    currentVideo = videoObject;
  }
}

function mousePressed() {
  for (var key in countries) {
    var c = countries[key];
    //c.videoObject.stop();
    //c.videoObject.hide();
    var x = 3.70 * c.long; //convert degrees to pixels    37.0 pixels= 10'degrees
    var y = -4.92 * c.lat; //convert degrees to pixels, and flip y axis for canvas
    var diameter = baseDiameter * Math.sqrt(c.count); //the more people from the country, the bigger the circle
    if (dist(x, y, mouseX - 615, mouseY - 477) < diameter / 2) {
      console.log("country clicked");
      currentCountry = countries[key];
      currentCountry.x = mouseX;
      currentCountry.y = mouseY;
      playVideoAtIndex(0, mouseX, mouseY);
    }
  }
}


