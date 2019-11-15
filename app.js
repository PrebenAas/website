// const flighPath = {
//   curviness: 0,
//   autoRotate: false,
//   values: [{ x: -5000, y: 0 }]
// };

// const tween = new TimelineLite();

// tween.add(
//   TweenLite.to(".process-visualization", 1, {
//     bezier: flighPath,
//     ease: Power1.easeInOut
//   })
// );

// const controller = new ScrollMagic.Controller();

// const scene = new ScrollMagic.Scene({
//   triggerElement: ".animation",
//   duration: 2000,
//   triggerHook: 0
// })
//   .setTween(tween)
//   // .addIndicators()
//   .setPin(".animation")
//   .addTo(controller);

// //------------------------------------------------------------ STICKY

// window.onscroll = function() {
//   myFunction();
// };

// // Get the header
// var header = document.getElementById("stickyHeader");

// // Get the offset position of the navbar
// var sticky = header.offsetTop;

// // Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
// function myFunction() {
//   if (window.pageYOffset > sticky) {
//     header.classList.add("sticky");
//   } else {
//     header.classList.remove("sticky");
//   }
// }

//----------------------------------------------------

// Init Context
let c = document.createElement("canvas").getContext("2d");
let postctx = document.body
  .appendChild(document.createElement("canvas"))
  .getContext("2d");
let canvas = c.canvas;
let vertices = [];

// Effect Properties
let vertexCount = 7000;
let vertexSize = 2;
let oceanWidth = 204;
let oceanHeight = -100;
let gridSize = 32;
let waveSize = 18;
let perspective = 200;

// Common variables
let depth = (vertexCount / oceanWidth) * gridSize;
let frame = 0;
let { sin, cos, tan, PI } = Math;

// Render loop
let loop = () => {
  let rad = (sin(frame / 100) * PI) / 20;
  let rad2 = (sin(frame / 50) * PI) / 10;
  frame++;
  if (
    postctx.canvas.width !== postctx.canvas.offsetWidth ||
    postctx.canvas.height !== postctx.canvas.offsetHeight
  ) {
    postctx.canvas.width = canvas.width = postctx.canvas.offsetWidth;
    postctx.canvas.height = canvas.height = postctx.canvas.offsetHeight;
  }

  c.fillStyle = `hsl(0, 0%, 100%)`;
  c.fillRect(0, 0, canvas.width, canvas.height);
  c.save();
  c.translate(canvas.width / 2, canvas.height / 2);

  c.beginPath();
  vertices.forEach((vertex, i) => {
    let ni = i + oceanWidth;
    let x = vertex[0] - (frame % (gridSize * 2));
    let z =
      vertex[2] -
      ((frame * 0.00001) % gridSize) +
      (i % 2 === 0 ? gridSize / 2 : 0);
    let wave =
      cos(frame / 45 + x / 50) -
      sin(frame / 20 + z / 50) +
      sin(frame / 30 + (z * x) / 80000);
    let y = vertex[1] + wave * waveSize;
    let a = Math.max(0.3, 1 - Math.sqrt(x ** 2 + z ** 2) / depth);
    let tx, ty, tz;

    y -= oceanHeight;

    // Transformation variables
    tx = x;
    ty = y;
    tz = z;

    // Rotation Y
    tx = x * cos(rad) + z * sin(rad);
    tz = -x * sin(rad) + z * cos(rad);

    x = tx;
    y = ty;
    z = tz;

    // Rotation Z
    tx = x * cos(rad) - y * sin(rad);
    ty = x * sin(rad) + y * cos(rad);

    x = tx;
    y = ty;
    z = tz;

    // Rotation X

    ty = y * cos(rad2) - z * sin(rad2);
    tz = y * sin(rad2) + z * cos(rad2);

    x = tx;
    y = ty;
    z = tz;

    x /= z / perspective;
    y /= z / perspective;

    if (a < 0.01) return;
    if (z < 0) return;

    c.globalAlpha = a;
    //color the dots
    c.fillStyle = `hsl(${180 + wave * 10}deg, 100%, 30%)`;
    c.fillRect(
      x - (a * vertexSize) / 2,
      y - (a * vertexSize) / 2,
      a * vertexSize,
      a * vertexSize
    );
    c.globalAlpha = 1;
  });
  c.restore();

  // Post-processing
  postctx.drawImage(canvas, 0, 0);

  postctx.globalCompositeOperation = "screen";
  postctx.filter = "blur(16px)";
  // postctx.drawImage(canvas, 0, 0);
  postctx.filter = "blur(0)";
  postctx.globalCompositeOperation = "source-over";

  requestAnimationFrame(loop);
};

// Generating dots
for (let i = 0; i < vertexCount; i++) {
  let x = i % oceanWidth;
  let y = 0;
  let z = (i / oceanWidth) >> 0;
  let offset = oceanWidth / 2;
  vertices.push([(-offset + x) * gridSize, y * gridSize, z * gridSize]);
}

loop();
