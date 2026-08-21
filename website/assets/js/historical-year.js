let archiveData = null;
let selectedYear = null;


/* ==========================================
   Get Year From URL
   ========================================== */

function getYearFromURL() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const year =
        Number(params.get("year"));

    if (!Number.isInteger(year)) {
        return null;
    }

    return year;

}


/* ==========================================
   Load Archive
   ========================================== */

async function loadHistoricalYear() {

    selectedYear =
        getYearFromURL();

    if (!selectedYear) {

        showYearError(
            "No historical year was selected."
        );

        return;
    }

    try {

        const response =
            await fetch(
                "assets/data/historical.json"
            );

        if (!response.ok) {

            throw new Error(
                `Archive data could not be loaded (${response.status})`
            );

        }

        archiveData =
            await response.json();

        renderHistoricalYear();

    } catch (error) {

        console.error(
            "Historical archive could not be loaded:",
            error
        );

        showYearError(
            "The historical archive could not be loaded."
        );

    }

}


/* ==========================================
   Render Selected Year
   ========================================== */

function renderHistoricalYear() {

    const yearData =
        archiveData.years.find(
            item => item.year === selectedYear
        );

    if (!yearData) {

        showYearError(
            `No archive information was found for ${selectedYear}.`
        );

        return;
    }


    document.title =
        `${yearData.title} | ShoreFishing.net`;


    document.getElementById(
        "year-kicker"
    ).textContent =
        `ShoreFishing.net • ${yearData.year}`;


    document.getElementById(
        "year-title"
    ).textContent =
        yearData.title;


    document.getElementById(
        "year-description"
    ).textContent =
        yearData.description;


    renderPhotos(
        yearData.photos
    );

}


/* ==========================================
   Render Photos
   ========================================== */

function renderPhotos(photos) {

    const grid =
        document.getElementById(
            "photo-grid"
        );

    grid.innerHTML = "";


    if (
        !Array.isArray(photos) ||
        photos.length === 0
    ) {

        document.getElementById(
            "year-message"
        ).textContent =
            `Historical photographs for ${selectedYear} \
            have not been added yet.`;

        return;
    }


    photos.forEach(photo => {

        const article =
            document.createElement("article");

        article.className =
            "historical-photo";


        const image =
            document.createElement("img");

        image.src =
            photo.image;

        image.alt =
            photo.title ||
            `ShoreFishing.net photograph from ${selectedYear}`;


        const information =
            document.createElement("div");

        information.className =
            "photo-information";


        if (photo.title) {

            const heading =
                document.createElement("h3");

            heading.textContent =
                photo.title;

            information.appendChild(
                heading
            );

        }


        if (photo.description) {

            const description =
                document.createElement("p");

            description.textContent =
                photo.description;

            information.appendChild(
                description
            );

        }


        article.appendChild(image);

        article.appendChild(
            information
        );

        grid.appendChild(article);

    });

}


/* ==========================================
   Error
   ========================================== */

function showYearError(message) {

    document.getElementById(
        "year-message"
    ).textContent =
        message;

}


/* ==========================================
   Start
   ========================================== */

loadHistoricalYear();