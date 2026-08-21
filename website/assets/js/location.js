let locations = [];


/* ==========================================
   Get Location ID
========================================== */

function getLocationId() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    return params.get("id");

}


/* ==========================================
   Load Location Data
========================================== */

async function loadLocation() {

    const locationId =
        getLocationId();

    if (!locationId) {

        showLocationError(
            "No fishing location was specified."
        );

        return;

    }


    try {

        const response =
            await fetch(
                "assets/data/locations.json"
            );

        if (!response.ok) {

            throw new Error(
                `Location data could not be loaded (${response.status})`
            );

        }


        const data =
            await response.json();


        locations =
            Array.isArray(data.locations)
                ? data.locations
                : [];


        const location =
            locations.find(
                item =>
                    item.id === locationId
            );


        if (!location) {

            showLocationError(
                "This fishing location could not be found."
            );

            return;

        }


        renderLocation(location);


    } catch (error) {

        console.error(
            "Location loading error:",
            error
        );


        showLocationError(
            "The fishing location could not be loaded."
        );

    }

}


/* ==========================================
   Render Location
========================================== */

function renderLocation(location) {

    document.title =
        `${location.name} | ShoreFishing.net`;


    document.getElementById(
        "location-name"
    ).textContent =
        location.name || "Fishing Location";


    document.getElementById(
        "location-region"
    ).textContent =
        location.region || "";


    document.getElementById(
        "location-waterbody"
    ).textContent =
        location.waterbody || "";


    document.getElementById(
        "location-description"
    ).textContent =
        location.description || "";


    const accessPanel =
        document.getElementById(
            "location-access"
        );


    const accessText =
        accessPanel.querySelector("p");


    accessText.textContent =
        location.access ||
        "Access information will be added.";


    const speciesPanel =
        document.getElementById(
            "location-species"
        );


    const speciesList =
        speciesPanel.querySelector("ul");


    speciesList.innerHTML = "";


    if (
        Array.isArray(location.species) &&
        location.species.length
    ) {

        location.species.forEach(
            species => {

                const item =
                    document.createElement("li");

                item.textContent =
                    species;

                speciesList.appendChild(
                    item
                );

            }
        );

    } else {

        const item =
            document.createElement("li");

        item.textContent =
            "Species information will be added.";

        speciesList.appendChild(item);

    }


    const notesPanel =
        document.getElementById(
            "location-notes"
        );


    notesPanel.querySelector("p").textContent =
        location.notes ||
        "Additional information will be added.";


    renderLocationPhoto(location);


    document.getElementById(
        "location-details"
    ).style.display =
        "grid";

}


/* ==========================================
   Location Photo
========================================== */

function renderLocationPhoto(location) {

    const photoContainer =
        document.getElementById(
            "location-photo"
        );


    photoContainer.innerHTML = "";


    if (
        Array.isArray(location.photos) &&
        location.photos.length
    ) {

        const image =
            document.createElement("img");

        image.src =
            location.photos[0];

        image.alt =
            location.name || "Fishing location";

        photoContainer.appendChild(
            image
        );

    } else {

        photoContainer.textContent =
            "Location photography will be added.";

    }

}


/* ==========================================
   Error
========================================== */

function showLocationError(message) {

    document.getElementById(
        "location-details"
    ).style.display =
        "none";


    document.getElementById(
        "location-error"
    ).textContent =
        message;

}


/* ==========================================
   Start
========================================== */

loadLocation();