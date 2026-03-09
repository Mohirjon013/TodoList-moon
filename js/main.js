

let elTodoForm = document.querySelector(".todo-form")
let elTodoInput = document.querySelector(".todo-input")
let elTodoDue = document.querySelector(".todo-due")
let elList = document.querySelector(".todo-list")

let elAllList = document.querySelector(".all-list")
let elProgressList = document.querySelector(".progress-list")
let elDoneList = document.querySelector(".done-list")

let progressBar = document.querySelector(".progress")
let stateNumber = document.querySelector(".numbers")

let todayDate = document.querySelector(".today-date")

let currentFilter = 'all'

let todo = JSON.parse(localStorage.getItem("setTodo")) || []
console.log(todo);



// Convert to timestamp
function monthNameToNumber(monthName) {
    const monthMap = {
        "January": 0, "February": 1, "March": 2, "April": 3,
        "May": 4, "June": 5, "July": 6, "August": 7,
        "September": 8, "October": 9, "November": 10, "December": 11
    }
    return monthMap[monthName]
}

// Convert to noraml-format
function formatTimeTaken(milliseconds) {
    const minutes = Math.floor(milliseconds / 60000)
    const hours = Math.floor(minutes / 60)
    const remainingMins = minutes % 60
    
    if (minutes < 60) {
        return `${minutes} min${minutes !== 1 ? 's' : ''}`
    }
    return `${hours}h ${remainingMins}m`
}



// Today date start
function gettingMonth(){
    let date = new Date();
    if(date.getMonth()+1 == 1){
        return "January"
    }
    else if(date.getMonth() + 1 == 2){
        return "February"
    }
    else if(date.getMonth() + 1 == 3){
        return "March"
    }
    else if(date.getMonth() + 1 == 4){
        return "April"
    }
    else if(date.getMonth() + 1 == 5){
        return "May"
    }
    else if(date.getMonth() + 1 == 6){
        return "June"
    }
    else if(date.getMonth() + 1 == 7){
        return "July"
    }
    else if(date.getMonth() + 1 == 8){
        return "August"
    }
    else if(date.getMonth() + 1 == 9){
        return "September"
    }
    else if(date.getMonth() + 1 == 10){
        return "October"
    }
    else if(date.getMonth() + 1 == 11){
        return "November"
    }
    else if(date.getMonth() + 1 == 12){
        return "December"
    }
}
function gettingWeek(){
    let date = new Date();
    
    if(date.getUTCDay() + 1 == 1){
        return "Mon"
    }
    else if(date.getUTCDay() + 1 == 2){
        return "Tue"
    }
    else if(date.getUTCDay() + 1 == 3){
        return "Wed"
    }
    else if(date.getUTCDay() + 1 == 4){
        return "Thur"
    }
    else if(date.getUTCDay() + 1 == 5){
        return "Fri"
    }
    else if(date.getUTCDay() + 1 == 6){
        return "Sat"
    }
    else if(date.getUTCDay() + 1 == 7){
        return "Sun"
    }
}
let date = new Date()
let dateYear = date.getFullYear()
let dateMonth = gettingMonth()
let dateWeek = gettingWeek()
let dateday = date.getDate()
todayDate.firstElementChild.innerHTML = `${dateWeek} ${dateday} ${dateMonth}`

// Today date end

// apply filter start
function applyCurrentFilter(){
    let filteredArray;
    if(currentFilter == "done"){
        filteredArray = todo.filter(item => item.isCompleted)
    }
    else if(currentFilter == "progress"){
        filteredArray = todo.filter(item => !item.isCompleted)
    }
    else{
        filteredArray = todo
    }
    
    renderTodo(filteredArray)
}
// apply filter start


// add todo start 
elTodoForm.addEventListener("submit", (e) => {
    e.preventDefault()
    if(elTodoInput.value.trim() == ""){
        alert("Text title cannot be empty")
    }
    
    let date = new Date()
    let dateYear = date.getFullYear()
    let dateMonth = gettingMonth()
    let dateday = date.getDate()
    let dateHour = date.getHours()
    let dateMin = date.getMinutes()
    
    const data = {
        id: Date.now(),
        value: elTodoInput.value,
        due: elTodoDue.value || null,
        createdTime:{
            dateYear,dateMonth,dateday,dateHour, dateMin
        },
        completedTime:null,
        isCompleted: false,
    }
    
    todo.push(data)
    applyCurrentFilter()
    progressTask()
    localStorage.setItem("setTodo", JSON.stringify(todo))
    
    e.target.reset()
})
// add todo end 


// render todo start
function renderTodo(arr){
    elList.innerHTML = ""

    arr.forEach((item, index) => {
        const dueDate = item.due ? new Date(item.due) : null;
        const isOverdue = dueDate && dueDate < new Date();
        
        const createdTimestamp = new Date(
            item.createdTime.dateYear,
            monthNameToNumber(item.createdTime.dateMonth),
            item.createdTime.dateday,
            item.createdTime.dateHour,
            item.createdTime.dateMin  
        ).getTime()
        const timeTaken = item.completedTime ? item.completedTime - createdTimestamp : null
        let elItem = document.createElement("li")
        elItem.className = "w-[98%] p-2 pl-1  rounded-xl bg-gray-200 shadow-[0_3px_8px_rgba(0,0,0,0.5)]"
        
        elItem.innerHTML = `
            <div class="flex items-center gap-1 justify-between ${item.isCompleted ? " opacity-60" : "" }">
                <div class="w-[85%] flex items-center ml-3">
                    <span class=" font-semibold text-[25px] font-Mono mt-1 pr-1">${index + 1}.</span>
                    <p class="text-[28px] font-family  ${item.isCompleted ? "line-through opacity-45" : "" } ">${item.value}</p>
                </div>
                    
                <div class="max-w-[220px] flex gap-1">
                    <button onclick="handleCompletedBtn(${item.id})" class="done-btn hover:scale-115 duration-400 cursor-pointer ${item.isCompleted ? "hidden" : "block" }">
                        <img src="./images/done-icon.svg" alt="done-icon" width="37" height="37">
                    </button>
                    <button onclick="handleCompletedBtn(${item.id})" class="done-btn hover:scale-115 duration-400 cursor-pointer ${item.isCompleted ? "block" : "hidden" } ">
                        <img src="./images/complete-icon.svg" alt="done-icon" width="37" height="37">
                    </button>
                    <button onclick="handleDeleteBtn(${item.id})" class="delete-btn hover:scale-115 duration-400 cursor-pointer" type="button">
                        <img src="./images/delete-icon.svg" alt="de-icon" width="37" height="37">
                    </button>
                    <button class="update-btn hover:scale-115 duration-400 cursor-pointer" type="button">
                        <img src="./images/edit-icons.svg" alt="edit-icon" width="36" height="36">
                    </button>
                </div>
            </div>
        
            <div class="flex items-center ml-2 mt-3 ${item.isCompleted ? " opacity-60 justify-around" : "gap-4"} ${item.isCompleted && timeTaken ? "justify-start gap-4" : ""}">
                <p class="text-[11px] font-Mono ">Created: ${String(item.createdTime.dateday).padStart(2,0)} ${item.createdTime.dateMonth} ${item.createdTime.dateYear} ${String(item.createdTime.dateHour).padStart(2,0)}:${String(item.createdTime.dateMin).padStart(2,0)} </p>

                ${item.isCompleted && timeTaken ? `
                    <p class="text-[11px] font-Mono bg-[rgba(34,197,94,0.30)] px-2 p-1 rounded-xl">Completed in: ${formatTimeTaken(timeTaken)} </p>
                    ${item.due && item.completedTime > new Date(item.due).getTime() ? `
                        <div class="flex items-center gap-1 !text-[#7f1d1d] bg-[rgba(239,68,68,0.30)] px-2 p-1 rounded-xl">
                            <img src="./images/alert-icon.svg" alt="alert-icon" width="15" height="15">
                            <p class="text-[11px] font-Mono">Completed: ${formatTimeTaken(item.completedTime - new Date(item.due).getTime())} late</p>
                        </div>
                    ` : ''}
                ` : ""}


                ${item.due && !item.isCompleted ? `
                    <div class="flex items-center gap-1 text-white ${isOverdue ? "!text-[#7f1d1d] bg-[rgba(239,68,68,0.30)]" : "bg-[rgba(50,125,180,0.30)] !text-[#255867]"} px-2 p-1 rounded-xl">
                        <img src="${isOverdue ? "./images/warning-icon.svg" : "./images/clock-icon.svg"}"  alt="clock-icon" width="15" height="15">


                        <p class="text-[12px] font-Mono !tracking-tighter">${isOverdue ? 'Overdue' : 'Due'} ${new Date(item.due).toLocaleString('en-US', {month: 'long', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'}).replace("," , "")}</p>
                    </div>
                ` : ''}
            </div>
        `
        elList.appendChild(elItem)
        
    });
    
    progressTask()
    elAllList.lastChild.textContent = todo.length
    elProgressList.lastChild.textContent = todo.filter(item => !item.isCompleted).length
    elDoneList.lastChild.textContent = todo.filter(item => item.isCompleted).length
    
}
renderTodo(todo)
// render todo end


// delete function start 
function handleDeleteBtn(id){
    const findedDeleteIndex = todo.findIndex(item => item.id == id)
    todo.splice(findedDeleteIndex, 1)
    applyCurrentFilter()
    progressTask()
    localStorage.setItem("setTodo", JSON.stringify(todo))
}
// delete function start 


// complete start 
function handleCompletedBtn(id){
    const findCompletedObj = todo.find(item => item.id == id)
    findCompletedObj.isCompleted = !findCompletedObj.isCompleted
    findCompletedObj.completedTime = findCompletedObj.isCompleted ? Date.now() : null
    applyCurrentFilter()
    progressTask()
    localStorage.setItem("setTodo", JSON.stringify(todo))
}

function handleAllListBox(){
    currentFilter = 'all'
    renderTodo(todo)
}
function handleProgressListBox(){
    currentFilter = 'progress'
    const filteredIsNotCompletedArr =  todo.filter(item => !item.isCompleted)
    renderTodo(filteredIsNotCompletedArr)
}
function handleDoneListBox(){
    currentFilter = 'done'
    const filteredIsNotCompletedArr =  todo.filter(item => item.isCompleted)
    renderTodo(filteredIsNotCompletedArr)
}
// complete end 


// progress Bar start
function progressTask(){
    const completeTask = todo.filter(item => item.isCompleted).length
    const totalTask = todo.length
    const progress = totalTask > 0 ? (completeTask / totalTask) * 100 : 0
    
    progressBar.style.width = `${progress}%`
    stateNumber.innerHTML = `${completeTask} / ${totalTask}`
}
// progress Bar start


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
// clock end 