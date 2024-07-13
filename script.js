document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  gsap.defaults({
    ease: "expo.out",
    duration: 1.5,
  });

  // LENIS SMOOTH SCROLL
  let lenis;
  if (Webflow.env("editor") === undefined) {
    lenis = new Lenis({
      duration: 1.3,
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }
  $("[data-lenis-start]").on("click", function () {
    lenis.start();
  });
  $("[data-lenis-stop]").on("click", function () {
    lenis.stop();
  });
  $("[data-lenis-toggle]").on("click", function () {
    $(this).toggleClass("stop-scroll");
    if ($(this).hasClass("stop-scroll")) {
      lenis.stop();
    } else {
      lenis.start();
    }
  });

  function initLoader() {
    gsap.set("[data-visibility]", { visibility: "visible" });

    let heroTitleTexts = document.querySelectorAll("[data-home-title]");
    let heroBackground = document.querySelector("[data-home-hero-bg]");
    let heroUIElts = document.querySelectorAll("[data-ui]");
    let dividers = document.querySelectorAll("[data-divider]");
    let heroParagraph = document.querySelector("[data-hero-paragraph]");
    let heroProjects = document.querySelectorAll("[data-visual-item]");

    // Split text into lines
    let splitType = new SplitType(heroParagraph, {
      types: "lines",
      tagName: "span",
    });

    // Wrap each line in a div with overflow hidden
    let heroParagraphLines = heroParagraph.querySelectorAll(".line");
    heroParagraphLines.forEach(function (line) {
      let wrapper = document.createElement("div");
      wrapper.classList.add("u-line-wrap");
      line.parentNode.insertBefore(wrapper, line);
      wrapper.appendChild(line);
    });

    let loadTimeline = gsap.timeline();

    loadTimeline.set(heroBackground, { scaleX: 0.025, scaleY: 0 });

    loadTimeline.from(
      heroTitleTexts,
      {
        yPercent: 150,
        stagger: 0.1,
      },
      0.2,
    );

    loadTimeline.to(heroBackground, { scaleY: 0.025 }, "<1");
    loadTimeline.to(
      heroBackground,
      {
        scale: 1,
        ease: "expo.inOut",
      },
      ">-0.5",
    );

    loadTimeline.from(dividers, { scaleX: 0 }, ">-0.6");
    loadTimeline.from(heroUIElts, { opacity: 0, yPercent: 70 }, "<0.1");
    loadTimeline.from(heroParagraphLines, { yPercent: 150, stagger: 0.1 }, "<");

    loadTimeline.from(
      heroProjects,
      { opacity: 0, yPercent: -40, stagger: 0.05 },
      "<0.05",
    );
  }
  initLoader();

  function initAboutLoader() {
    let aboutBg = document.querySelector("[data-about-hero-bg]");

    let aboutLoadTimeline = gsap.timeline();

    aboutLoadTimeline.set(aboutBg, {
      scaleX: 0,
      scaleY: 0.001,
      transformOrigin: "0% 0%",
    });

    aboutLoadTimeline.to(aboutBg, { scaleX: 1 });
    aboutLoadTimeline.to(
      aboutBg,
      {
        scaleY: 1,
        ease: "expo.inOut",
      },
      ">-0.25",
    );
  }

  initAboutLoader();

  function initTransition() {
    let heroTitleTexts = document.querySelectorAll("[data-home-title]");
    let heroBackground = document.querySelector("[data-transition-bg]");
    let heroUI = document.querySelectorAll("[data-ui]");
    let dividers = document.querySelectorAll("[data-divider]");
    let heroParagraph = document.querySelector("[data-hero-paragraph]");
    let heroElts = [heroUI, dividers, heroParagraph];
    let heroProjects = document.querySelectorAll("[data-visual-item]");

    // link click
    $("a:not(.excluded-class)").on("click", function (e) {
      let currentUrl = $(this).attr("href");
      if (
        $(this).prop("hostname") === window.location.host &&
        !currentUrl.includes("#") &&
        $(this).attr("target") !== "_blank"
      ) {
        e.preventDefault();
        lenis.stop();
        let transitionTimeline = gsap.timeline({
          onComplete: () => (window.location.href = currentUrl),
        });

        transitionTimeline.to(heroProjects, {
          yPercent: -50,
          opacity: 0,
          stagger: { amount: 0.75 },
        });

        transitionTimeline.to(
          heroElts,
          {
            opacity: 0,
            duration: 0.5,
          },
          "<0.1",
        );

        transitionTimeline.to(
          heroBackground,
          {
            scaleY: 0,
            transformOrigin: "50% 0%",
            ease: "expo.inOut",
            duration: 0.75,
          },
          "<",
        );

        transitionTimeline.to(
          heroTitleTexts,
          {
            yPercent: -100,
            ease: "expo.In",
            duration: 0.75,
            stagger: 0.075,
          },
          "<0.5",
        );
      }
    });
    // On Back Button Tap
    window.onpageshow = function (event) {
      if (event.persisted) window.location.reload();
    };
  }
  initTransition();
});
