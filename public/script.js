gsap.from(".u-text", { duration: 1, x: "-100%" });

var tl = new TimelineMax({ repeat: -1, yoyo: true });
tl.fromTo(
    ".u-image-1",
    1,
    { ease: "circ.inOut", y: 10 },
    { ease: "circ.inOut", y: -10 }
);

tl.fromTo(
    ".u-image-1",
    1,
    { ease: "circ.inOut", y: -10 },
    { ease: "circ.inOut", y: 10 }
);
