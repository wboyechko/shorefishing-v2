const offlineGalleryData = [
    {
        image: "assets/images/gallery/sample01.jpg",
        title: "Morning Walleye",
        description: "Early morning fishing from shore.",
        location: "Mossy River, MB",
        species: "Walleye",
        date: "2010-07-16",
        photographer: "Wade"
    },
    {
        image: "assets/images/gallery/sample02.jpg",
        title: "Evening Freshwater Drum",
        description: "An evening worth remembering as the sun went down.",
        location: "Red River, MB",
        species: "Freshwater Drum",
        date: "20005-06-05",
        photographer: "Wade"
    },
    {
        image: "assets/images/gallery/sample03.jpg",
        title: "Late Night Channel Catfish",
        description: "A great catch along the shoreline.",
        location: "Red River, MB",
        species: "Channel Catfish",
        date: "2008-09-18",
        photographer: "Adam"
    }
];

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

    /*
     * Offline development mode
     *
     * Browsers block fetch() from file:// pages.
     * When gallery.html is opened directly from the
     * computer, use the fallback data instead.
     */

    if (window.location.protocol === "file:") {

        console.info(
            "Offline mode detected. Using local gallery data."
        );

        images = offlineGalleryData;

        createThumbnails();
        loadImage(0);

        return;
    }


    /*
     * Normal website mode
     *
     * On GitHub Pages or another web server,
     * load the gallery information from gallery.json.
     */

    try {

        const response =
            await fetch("assets/data/gallery.json");

        if (!response.ok) {

            throw new Error(
                `Gallery data could not be loaded (${response.status})`
            );

        }

        images = await response.json();

        if (
            !Array.isArray(images) ||
            images.length === 0
        ) {

            throw new Error(
                "Gallery data contains no photographs."
            );

        }

        createThumbnails();

        loadImage(0);

    } catch (error) {

        console.error(
            "Gallery data could not be loaded:",
            error
        );

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

    const addDetail = (icon, label, value) => {

        if (
            value === undefined ||
            value === null ||
            String(value).trim() === ""
        ) {
            return;
        }

        const item = document.createElement("span");

        item.className = "gallery-detail";

        const iconElement = document.createElement("span");
        iconElement.textContent = icon;
        iconElement.setAttribute("aria-hidden", "true");

        const labelElement = document.createElement("strong");
        labelElement.textContent = `${label}:`;

        const valueElement = document.createElement("span");
        valueElement.textContent = value;

        item.appendChild(iconElement);
        item.appendChild(labelElement);
        item.appendChild(valueElement);

        details.appendChild(item);
    };


    addDetail(
        "📍",
        "Location",
        photo.location
    );

    addDetail(
        "🎣",
        "Species",
        photo.species
    );

    addDetail(
        "📅",
        "Date",
        formatPhotoDate(photo.date)
    );

    addDetail(
        "📷",
        "Photographer",
        photo.photographer
    );

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