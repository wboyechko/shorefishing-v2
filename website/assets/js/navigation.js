document.addEventListener("DOMContentLoaded", () => {

    const header = document.querySelector("#site-header");
    const footer = document.querySelector("#site-footer");

    /*
     * Shared site header
     */
    if (header) {

        header.innerHTML = `
            <div class="container">

                <a class="brand" href="index.html">

                    <img
                        src="assets/images/logo/logo.png"
                        alt="ShoreFishing.net">

                    <div class="brand-text">
                        <h1>ShoreFishing.net</h1>
                        <span>Established 2004</span>
                    </div>

                </a>

                <nav class="nav-menu" aria-label="Main navigation">

                    <a href="index.html">Home</a>

                    <a href="locations.html">Locations</a>

                    <a href="how-to-fish.html">How To Fish</a>

                    <a href="gallery.html">Gallery</a>

                    <a href="tips.html">Tips</a>

                    <a href="historical.html">
                        Historical Archive
                    </a>

                </nav>

                <button
                    class="mobile-toggle"
                    type="button"
                    aria-label="Open navigation"
                    aria-expanded="false">

                    <span></span>
                    <span></span>
                    <span></span>

                </button>

            </div>
        `;
    }


    /*
     * Shared footer
     */
    if (footer) {

        footer.innerHTML = `
            <div class="container">

                <p>
                    © 2004–2026 Wade Boyechko |
                    ShoreFishing.net
                </p>

                <p>
                    Your Guide To Fishing The Shore
                </p>

                <p>
                    Leave Every Shoreline Better
                    Than You Found It
                </p>

            </div>
        `;
    }


    /*
     * Mobile navigation
     */
    const button =
        document.querySelector(".mobile-toggle");

    const nav =
        document.querySelector(".nav-menu");

    if (!button || !nav) {
        return;
    }


    const closeNavigation = () => {

        nav.classList.remove("show");

        button.setAttribute(
            "aria-expanded",
            "false"
        );

        button.setAttribute(
            "aria-label",
            "Open navigation"
        );

    };


    const toggleNavigation = () => {

        const isOpen =
            nav.classList.toggle("show");

        button.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        button.setAttribute(
            "aria-label",
            isOpen
                ? "Close navigation"
                : "Open navigation"
        );

    };


    button.addEventListener(
        "click",
        toggleNavigation
    );


    button.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();

                toggleNavigation();

            }

        }
    );


    /*
     * Close mobile menu after selecting a page
     */
    nav.querySelectorAll("a").forEach(link => {

        link.addEventListener(
            "click",
            closeNavigation
        );

    });


    /*
     * Highlight current page
     */
    const currentPage =
        window.location.pathname
            .split("/")
            .pop() || "index.html";


    nav.querySelectorAll("a").forEach(link => {

        const linkPage =
            link.getAttribute("href");

        if (linkPage === currentPage) {

            link.classList.add("active");

        }

    });

});