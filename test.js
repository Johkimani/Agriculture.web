let slideCurrent = 0;
const slides = [
    "pexels-nc-farm-bureau-mark-2886937.jpg",
    "pexels-nc-farm-bureau-mark-2252584.jpg",
    "Screenshot 2025-03-21 131246.png"
];

function moveSlide(direction) {
    slideCurrent += direction;

    if (slideCurrent < 0) {
        slideCurrent = slides.length - 1; // Loop to last slide
    } else if (slideCurrent >= slides.length) {
        slideCurrent = 0; // Loop to first slide
    }

    const slidingBackground = document.querySelector('.sliding-background');
    slidingBackground.style.backgroundImage = `url(${slides[slideCurrent]})`;
}
  