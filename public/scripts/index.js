let nav = document.querySelector(".navbar1");
let main = document.querySelector("main");
window.onload = () => {
   
    let h = nav.offsetHeight;
    console.log(h);
   
    h = 1.7* h; // Double the height
    main.style.marginTop = `${h}px`; // Use backticks for template literals
};

window.addEventListener("scroll",()=>{
    let s = window.scrollY;
    if(s>300){
        nav.style.backgroundColor = "rgb(113, 119, 135)";
    }
    else nav.style.backgroundColor = "rgb(58, 125, 184)";
})

let heading1= document.querySelector(".main-heading");

const btn  = document.querySelector("#checkbox");
btn.addEventListener('click',()=>{
    console.log(document.body.style.backgroundColor);
    console.log(heading1);
    if(document.body.style.backgroundColor == "white"){
        document.body.style.backgroundColor = "black"
        document.body.style.color = "white"
        heading1.style.color = "aliceblue";
    }
    else{
        document.body.style.backgroundColor = "white"
        document.body.style.color = "black"
        heading1.style.color = "black";
    }
})