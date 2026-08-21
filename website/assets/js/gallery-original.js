const images = [
    {
        image: "assets/images/gallery/sample01.jpg",
        title: "Morning Walleye",
        description: "Early morning fishing from shore."
    },
    {
        image: "assets/images/gallery/sample02.jpg",
        title: "Sunset Casting for Freshwater Drum",
        description: "An evening worth remembering."
    },
    {
        image: "assets/images/gallery/sample03.jpg",
        title: "Channel Catfish",
        description: "A great catch along the shoreline."
    }
];

let current = 0;

const img = document.getElementById("gallery-image");
const title = document.getElementById("gallery-title");
const description = document.getElementById("gallery-description");
const thumbnailContainer =
    document.getElementById("thumbnail-container");

function loadImage(index) {

    current = index;

    img.classList.add("fade");

    setTimeout(() => {

        img.src = images[index].image;
        img.alt = images[index].title;

        title.textContent = images[index].title;
        description.textContent = images[index].description;

        updateThumbnails();

        img.classList.remove("fade");

    }, 180);
}


/* ==========================================
   Thumbnails
   ========================================== */

function createThumbnails() {

    thumbnailContainer.innerHTML = "";

    images.forEach((item, index) => {

        const thumbnail = document.createElement("img");

        thumbnail.src = item.image;
        thumbnail.alt = `View ${item.title}`;
        thumbnail.loading = "lazy";
        thumbnail.dataset.index = index;

        thumbnail.addEventListener("click", () => {
            loadImage(index);
        });

        thumbnailContainer.appendChild(thumbnail);

    });

    updateThumbnails();
}


function updateThumbnails() {

    const thumbnails =
        thumbnailContainer.querySelectorAll("img");

    thumbnails.forEach((thumbnail, index) => {

        thumbnail.classList.toggle(
            "active",
            index === current
        );

    });

}


/* ==========================================
   Navigation
   ========================================== */

function nextImage() {

    stopSlideshow();

    current++;

    if (current >= images.length) {
        current = 0;
    }

    loadImage(current);
}


function previousImage() {

    stopSlideshow();

    current--;

    if (current < 0) {
        current = images.length - 1;
    }

    loadImage(current);
}

document.querySelector(".next")
    .addEventListener("click", nextImage);

document.querySelector(".prev")
    .addEventListener("click", previousImage);


/* ==========================================
   Keyboard Navigation
   ========================================== */

document.addEventListener("keydown", (event) => {

    if (event.key === "ArrowRight") {
        nextImage();
    }

    if (event.key === "ArrowLeft") {
        previousImage();
    }

});


/* ==========================================
   Touch / Swipe Navigation
   ========================================== */

let touchStartX = 0;
let touchEndX = 0;

img.addEventListener("touchstart", (event) => {

    touchStartX = event.changedTouches[0].screenX;

}, { passive: true });


img.addEventListener("touchend", (event) => {

    touchEndX = event.changedTouches[0].screenX;

    handleSwipe();

}, { passive: true });


function handleSwipe() {

    const swipeDistance =
        touchEndX - touchStartX;

    const minimumSwipe = 50;

    if (Math.abs(swipeDistance) < minimumSwipe) {
        return;
    }

    if (swipeDistance < 0) {
        nextImage();
    } else {
        previousImage();
    }

}


/* ==========================================
   Initialize
   ========================================== */

createThumbnails();
loadImage(current);

/* ==========================================
   Fullscreen
   ========================================== */

const galleryViewer =
    document.querySelector(".gallery-viewer");

const fullscreenButton =
    document.querySelector(".gallery-fullscreen");


fullscreenButton.addEventListener("click", async () => {

    try {

        if (!document.fullscreenElement) {

            await galleryViewer.requestFullscreen();

        } else {

            await document.exitFullscreen();

        }

    } catch (error) {

        console.error(
            "Fullscreen could not be activated:",
            error
        );

    }

});


document.addEventListener("fullscreenchange", () => {

    if (document.fullscreenElement) {

        fullscreenButton.textContent = "⛶";
        fullscreenButton.setAttribute(
            "aria-label",
            "Exit fullscreen"
        );
        fullscreenButton.title = "Exit fullscreen";

    } else {

        fullscreenButton.textContent = "⛶";
        fullscreenButton.setAttribute(
            "aria-label",
            "Enter fullscreen"
        );
        fullscreenButton.title = "Fullscreen";

    }

});


/* ==========================================
   Slideshow
   ========================================== */

const slideshowButton =
    document.getElementById("slideshow-toggle");

let slideshowTimer = null;

const slideshowDelay = 5000;


function startSlideshow() {

    if (slideshowTimer !== null) {
        return;
    }

   slideshowTimer = setInterval(() => {

    current++;

    if (current >= images.length) {
        current = 0;
    }

    loadImage(current);

}, slideshowDelay);

    slideshowButton.textContent =
        "⏸ Pause Slideshow";

    slideshowButton.setAttribute(
        "aria-pressed",
        "true"
    );

}


function stopSlideshow() {

    if (slideshowTimer !== null) {

        clearInterval(slideshowTimer);

        slideshowTimer = null;

    }

    slideshowButton.textContent =
        "▶ Start Slideshow";

    slideshowButton.setAttribute(
        "aria-pressed",
        "false"
    );

}


function toggleSlideshow() {

    if (slideshowTimer === null) {

        startSlideshow();

    } else {

        stopSlideshow();

    }

}


slideshowButton.addEventListener(
    "click",
    toggleSlideshow
);

