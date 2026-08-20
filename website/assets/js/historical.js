let archiveData = null;


/* ==========================================
   Load Historical Archive
   ========================================== */

async function loadHistoricalArchive() {

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

        renderArchive();

    } catch (error) {

        console.error(
            "Historical archive could not be loaded:",
            error
        );

        showArchiveError();

    }

}


/* ==========================================
   Render Archive
   ========================================== */

function renderArchive() {

    if (!archiveData) {
        return;
    }

    const description =
        document.getElementById(
            "archive-description"
        );

    const yearGrid =
        document.getElementById(
            "year-grid"
        );

    description.textContent =
        archiveData.archive.description;

    yearGrid.innerHTML = "";

    archiveData.years.forEach(
        archiveYear => {

            const card =
                document.createElement("a");

            card.className =
                "year-card";

            card.href =
                `historical-year.html?year=${archiveYear.year}`;

            const photoCount =
                archiveYear.photos.length;

            card.innerHTML = `
                <span class="year">
                    ${archiveYear.year}
                </span>

                <span class="year-title">
                    ${escapeHTML(
                        archiveYear.title
                    )}
                </span>

                <span class="photo-count">
                    ${photoCount}
                    ${photoCount === 1
                        ? "photograph"
                        : "photographs"}
                </span>
            `;

            yearGrid.appendChild(card);

        }
    );

}


/* ==========================================
   Error
   ========================================== */

function showArchiveError() {

    const message =
        document.getElementById(
            "archive-message"
        );

    message.textContent =
        "The historical archive could not be loaded. Please try again later.";

}


/* ==========================================
   HTML Safety
   ========================================== */

function escapeHTML(value) {

    const element =
        document.createElement("div");

    element.textContent =
        value;

    return element.innerHTML;

}


/* ==========================================
   Start
   ========================================== */

loadHistoricalArchive();