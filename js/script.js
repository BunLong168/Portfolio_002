//canvas
"use strict";

var canvas = document.getElementById("canvas"),
  ctx = canvas.getContext("2d"),
  w = (canvas.width = window.innerHeight),
  h = (canvas.height = window.innerWidth),
  points = [],
  amount = 170, // relative to screen size
  speed = 10,
  size = 2,
  lineWidth = 2.0,
  connectionDistance = 210,
  randomSize = 0.5,
  mouseX = 0,
  mouseY = 0,
  mouseRadius = 0;

window.addEventListener(
  "resize",
  function () {
    (w = canvas.width = window.innerWidth),
      (h = canvas.height = window.innerHeight);

    ctx.fillStyle = "#051622";
    ctx.fillRect(0, 0, w, h);
  },
  false
);

function setup() {
  (w = canvas.width = window.innerWidth),
    (h = canvas.height = window.innerHeight);

  var screenDelta = Math.sqrt(w + h) / 70;
  var useAmount = amount * screenDelta;

  for (var i = 0; i < useAmount; i++) {
    var x = Math.random() * w;
    var y = Math.random() * h;
    var xSpeed = Math.random() * (speed / 10) - speed / 20;
    var ySpeed = Math.random() * (speed / 10) - speed / 20;

    points.push(new Point(x, y, xSpeed, ySpeed));
  }

  ctx.fillStyle = "#051622";
  ctx.fillRect(0, 0, w, h);

  draw();
}

function draw() {
  ctx.globalCompositeOperation = "source-over";

  ctx.fillStyle = "#051622";
  ctx.fillRect(0, 0, w, h);

  ctx.lineWidth = lineWidth;

  var screenDelta = Math.sqrt(w + h) / 100;
  var useDistance = connectionDistance * screenDelta;

  ctx.globalCompositeOperation = "lighter";

  points.each(function (point) {
    points.each(function (connection) {
      var distanceX = Math.pow(connection.x - point.x, 2);
      var distanceY = Math.pow(connection.y - point.y, 2);
      var distance = Math.sqrt(distanceX + distanceY);

      if (distance <= useDistance) {
        var alpha = 1.2 - distance / useDistance;

        ctx.strokeStyle = "hsla(190,65%,20%, " + alpha + ")";

        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(connection.x, connection.y);
        ctx.stroke();
        ctx.closePath();
      }
    });
  });

  ctx.globalCompositeOperation = "source-over";

  points.each(function (point) {
    point.draw();
  });

  window.requestAnimationFrame(draw);
}

var Point = function (_x, _y, _xSpeed, _ySpeed) {
  this.x = _x;
  this.y = _y;
  this.xSpeed = _xSpeed;
  this.ySpeed = _ySpeed;

  var _this = this;

  this.draw = function () {
    var xNoise = Math.random() * randomSize - randomSize / 2;
    var yNoise = Math.random() * randomSize - randomSize / 2;

    _this.x += _this.xSpeed + xNoise;
    _this.y += _this.ySpeed + yNoise;

    if (_this.x < size || _this.x > w - size) {
      _this.xSpeed = -_this.xSpeed;
    }

    if (_this.y < size || _this.y > h - size) {
      _this.ySpeed = -_this.ySpeed;
    }

    if (_this.x < 0) {
      _this.x = 2;
    }

    if (_this.x > w) {
      _this.x = w - 2;
    }

    if (_this.y < 0) {
      _this.y = 2;
    }

    if (_this.y > h) {
      _this.y = h - 2;
    }

    ctx.beginPath();
    ctx.arc(_this.x, _this.y, size, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  };
};

// Faster than .forEach
Array.prototype.each = function (a) {
  var l = this.length;
  for (var i = 0; i < l; i++) a(this[i], i);
};

setTimeout(setup, 10);

//typeweiter
class TypeWriter {
  constructor(txtElement, words, wait = 3000) {
    this.txtElement = txtElement;
    this.words = words;
    this.txt = "";
    this.wordIndex = 0;
    this.wait = parseInt(wait, 10);
    this.type();
    this.isDeleting = false;
  }

  type() {
    // Current index of word
    const current = this.wordIndex % this.words.length;
    // Get full text of current word
    const fullTxt = this.words[current];

    // Check if deleting
    if (this.isDeleting) {
      // Remove char
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      // Add char
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    // Insert txt into element
    this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;

    // Initial Type Speed
    let typeSpeed = 300;

    if (this.isDeleting) {
      typeSpeed /= 2;
    }

    // If word is complete
    if (!this.isDeleting && this.txt === fullTxt) {
      // Make pause at end
      typeSpeed = this.wait;
      // Set delete to true
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === "") {
      this.isDeleting = false;
      // Move to next word
      this.wordIndex++;
      // Pause before start typing
      typeSpeed = 500;
    }

    setTimeout(() => this.type(), typeSpeed);
  }
}

// Init On DOM Load
document.addEventListener("DOMContentLoaded", init);

// Init App
function init() {
  const txtElement = document.querySelector(".txt-type");
  const words = JSON.parse(txtElement.getAttribute("data-words"));
  const wait = txtElement.getAttribute("data-wait");
  // Init TypeWriter
  new TypeWriter(txtElement, words, wait);
}

//timeline
const items = document.querySelectorAll("#timeline li");

const isInViewport = (el) => {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

const run = () =>
  items.forEach((item) => {
    if (isInViewport(item)) {
      item.classList.add("show");
    }
  });

// Events
window.addEventListener("load", run);
window.addEventListener("resize", run);
window.addEventListener("scroll", run);

//slideshow
let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides((slideIndex += n));
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides((slideIndex = n));
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
}

//mobilenavbar
const hamburger = document.querySelector(".hamburger");
const bar1 = document.querySelector(".bar1");
const bar2 = document.querySelector(".bar2");
const bar3 = document.querySelector(".bar3");
const mobileNav = document.querySelector(".mobileNav");

hamburger.addEventListener("click", () => {
  bar1.classList.toggle("animateBar1");
  bar2.classList.toggle("animateBar2");
  bar3.classList.toggle("animateBar3");
  mobileNav.classList.toggle("openDrawer");
});

const navbar = document.getElementById("navbar");
let scrolled = false;

window.onscroll = function () {
  if (window.pageYOffset > 100) {
    navbar.classList.remove("top");
    if (!scrolled) {
      navbar.style.transform = "translateY(-70px)";
    }
    setTimeout(function () {
      navbar.style.transform = "translateY(0)";
      scrolled = true;
    }, 200);
  } else {
    navbar.classList.add("top");
    scrolled = false;
  }
};

// Smooth Scrolling link
$("#navbar a, .btn").on("click", function (e) {
  if (this.hash !== "") {
    e.preventDefault();

    const hash = this.hash;

    $("html, body").animate(
      {
        scrollTop: $(hash).offset().top - 100,
      },
      800
    );
  }
});

$(".mobileNav a, .btn").on("click", function (e) {
  if (this.hash !== "") {
    e.preventDefault();

    const hash = this.hash;

    $("html, body").animate(
      {
        scrollTop: $(hash).offset().top - 100,
      },
      800
    );
  }
});

$(".viewproject a, .btn").on("click", function (e) {
  if (this.hash !== "") {
    e.preventDefault();

    const hash = this.hash;

    $("html, body").animate(
      {
        scrollTop: $(hash).offset().top - 100,
      },
      800
    );
  }
});
