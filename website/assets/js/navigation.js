document.addEventListener("DOMContentLoaded", () => {

const button=document.querySelector(".mobile-toggle");
const nav=document.querySelector(".nav-menu");

button.addEventListener("click",()=>{

nav.classList.toggle("show");

});

document.querySelectorAll('.nav-menu a').forEach(link=>{

link.addEventListener('click',()=>{

nav.classList.remove("show");

});

});

});
