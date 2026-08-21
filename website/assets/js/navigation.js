document.addEventListener("DOMContentLoaded", () => {

    const button = document.querySelector(".mobile-toggle");
    const nav = document.querySelector(".nav-menu");

    if (!button || !nav) {
        return;
    }

    const toggleNavigation = () => {
        nav.classList.toggle("show");

        const isOpen = nav.classList.contains("show");

        button.setAttribute(
            "aria-label",
            isOpen ? "Close navigation" : "Open navigation"
        );

        button.setAttribute(
            "aria-expanded",
            String(isOpen)
        );
    };

    button.addEventListener("click", toggleNavigation);

    button.addEventListener("keydown", event => {

        if (event.key === "Enter" || event.key === " ") {

            event.preventDefault();

            toggleNavigation();
        }

    });

    document.querySelectorAll(".nav-menu a").forEach(link => {

        link.addEventListener("click", () => {
            nav.classList.remove("show");

            button.setAttribute(
                "aria-label",
                "Open navigation"
            );

            button.setAttribute(
                "aria-expanded",
                "false"
            );
        });

    });

});
