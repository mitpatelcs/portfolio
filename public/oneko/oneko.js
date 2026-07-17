/* eslint-disable @typescript-eslint/no-unused-expressions */
(async function oneko() {
  const nekoEl = document.createElement("div");
  let nekoPosX = 32,
    nekoPosY = 32,
    mousePosX = 0,
    mousePosY = 0,
    frameCount = 0,
    idleTime = 0,
    idleAnimation = null,
    idleAnimationFrame = 0,
    forceSleep = false,
    grabbing = false,
    grabStop = true,
    nudge = false,
    kuroNeko = false,
    variant = "classic",
    autoSleepActive = false;

  function parseLocalStorage(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(`oneko:${key}`));
      return typeof value === typeof fallback ? value : fallback;
    } catch {
      return fallback;
    }
  }

  function shouldAutoSleep(path) {
    const autoSleepRoutes = ["/contact", "/blog"];
    return autoSleepRoutes.some((route) => path.startsWith(route));
  }

  function setAutoSleep(path) {
    currentPath = path;
    const shouldSleep = shouldAutoSleep(path);

    if (shouldSleep && !autoSleepActive) {
      // Activate auto-sleep
      autoSleepActive = true;
      forceSleep = true;
      mousePosX = 50;
      mousePosY = 50;
    } else if (!shouldSleep && autoSleepActive) {
      // Deactivate auto-sleep
      autoSleepActive = false;
      forceSleep = false;
      resetIdleAnimation();
    }
  }

  // Obstacles: elements with [data-oneko-dodge] or id="oneko-dodge" – cat will go around, never on top
  const DODGE_PADDING = 20;

  function getDodgeRects() {
    const els = document.querySelectorAll("[data-oneko-dodge], #oneko-dodge");
    const rects = [];
    for (let i = 0; i < els.length; i++) {
      const r = els[i].getBoundingClientRect();
      rects.push({
        left: r.left - DODGE_PADDING,
        top: r.top - DODGE_PADDING,
        right: r.right + DODGE_PADDING,
        bottom: r.bottom + DODGE_PADDING,
      });
    }
    return rects;
  }

  function pointInRect(px, py, r) {
    return px >= r.left && px <= r.right && py >= r.top && py <= r.bottom;
  }

  function nearestPointOnRectBoundary(px, py, r) {
    const closestX = Math.max(r.left, Math.min(r.right, px));
    const closestY = Math.max(r.top, Math.min(r.bottom, py));
    const dLeft = px - r.left;
    const dRight = r.right - px;
    const dTop = py - r.top;
    const dBottom = r.bottom - py;
    const dMin = Math.min(dLeft, dRight, dTop, dBottom);
    if (dMin === dLeft) return { x: r.left, y: closestY };
    if (dMin === dRight) return { x: r.right, y: closestY };
    if (dMin === dTop) return { x: closestX, y: r.top };
    return { x: closestX, y: r.bottom };
  }

  const nekoSpeed = 10,
    variants = [
      ["classic", "Classic"],
      ["dog", "Dog"],
      ["tora", "Tora"],
      ["maia", "Maia (maia.crimew.gay)"],
      ["vaporwave", "Vaporwave (nya.rest)"],
      ["ramxcodes", "RamxCodes"],
    ],
    spriteSets = {
      idle: [[-3, -3]],
      alert: [[-7, -3]],
      scratchSelf: [
        [-5, 0],
        [-6, 0],
        [-7, 0],
      ],
      scratchWallN: [
        [0, 0],
        [0, -1],
      ],
      scratchWallS: [
        [-7, -1],
        [-6, -2],
      ],
      scratchWallE: [
        [-2, -2],
        [-2, -3],
      ],
      scratchWallW: [
        [-4, 0],
        [-4, -1],
      ],
      tired: [[-3, -2]],
      sleeping: [
        [-2, 0],
        [-2, -1],
      ],
      N: [
        [-1, -2],
        [-1, -3],
      ],
      NE: [
        [0, -2],
        [0, -3],
      ],
      E: [
        [-3, 0],
        [-3, -1],
      ],
      SE: [
        [-5, -1],
        [-5, -2],
      ],
      S: [
        [-6, -3],
        [-7, -2],
      ],
      SW: [
        [-5, -3],
        [-6, -1],
      ],
      W: [
        [-4, -2],
        [-4, -3],
      ],
      NW: [
        [-1, 0],
        [-1, -1],
      ],
    };

  function sleep() {
    // Prevent manual sleep toggle when auto-sleep is active
    if (autoSleepActive) {
      return;
    }

    forceSleep = !forceSleep;
    nudge = false;
    localStorage.setItem("oneko:forceSleep", forceSleep);
    if (!forceSleep) {
      resetIdleAnimation();
      return;
    }

    // If Full App Display is on, sleep on its progress bar instead
    const fullAppDisplay = document.getElementById("fad-progress");
    if (fullAppDisplay) {
      mousePosX = fullAppDisplay.getBoundingClientRect().right - 16;
      mousePosY = fullAppDisplay.getBoundingClientRect().top - 12;
      return;
    }

    // Get the far right and top of the progress bar
    const progressBar = document.querySelector(
      ".main-nowPlayingBar-center .playback-progressbar",
    );
    const progressBarRight = progressBar.getBoundingClientRect().right;
    const progressBarTop = progressBar.getBoundingClientRect().top;
    const progressBarBottom = progressBar.getBoundingClientRect().bottom;

    // Make the cat sleep on the progress bar
    mousePosX = progressBarRight - 16;
    mousePosY = progressBarTop - 8;

    // Get the position of the remaining time
    const remainingTime = document.querySelector(
      ".main-playbackBarRemainingTime-container",
    );
    const remainingTimeLeft = remainingTime.getBoundingClientRect().left;
    const remainingTimeBottom = remainingTime.getBoundingClientRect().bottom;
    const remainingTimeTop = remainingTime.getBoundingClientRect().top;

    // Get the position of elapsed time
    const elapsedTime = document.querySelector(
      ".playback-bar__progress-time-elapsed",
    );
    const elapsedTimeRight = elapsedTime.getBoundingClientRect().right;
    const elapsedTimeLeft = elapsedTime.getBoundingClientRect().left;

    // If the remaining time is on top right of the progress bar, make the cat sleep to the a little bit to the left of the remaining time
    // Theme compatibility
    if (
      remainingTimeLeft < progressBarRight &&
      remainingTimeTop < progressBarBottom &&
      progressBarTop - remainingTimeBottom < 32
    ) {
      mousePosX = remainingTimeLeft - 16;

      // Move the cat to the left of elapsed time if it is too close to the remaining time (Nord theme)
      if (remainingTimeLeft - elapsedTimeRight < 32) {
        mousePosX = elapsedTimeLeft - 16;
      }
    }
  }

  function create() {
    // Pinned to the classic Oneko cat (no random mascot rotation). An explicit
    // stored variant is still honored if valid, but we never randomize — the
    // default is always the classic cat sprite.
    variant = "classic";
    const storedVariantRaw = localStorage.getItem("oneko:variant");
    if (storedVariantRaw) {
      try {
        const storedVariant = JSON.parse(storedVariantRaw);
        if (variants.some((v) => v[0] === storedVariant)) variant = storedVariant;
      } catch {
        variant = "classic";
      }
    }
    kuroNeko = parseLocalStorage("kuroneko", false);

    nekoEl.id = "oneko";
    nekoEl.style.width = "32px";
    nekoEl.style.height = "32px";
    nekoEl.style.position = "fixed";
    // nekoEl.style.pointerEvents = "none";
    nekoEl.style.backgroundImage = `url('/oneko/oneko-${variant}.gif')`;
    nekoEl.style.imageRendering = "pixelated";
    nekoEl.style.left = `${nekoPosX - 16}px`;
    nekoEl.style.top = `${nekoPosY - 16}px`;
    nekoEl.style.filter = kuroNeko ? "invert(100%)" : "none";
    nekoEl.style.zIndex = "99999";

    document.body.appendChild(nekoEl);

    window.addEventListener("mousemove", (e) => {
      if (forceSleep) return;

      mousePosX = e.clientX;
      mousePosY = e.clientY;
    });

    window.addEventListener("resize", () => {
      if (forceSleep) {
        forceSleep = false;
        sleep();
      }
    });

    // Handle dragging of the cat
    nekoEl.addEventListener("mousedown", (e) => {
      if (e.button !== 0) return;
      window.dispatchEvent(new CustomEvent("oneko:click"));
      grabbing = true;
      let startX = e.clientX;
      let startY = e.clientY;
      let startNekoX = nekoPosX;
      let startNekoY = nekoPosY;
      let grabInterval;

      const mousemove = (e) => {
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);

        // Scratch in the opposite direction of the drag
        if (absDeltaX > absDeltaY && absDeltaX > 10) {
          setSprite(deltaX > 0 ? "scratchWallW" : "scratchWallE", frameCount);
        } else if (absDeltaY > absDeltaX && absDeltaY > 10) {
          setSprite(deltaY > 0 ? "scratchWallN" : "scratchWallS", frameCount);
        }

        if (
          grabStop ||
          absDeltaX > 10 ||
          absDeltaY > 10 ||
          Math.sqrt(deltaX ** 2 + deltaY ** 2) > 10
        ) {
          grabStop = false;
          clearTimeout(grabInterval);
          grabInterval = setTimeout(() => {
            grabStop = true;
            nudge = false;
            startX = e.clientX;
            startY = e.clientY;
            startNekoX = nekoPosX;
            startNekoY = nekoPosY;
          }, 150);
        }

        nekoPosX = startNekoX + e.clientX - startX;
        nekoPosY = startNekoY + e.clientY - startY;
        const dragRects = getDodgeRects();
        for (let i = 0; i < dragRects.length; i++) {
          if (pointInRect(nekoPosX, nekoPosY, dragRects[i])) {
            const p = nearestPointOnRectBoundary(
              nekoPosX,
              nekoPosY,
              dragRects[i],
            );
            nekoPosX = p.x;
            nekoPosY = p.y;
          }
        }
        nekoEl.style.left = `${nekoPosX - 16}px`;
        nekoEl.style.top = `${nekoPosY - 16}px`;
      };

      const mouseup = () => {
        grabbing = false;
        nudge = true;
        resetIdleAnimation();
        window.removeEventListener("mousemove", mousemove);
        window.removeEventListener("mouseup", mouseup);
      };

      window.addEventListener("mousemove", mousemove);
      window.addEventListener("mouseup", mouseup);
    });

    // Right-click opens React picker dialog (handled in app via custom event)
    nekoEl.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      window.dispatchEvent(new CustomEvent("oneko:right-click"));
      window.dispatchEvent(new CustomEvent("oneko:open-picker"));
    });

    // Long-press on mobile opens the picker as well
    let longPressTimer = null;
    let longPressTriggered = false;
    let touchStartX = 0;
    let touchStartY = 0;
    const LONG_PRESS_MS = 500;

    const clearLongPress = () => {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
      }
    };

    nekoEl.addEventListener(
      "touchstart",
      (e) => {
        if (e.touches && e.touches.length === 1) {
          longPressTriggered = false;
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
          clearLongPress();
          longPressTimer = setTimeout(() => {
            longPressTriggered = true;
            window.dispatchEvent(new CustomEvent("oneko:open-picker"));
          }, LONG_PRESS_MS);
        }
      },
      { passive: true },
    );

    nekoEl.addEventListener(
      "touchmove",
      (e) => {
        if (!e.touches || e.touches.length !== 1) return;
        const dx = Math.abs(e.touches[0].clientX - touchStartX);
        const dy = Math.abs(e.touches[0].clientY - touchStartY);
        if (dx > 10 || dy > 10) {
          clearLongPress();
        }
      },
      { passive: true },
    );

    const endTouch = (e) => {
      if (longPressTriggered) {
        e.preventDefault?.();
      }
      clearLongPress();
    };

    nekoEl.addEventListener("touchend", endTouch, { passive: false });
    nekoEl.addEventListener("touchcancel", endTouch, { passive: true });

    nekoEl.addEventListener("dblclick", sleep);

    // Listen for route changes from Next.js
    window.addEventListener("oneko:route-change", (e) => {
      setAutoSleep(e.detail);
    });

    // Set initial auto-sleep state based on current path
    if (typeof window !== "undefined" && window.location) {
      setAutoSleep(window.location.pathname);
    }

    window.onekoInterval = setInterval(frame, 100);
  }

  function getSprite(name, frame) {
    return spriteSets[name][frame % spriteSets[name].length];
  }

  function setSprite(name, frame) {
    const sprite = getSprite(name, frame);
    nekoEl.style.backgroundPosition = `${sprite[0] * 32}px ${sprite[1] * 32}px`;
  }

  function resetIdleAnimation() {
    idleAnimation = null;
    idleAnimationFrame = 0;
  }

  function idle() {
    idleTime += 1;

    // every ~ 20 seconds
    if (
      idleTime > 10 &&
      Math.floor(Math.random() * 200) == 0 &&
      idleAnimation == null
    ) {
      let avalibleIdleAnimations = ["sleeping", "scratchSelf"];
      if (nekoPosX < 32) {
        avalibleIdleAnimations.push("scratchWallW");
      }
      if (nekoPosY < 32) {
        avalibleIdleAnimations.push("scratchWallN");
      }
      if (nekoPosX > window.innerWidth - 32) {
        avalibleIdleAnimations.push("scratchWallE");
      }
      if (nekoPosY > window.innerHeight - 32) {
        avalibleIdleAnimations.push("scratchWallS");
      }
      idleAnimation =
        avalibleIdleAnimations[
          Math.floor(Math.random() * avalibleIdleAnimations.length)
        ];
    }

    if (forceSleep) {
      avalibleIdleAnimations = ["sleeping"];
      idleAnimation = "sleeping";
    }

    switch (idleAnimation) {
      case "sleeping":
        if (idleAnimationFrame < 8 && nudge && forceSleep) {
          setSprite("idle", 0);
          break;
        } else if (nudge) {
          nudge = false;
          resetIdleAnimation();
        }
        if (idleAnimationFrame < 8) {
          setSprite("tired", 0);
          break;
        }
        setSprite("sleeping", Math.floor(idleAnimationFrame / 4));
        if (idleAnimationFrame > 192 && !forceSleep) {
          resetIdleAnimation();
        }
        break;
      case "scratchWallN":
      case "scratchWallS":
      case "scratchWallE":
      case "scratchWallW":
      case "scratchSelf":
        setSprite(idleAnimation, idleAnimationFrame);
        if (idleAnimationFrame > 9) {
          resetIdleAnimation();
        }
        break;
      default:
        setSprite("idle", 0);
        return;
    }
    idleAnimationFrame += 1;
  }

  function frame() {
    frameCount += 1;

    if (grabbing) {
      grabStop && setSprite("alert", 0);
      return;
    }

    const diffX = nekoPosX - mousePosX;
    const diffY = nekoPosY - mousePosY;
    const distance = Math.sqrt(diffX ** 2 + diffY ** 2);

    // Cat has to sleep on top of the progress bar
    if (
      forceSleep &&
      Math.abs(diffY) < nekoSpeed &&
      Math.abs(diffX) < nekoSpeed
    ) {
      // Make the cat sleep exactly on the top of the progress bar
      nekoPosX = mousePosX;
      nekoPosY = mousePosY;
      nekoEl.style.left = `${nekoPosX - 16}px`;
      nekoEl.style.top = `${nekoPosY - 16}px`;

      idle();
      return;
    }

    // Dodge obstacles: effective target is nearest point on boundary if mouse is inside an obstacle
    const dodgeRects = getDodgeRects();
    let targetX = mousePosX;
    let targetY = mousePosY;
    for (let i = 0; i < dodgeRects.length; i++) {
      if (pointInRect(targetX, targetY, dodgeRects[i])) {
        const p = nearestPointOnRectBoundary(targetX, targetY, dodgeRects[i]);
        targetX = p.x;
        targetY = p.y;
        break;
      }
    }
    const effDiffX = nekoPosX - targetX;
    const effDiffY = nekoPosY - targetY;
    const effDistance = Math.sqrt(effDiffX * effDiffX + effDiffY * effDiffY);
    const useDist = effDistance > 1e-6 ? effDistance : 1;

    if ((effDistance < nekoSpeed || effDistance < 48) && !forceSleep) {
      idle();
      return;
    }

    idleAnimation = null;
    idleAnimationFrame = 0;

    if (idleTime > 1) {
      setSprite("alert", 0);
      // count down after being alerted before moving
      idleTime = Math.min(idleTime, 7);
      idleTime -= 1;
      return;
    }

    direction = effDiffY / useDist > 0.5 ? "N" : "";
    direction += effDiffY / useDist < -0.5 ? "S" : "";
    direction += effDiffX / useDist > 0.5 ? "W" : "";
    direction += effDiffX / useDist < -0.5 ? "E" : "";
    setSprite(direction, frameCount);

    nekoPosX -= (effDiffX / useDist) * nekoSpeed;
    nekoPosY -= (effDiffY / useDist) * nekoSpeed;

    for (let i = 0; i < dodgeRects.length; i++) {
      if (pointInRect(nekoPosX, nekoPosY, dodgeRects[i])) {
        const p = nearestPointOnRectBoundary(nekoPosX, nekoPosY, dodgeRects[i]);
        nekoPosX = p.x;
        nekoPosY = p.y;
      }
    }

    nekoPosX = Math.min(Math.max(16, nekoPosX), window.innerWidth - 16);
    nekoPosY = Math.min(Math.max(16, nekoPosY), window.innerHeight - 16);

    nekoEl.style.left = `${nekoPosX - 16}px`;
    nekoEl.style.top = `${nekoPosY - 16}px`;
  }

  create();

  // getRandomSprite no longer used (picker handled in React)

  // setVariant no longer used (selection handled via custom event from React)

  // Listen for variant selection from React dialog
  window.addEventListener("oneko:set-variant", (e) => {
    try {
      const detail = e.detail;
      if (typeof detail === "string") {
        variant = detail;
        localStorage.setItem("oneko:variant", `"${variant}"`);
        nekoEl.style.backgroundImage = `url('/oneko/oneko-${variant}.gif')`;
      }
    } catch {}
  });

  // Listen for toggle sleep command
  window.addEventListener("oneko:toggle-sleep", () => {
    if (forceSleep) {
      forceSleep = false;
      autoSleepActive = false;
      resetIdleAnimation();
      window.dispatchEvent(new CustomEvent("oneko:awake-toast"));
    } else {
      forceSleep = true;
      mousePosX = nekoPosX;
      mousePosY = nekoPosY;
      window.dispatchEvent(new CustomEvent("oneko:sleep-toast"));
    }
  });

  window.addEventListener("oneko:change-variant", () => {
    const currentIndex = variants.findIndex((v) => v[0] === variant);
    const nextIndex = (currentIndex + 1) % variants.length;
    variant = variants[nextIndex][0];
    localStorage.setItem("oneko:variant", `"${variant}"`);
    nekoEl.style.backgroundImage = `url('/oneko/oneko-${variant}.gif')`;
  });

  // Legacy picker removed; handled via React dialog in the app

  if (parseLocalStorage("forceSleep", false)) {
    while (
      !document.querySelector(
        ".main-nowPlayingBar-center .playback-progressbar",
      )
    ) {
      await new Promise((r) => setTimeout(r, 100));
    }
    sleep();
  }
})();
