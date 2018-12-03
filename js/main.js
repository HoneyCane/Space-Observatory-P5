var capture;
var tracker;

var img1, img2, img3, img4, img5, img6;
var images = [img1, img2, img3, img4, img5, img6];
var oceanImage;
var currentTexture;

var timePassed = 0;

var audio1, audio2;

var w = 1080,
    h = 600;

var camXrotate = 0, camYrotate = 0;
var toleranceX, toleranceY;
var cameraSpeed = 0.005;

function preload() {
  images[0] = loadImage("assets/outer-space.jpg");
  images[1] = loadImage("assets/cloudy-galaxy.jpg");
  images[2] = loadImage("assets/milky-way-purple.jpg");
  images[3] = loadImage("assets/milky-way.jpg");
  images[4] = loadImage("assets/random-cluster.jpg");
  images[5] = loadImage("assets/random-starfield.jpg");
  oceanImage = loadImage("assets/Cuba-Night.jpeg");
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    currentTexture = random(images);

    audio1 = createAudio("assets/audio1.mp3");
    audio2 = createAudio("assets/audio2.mp3");
    audio1.onended( function play2() {
      audio2.play();
    });
    audio2.onended( function play1() {
      audio1.play();
    });
    audio1.volume(0.3);
    audio2.volume(0.3);
    audio2.play();

    toleranceX = height/3;
    toleranceY = width/3;

    capture = createCapture({
        audio: false,
        video: {
            width: w,
            height: h
        }
    }, function() {
        console.log('capture ready.');
    });
    capture.elt.setAttribute('playsinline', '');
    capture.size(w, h);
    capture.hide();

    tracker = new clm.tracker();
    tracker.init();
    tracker.start(capture.elt);

    noStroke();
    fill(125,255,50);

    perspective();
}

function draw() {
    background(125);
    orbitControl();
    rotateX(camXrotate);
    rotateY(camYrotate);

    if (millis() - timePassed > 30000) {
      timePassed = millis();
      currentTexture = random(images);
    }

    texture(currentTexture);
    rotateY(frameCount * 0.0001);
    sphere(2991, 1997);

    push();
    texture(oceanImage);
    translate(0, height/4, 0);
    rotateY(frameCount * -0.0001);
    rotateX(radians(90));
    plane(6000, 6000);
    pop();


    var positions = tracker.getCurrentPosition();

    if (positions) {
      if (dist(positions[62][0], positions[62][1], width/2, 0) < toleranceX ) { // check upward tilt
        camXrotate += cameraSpeed;
      }
      if (dist(positions[62][0], positions[62][1], width/2, height) < toleranceX ) { // check downward tilt
        camXrotate -= cameraSpeed;
      }
      if (dist(positions[62][0], positions[62][1], 0, height/2) < toleranceY ) { // check leftward tilt
        camYrotate += cameraSpeed;
      }
      if (dist(positions[62][0], positions[62][1], width, height/2) < toleranceY ) { // check rightward tilt
        camYrotate -= cameraSpeed;
      }
    }
}
