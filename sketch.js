// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];

let circleX = 320; // 圓的初始 X 座標
let circleY = 240; // 圓的初始 Y 座標
const circleRadius = 50; // 圓的半徑

let isDragging = false; // 判斷是否正在拖曳圓
let trail = []; // 儲存圓的軌跡

function preload() {
  // Initialize HandPose model with flipped video input
  handPose = ml5.handPose({ flipped: true });
}

function mousePressed() {
  console.log(hands);
}

function gotHands(results) {
  hands = results;
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  // Start detecting hands
  handPose.detectStart(video, gotHands);
}

function draw() {
  image(video, 0, 0);

  // 繪製軌跡
  noFill();
  stroke(0, 0, 255); // 藍色
  strokeWeight(2);
  beginShape();
  for (let pos of trail) {
    vertex(pos.x, pos.y);
  }
  endShape();

  // 繪製圓
  fill(0, 255, 0); // 綠色
  noStroke();
  circle(circleX, circleY, circleRadius * 2);

  // 確保至少檢測到一隻手
  if (hands.length > 0) {
    let isTouching = false;

    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // 檢查食指 (keypoints[8]) 是否接觸到圓
        let indexFinger = hand.keypoints[8];
        let distance = dist(indexFinger.x, indexFinger.y, circleX, circleY);

        if (distance < circleRadius) {
          // 如果接觸到，讓圓的位置跟隨食指移動
          circleX = indexFinger.x;
          circleY = indexFinger.y;

          // 新增圓的位置到軌跡
          trail.push({ x: circleX, y: circleY });

          isTouching = true;
        }
      }
    }

    // 更新拖曳狀態
    isDragging = isTouching;
  }

  // 如果手指離開圓，停止新增軌跡
  if (!isDragging && trail.length > 0) {
    trail = trail.slice(0); // 保留現有軌跡
  }
}
