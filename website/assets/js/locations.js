let locationData = null;


/* ==========================================
   Load Locations
========================================== */

async function loadLocations() {

    try {

        const response =
            await fetch(
                "assets/data/locations.json"
            );

        if (!response.ok) {

            throw new Error(
                `Locations could not be loaded (${response.status})`
            );

        }

        locationData =
            await response.json();

        renderLocations();

    } catch (error) {

        console.error(
            "Locations could not be loaded:",
            error
        );

        showLocationsError();

    }

}


/* ==========================================
   Render Locations
========================================== */

function renderLocations() {

    const grid =
        document.getElementById(
            "location-grid"
        );

    if (
        !locationData ||
        !Array.isArray(
            locationData.locations
        )
    ) {

        showLocationsError();

        return;
    }


    grid.innerHTML = "";


    if (
        locationData.locations.length === 0
    ) {

        document.getElementById(
            "locations-message"
        ).textContent =
            "Fishing locations are being added. Check back soon.";

        return;

    }


    locationData.locations.forEach(
        location => {

            const card =
                document.createElement("a");

            card.className =
                "location-card";

            card.href =
                `location.html?id=${encodeURIComponent(
                    location.id
                )}`;


            const title =
                document.createElement("h2");

            title.textContent =
                location.name || "Fishing Location";


            const region =
                document.createElement("div");

            region.className =
                "location-region";

            region.textContent =
                location.region || "";


            const waterbody =
                document.createElement("div");

            waterbody.className =
                "location-waterbody";

            waterbody.textContent =
                location.waterbody || "";


            const description =
                document.createElement("p");

            description.className =
                "location-description";

            description.textContent =
                location.description || "";


            card.appendChild(title);

            if (location.region) {
                card.appendChild(region);
            }

            if (location.waterbody) {
                card.appendChild(waterbody);
            }

            if (location.description) {
                card.appendChild(description);
            }

            grid.appendChild(card);

        }
    );

}


/* ==========================================
   Error
========================================== */

function showLocationsError() {

    document.getElementById(
        "locations-message"
    ).textContent =
        "The fishing locations could not be loaded. Please try again later.";

}


/* ==========================================
   Start
========================================== */

loadLocations();