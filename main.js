(function () {
  var toggle = document.querySelector("[data-nav-toggle]");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    function setOpen(open) {
      document.body.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    }

    toggle.addEventListener("click", function () {
      setOpen(!document.body.classList.contains("nav-open"));
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setOpen(false);
      });
    });
  }

  document.querySelectorAll("[data-carousel]").forEach(function (root) {
    var track = root.querySelector("[data-carousel-track]");
    var slides = root.querySelectorAll("[data-carousel-slide]");
    var prevBtn = root.querySelector("[data-carousel-prev]");
    var nextBtn = root.querySelector("[data-carousel-next]");
    var dotsRoot = root.querySelector("[data-carousel-dots]");
    var live = root.querySelector("[data-carousel-live]");
    if (!track || !slides.length || !prevBtn || !nextBtn) return;

    var n = slides.length;
    var index = 0;
    var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      track.style.transition = "none";
    }

    function captionFor(i) {
      var cap = slides[i].querySelector(".carousel__caption");
      return cap ? cap.innerText.replace(/\s+/g, " ").trim() : "";
    }

    function go(to) {
      index = ((to % n) + n) % n;
      var pct = (100 / n) * index;
      track.style.transform = "translateX(-" + pct + "%)";
      slides.forEach(function (slide, i) {
        slide.setAttribute("aria-hidden", i === index ? "false" : "true");
      });
      if (dotsRoot) {
        var dots = dotsRoot.querySelectorAll("button");
        dots.forEach(function (dot, i) {
          dot.setAttribute("aria-current", i === index ? "true" : "false");
        });
      }
      if (live) {
        live.textContent =
          "Slide " + (index + 1) + " of " + n + ": " + captionFor(index);
      }
    }

    if (dotsRoot) {
      dotsRoot.innerHTML = "";
      for (var d = 0; d < n; d++) {
        (function (i) {
          var b = document.createElement("button");
          b.type = "button";
          b.setAttribute("aria-label", "Go to slide " + (i + 1));
          b.addEventListener("click", function () {
            go(i);
          });
          dotsRoot.appendChild(b);
        })(d);
      }
    }

    prevBtn.addEventListener("click", function () {
      go(index - 1);
    });
    nextBtn.addEventListener("click", function () {
      go(index + 1);
    });

    root.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(index - 1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        go(index + 1);
      }
    });

    go(0);
  });
})();
