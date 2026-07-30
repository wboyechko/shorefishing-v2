/*
=========================================
ShoreFishing.net

Version 2.0.0-alpha

Application Script
=========================================
*/

document.addEventListener("DOMContentLoaded", () => {

    console.log("ShoreFishing.net Loaded");

    // Smooth scrolling

    document.querySelectorAll('a[href^="#"]').forEach(link => {

        link.addEventListener("click", e => {

            const target = document.querySelector(link.getAttribute("href"));

            if(!target) return;

            e.preventDefault();

            target.scrollIntoView({

                behavior:"smooth"

            });

        });

    });

});