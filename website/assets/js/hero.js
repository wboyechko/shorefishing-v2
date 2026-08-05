document.addEventListener("DOMContentLoaded",()=>{

const scroll=document.querySelector(".scroll-indicator");

if(scroll){

scroll.addEventListener("click",()=>{

const next=document.querySelector("#featured");

if(next){

next.scrollIntoView({

behavior:"smooth"

});

}

});

}

});