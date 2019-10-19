const flighPath = {
  curviness: 0,
  autoRotate: false,
  values: [{ x: -4000, y: 0 }]
};

const tween = new TimelineLite();

tween.add(
  TweenLite.to(".process-visualization", 1, {
    bezier: flighPath,
    ease: Power1.easeInOut
  })
);

const controller = new ScrollMagic.Controller();

const scene = new ScrollMagic.Scene({
  triggerElement: ".animation",
  duration: 2000,
  triggerHook: 0
})
  .setTween(tween)
  // .addIndicators()
  .setPin(".animation")
  .addTo(controller);
