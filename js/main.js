// clock start 

let hours = document.querySelector("#hrs")
let min = document.querySelector("#min")
let sec = document.querySelector("#sec")



setInterval(() => {
    let currentTime = new Date()
    
    hours.textContent = (currentTime.getHours() < 10 ? "0" : "") + currentTime.getHours()
    min.textContent =   (currentTime.getMinutes() < 10 ? "0" : "") + currentTime.getMinutes()
    sec.textContent = (currentTime.getSeconds() < 10 ? "0" : "") + currentTime.getSeconds()
}, 1000);

console.log(currentTime.getSeconds());


// clock end 
