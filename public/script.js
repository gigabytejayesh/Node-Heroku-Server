var tl = new TimelineMax({ repeat: -1, yoyo: true });
tl.fromTo(
    ".add-swing",
    1.5,
    { ease: "circ.inOut", y: 10 },
    { ease: "circ.inOut", y: -10 }
);

tl.fromTo(
    ".add-swing",
    1.5,
    { ease: "circ.inOut", y: -10 },
    { ease: "circ.inOut", y: 10 }
);

gsap.from(".u-text", { duration: 1, x: "-100%" });
gsap.from(".u-btn-1", {
    duration: 1,
    opacity: 0,
    delay: 1,
});
