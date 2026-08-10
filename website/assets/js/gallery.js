let images = [];

let current = 0;

let slideshowTimer = null;

const slideshowDelay = 5000;

const img = document.getElementById("gallery-image");

const title = document.getElementById("gallery-title");

const description =
    document.getElementById("gallery-description");

const details =
    document.getElementById("gallery-details");
	
const thumbnailContainer =
    document.getElementById("thumbnail-container");

const galleryViewer =
    document.querySelector(".gallery-viewer");

const fullscreenButton =
    document.querySelector(".gallery-fullscreen");

const slideshowButton =
    document.getElementById("slideshow-toggle");


/* ==========================================
   Load Gallery Data
   ========================================== */

async function loadGallery() {

    try {

        const response =
            await fetch("assets/data/gallery.json");

        if (!response.ok) {
            throw new Error(
                `Gallery data could not be loaded (${response.status})`
            );
        }

        images = await response.json();

        if (!Array.isArray(images) || images.length === 0) {

            throw new Error(
                "Gallery data contains no photographs."
            );

        }

        createThumbnails();

        loadImage(0);

    } catch (error) {

        console.error(error);

        showGalleryError();

    }

}


/* ==========================================
   Error Handling
   ========================================== */

function showGalleryError() {

    const gallery =
        document.querySelector(".gallery");

    gallery.innerHTML = `
        <div class="gallery-error">
            <h2>Gallery temporarily unavailable</h2>
            <p>
                We couldn't load the photographs.
                Please try again later.
            </p>
        </div>
    `;

}


/* ==========================================
   Load Image
   ========================================== */

function loadImage(index) {

    if (!images.length) {
        return;
    }

    current = index;

    img.classList.add("fade");

    setTimeout(() => {

        const photo = images[index];

        img.src = photo.image;

        img.alt =
            photo.title ||
            "ShoreFishing.net photograph";

        title.textContent =
            photo.title || "";

        description.textContent =
            photo.description || "";

        updatePhotoDetails(photo);

        updateThumbnails();

        img.classList.remove("fade");

    }, 180);

}

function updatePhotoDetails(photo) {

    details.innerHTML = "";

    const fields = [

        {
            icon: "📍",
            label: "Location",
            value: photo.location
        },

        {
            icon: "🎣",
            label: "Species",
            value: photo.species
        },

        {
            icon: "📅",
            label: "Date",
            value: formatPhotoDate(photo.date)
        },

        {
            icon: "📷",
            label: "Photographer",
            value: photo.photographer
        }

    ];

    fields.forEach(field => {

        if (!field.value) {
            return;
        }

        const item =
            document.createElement("span");

        item.className =
            "gallery-detail";

        item.innerHTML = `
            <span aria-hidden="true">${field.icon}</span>
            <strong>${field.label}:</strong>
            <span>${escapeHTML(field.value)}</span>
        `;

        details.appendChild(item);

    });

}

function formatPhotoDate(date) {

    if (!date) {
        return "";
    }

    const parsedDate =
        new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsedDate.getTime())) {
        return date;
    }

    return parsedDate.toLocaleDateString(
        undefined,
        {
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    );

}

function escapeHTML(value) {

    const element =
        document.createElement("div");

    element.textContent = value;

    return element.innerHTML;

}

/* ==========================================
   Create Thumbnails
   ========================================== */

function createThumbnails() {

    thumbnailContainer.innerHTML = "";

    images.forEach((photo, index) => {

        const thumbnail =
            document.createElement("img");

        thumbnail.src = photo.image;

        thumbnail.alt =
            `View ${photo.title || "photograph"}`;

        thumbnail.loading = "lazy";

        thumbnail.dataset.index = index;

        thumbnail.addEventListener(
            "click",
            () => {

                stopSlideshow();

                loadImage(index);

            }
        );

        thumbnailContainer.appendChild(thumbnail);

    });

    updateThumbnails();

}


/* ==========================================
   Active Thumbnail
   ========================================== */

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


document
    .querySelector(".next")
    .addEventListener("click", nextImage);


document
    .querySelector(".prev")
    .addEventListener("click", previousImage);


/* ==========================================
   Keyboard Navigation
   ========================================== */

document.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "ArrowRight") {
            nextImage();
        }

        if (event.key === "ArrowLeft") {
            previousImage();
        }

    }
);


/* ==========================================
   Touch / Swipe Navigation
   ========================================== */

let touchStartX = 0;

let touchEndX = 0;


img.addEventListener(
    "touchstart",
    (event) => {

        touchStartX =
            event.changedTouches[0].screenX;

    },
    { passive: true }
);


img.addEventListener(
    "touchend",
    (event) => {

        touchEndX =
            event.changedTouches[0].screenX;

        handleSwipe();

    },
    { passive: true }
);


function handleSwipe() {

    const swipeDistance =
        touchEndX - touchStartX;

    const minimumSwipe = 50;

    if (
        Math.abs(swipeDistance) <
        minimumSwipe
    ) {
        return;
    }

    if (swipeDistance < 0) {

        nextImage();

    } else {

        previousImage();

    }

}


/* ==========================================
   Fullscreen
   ========================================== */

fullscreenButton.addEventListener(
    "click",
    async () => {

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

    }
);


document.addEventListener(
    "fullscreenchange",
    () => {

        if (document.fullscreenElement) {

            fullscreenButton.textContent = "⛶";

            fullscreenButton.setAttribute(
                "aria-label",
                "Exit fullscreen"
            );

            fullscreenButton.title =
                "Exit fullscreen";

        } else {

            fullscreenButton.textContent = "⛶";

            fullscreenButton.setAttribute(
                "aria-label",
                "Enter fullscreen"
            );

            fullscreenButton.title =
                "Fullscreen";

        }

    }
);


/* ==========================================
   Slideshow
   ========================================== */

function startSlideshow() {

    if (slideshowTimer !== null) {
        return;
    }

    slideshowTimer = setInterval(
        () => {

            current++;

            if (current >= images.length) {
                current = 0;
            }

            loadImage(current);

        },
        slideshowDelay
    );

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

    if (slideshowButton) {

        slideshowButton.textContent =
            "▶ Start Slideshow";

        slideshowButton.setAttribute(
            "aria-pressed",
            "false"
        );

    }

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


/* ==========================================
   Start Gallery
   ========================================== */

loadGallery();