const cursorGlow = document.getElementById("cursor-glow");
const buttonZone = document.getElementById("button-zone");
const noButton = document.getElementById("no-btn");
const yesButton = document.getElementById("yes-btn");
const celebration = document.getElementById("celebration");
const music = document.getElementById("bg-music");

let lastHeartTime = 0;

const randomBetween = (min, max) => Math.random() * (max - min) + min;

const moveNoButton = () => {
  const zoneRect = buttonZone.getBoundingClientRect();
  const buttonRect = noButton.getBoundingClientRect();

  const maxX = zoneRect.width - buttonRect.width - 12;
  const maxY = zoneRect.height - buttonRect.height - 12;

  const nextX = randomBetween(0, Math.max(maxX, 0));
  const nextY = randomBetween(0, Math.max(maxY, 0));

  noButton.style.transform = `translate(${nextX}px, ${nextY}px)`;
};

const createHeart = (x, y) => {
  const heart = document.createElement("span");
  heart.className = "floating-heart";
  heart.textContent = ["💖", "💘", "💝", "💗", "💕"][
    Math.floor(randomBetween(0, 5))
  ];
  heart.style.left = `${x}px`;
  heart.style.top = `${y}px`;
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 1200);
};

const handleMouseMove = (event) => {
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;

  if (performance.now() - lastHeartTime > 120) {
    createHeart(event.clientX, event.clientY);
    lastHeartTime = performance.now();
  }
};

const checkNoButtonDistance = (event) => {
  if (noButton.classList.contains("moving")) {
    return;
  }

  const rect = noButton.getBoundingClientRect();
  const distanceX = Math.abs(event.clientX - (rect.left + rect.width / 2));
  const distanceY = Math.abs(event.clientY - (rect.top + rect.height / 2));

  if (distanceX < 90 && distanceY < 60) {
    moveNoButton();
  }
};

const showCelebration = () => {
  celebration.style.display = "block";
  celebration.scrollIntoView({ behavior: "smooth", block: "center" });

  if (music.paused) {
    music.volume = 0.4;
    music.play().catch(() => {
      // Autoplay can be blocked; the user already clicked YES so try again on interaction.
    });
  }
};

window.addEventListener("mousemove", (event) => {
  handleMouseMove(event);
  checkNoButtonDistance(event);
});

noButton.addEventListener("mouseenter", moveNoButton);
noButton.addEventListener("click", moveNoButton);
noButton.addEventListener("transitionstart", () => {
  noButton.classList.add("moving");
});
noButton.addEventListener("transitionend", () => {
  noButton.classList.remove("moving");
});

yesButton.addEventListener("click", showCelebration);

window.addEventListener("load", () => {
  moveNoButton();
  document.body.classList.add("ready");
});
