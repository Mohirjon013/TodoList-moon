// Selecting elements
let elTodoForm = document.querySelector(".todo-form")
let elTodoInput = document.querySelector(".todo-input")
let elTodoDue = document.querySelector(".todo-due")
let elList = document.querySelector(".todo-list")

let elAllList = document.querySelector(".all-list")
let elProgressList = document.querySelector(".progress-list")
let elDoneList = document.querySelector(".done-list")

let progressBar = document.querySelector(".progress")
let stateNumber = document.querySelector(".numbers")

let elModalWrapper = document.querySelector(".modal-wrapper")
let elModalInner = document.querySelector(".modal-inner")
let elModalContent = document.querySelector(".modal-content")
let elUpdateForm = document.querySelector(".update-form")
let elUpdateDue = document.querySelector(".update-due")


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
    const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
    return days[new Date().getDay()]
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
    if(currentFilter == "done"){
        renderTodo(todo.filter(item => item.isCompleted))
    }
    else if(currentFilter == "progress"){
        renderTodo(todo.filter(item => !item.isCompleted))
    }
    else{
        renderTodo(todo)
    }
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
        if (!item.createdTime) return

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
        elItem.className = "w-[98%] sm:p-2 p-1 sm:pl-1 pl-0 px-1 pb-1.5 rounded-xl bg-gray-200 shadow-[0_3px_8px_rgba(0,0,0,0.5)]"
        
        elItem.innerHTML = `
            <div class="flex items-start gap-1 justify-between ${item.isCompleted ? " opacity-60" : "" }">
                <div class="w-[85%] flex items-start ml-3">
                    <span class="flex-shrink-0 font-semibold max-[370px]:text-[17px] max-[410px]:text-[18px] sm:text-[24px] font-Mono mt-1 pr-1">${index + 1}.</span>
                    <p class="max-[370px]:text-[15px] max-[410px]:text-[16px] sm:text-[22px] font-family leading-normal break-words flex-1 ${item.isCompleted ? "line-through opacity-45" : "" } ">${item.value}</p>
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
                    <button onclick="handleUpdateBtn(${item.id})" type="button" class="update-btn ${item.isCompleted ? 'opacity-50 cursor-not-allowed' : "hover:scale-115 duration-400 cursor-pointer"}" ${item.isCompleted ? 'disabled' : ""} >
                        <img src="./images/edit-icons.svg" alt="edit-icon" width="36" height="36">
                    </button>
                </div>
            </div>
        
            <div class="flex sm:flex-nowrap flex-wrap items-center ml-2 sm:mt-3 mt-2 sm:justify-start justify-between ${item.isCompleted ? " opacity-60 sm:justify-around justify-around" : "sm:gap-4 gap-1"} ${item.isCompleted && timeTaken ? "sm:justify-start  justify-around sm:gap-4 gap-1" : ""}">
        
        
                <p class="sm:text-[11px] max-[370px]:text-[7px] max-[450px]:text-[10px] font-Mono sm:py-0 py-1">Created: ${String(item.createdTime.dateday).padStart(2,0)} ${item.createdTime.dateMonth} ${item.createdTime.dateYear} ${String(item.createdTime.dateHour).padStart(2,0)}:${String(item.createdTime.dateMin).padStart(2,0)} </p>
        
                ${item.isCompleted && timeTaken ? `
                    <p class="sm:text-[10px] max-[370px]:text-[8px] max-[410px]:text-[9.5px] max-[450px]:text-[10px] font-Mono bg-[rgba(34,197,94,0.30)] sm:px-2 px-1 p-1 rounded-lg">Completed in: ${formatTimeTaken(timeTaken)} </p>
                    ${item.due && item.completedTime > new Date(item.due).getTime() ? `
                        <div class="flex items-center gap-1 !text-[#7f1d1d] bg-[rgba(239,68,68,0.30)] sm:px-2 px-1 p-1 rounded-lg">
                            <img class="sm:w-[15px] w-[12px] h-[12px] sm:h-[15px]" src="./images/alert-icon.svg" alt="alert-icon" width="15" height="15">
                            <p class="text-[9px] font-Mono">Completed: ${formatTimeTaken(item.completedTime - new Date(item.due).getTime())} late</p>
                        </div>
                    ` : ''}
                ` : ""}
        
                ${item.due && !item.isCompleted ? `
                    <div class="flex items-center gap-1 text-white ${isOverdue ? "!text-[#7f1d1d] bg-[rgba(239,68,68,0.30)]" : "bg-[rgba(50,125,180,0.30)] !text-[#255867]"} sm:px-2 px-1 p-1 rounded-lg">
                        <img class="sm:w-[15px] w-[11px] h-[11px] sm:h-[15px]" src="${isOverdue ? "./images/warning-icon.svg" : "./images/clock-icon.svg"}"  alt="clock-icon" width="15" height="15">
        
        
                        <p class="sm:text-[11px] max-[370px]:text-[8px] max-[410px]:text-[8px] max-[450px]:text-[10px] font-Mono !tracking-tighter whitespace-nowrap">${isOverdue ? 'Overdue:' : 'Due:'} ${new Date(item.due).toLocaleString('en-US', {month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit'}).replace("," , "")}</p>
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


// Update function start 
function handleUpdateBtn(id){
    elModalWrapper.classList.remove("scale-0")
    document.body.classList.add("overflow-y-hidden")
    
    const findedUpdatedItem = todo.find(item => item.id == id)
    elModalContent.innerHTML = `
        <form class="update-form max-w-[500px] mx-auto px-4 mb-3">
            <label class="w-full">
                <span class="inline-block text-[23px] font-family mb-1">Task Description</span>
                <input class="update-input w-full p-2  bg-white font-family text-[21px] rounded-xl outline-none focus:shadow-md focus:shadow-zinc-600 duration-400 shadow-[0_3px_8px_rgba(0,0,0,0.5)]" type="text" value="${findedUpdatedItem.value}" name="inputValue" placeholder="Add new task..." required aria-label="add new task" autocomplete="off">
            </label>
                
            <label class="w-full inline-block mt-5">
                <span class="inline-block text-[23px] font-family mb-1">Due Date</span>
                <input class="update-due w-full text-[21px] p-2 pl-3 bg-white font-family rounded-xl outline-none focus:shadow-md focus:shadow-zinc-600 duration-400 shadow-[0_3px_8px_rgba(0,0,0,0.5)]" type="datetime-local" value="${findedUpdatedItem.due}" name="inputDue" autocomplete="off">
            </label>
                    
            <div class="mt-9 flex items-center justify-between">
                <button type="submit" class="w-[65%] text-white py-2 bg-mist-700 rounded-lg shadow-[0_3px_8px_rgba(0,0,0,0.5)] cursor-pointer border-2 border-white/18">Save Changes</button>
                <button onclick="handleCancelBtn()" type="button" class="w-[30%] text-mist-700 py-2 bg-white rounded-lg shadow-[0_3px_8px_rgba(0,0,0,0.5)] cursor-pointer border-2 border-mist-500">Cancel</button>
            </div>
        </form>
    `
    
    let elUpdateForm = document.querySelector(".update-form")
    
    elUpdateForm.addEventListener('submit', (e) => {
        e.preventDefault()
        
        findedUpdatedItem.value = e.target.inputValue.value
        findedUpdatedItem.due = e.target.inputDue.value
        
        elModalWrapper.classList.add("scale-0")
        document.body.classList.remove("overflow-y-hidden")
        
        applyCurrentFilter()
        // progressTask()
        localStorage.setItem("setTodo", JSON.stringify(todo))
    })
}

elModalWrapper.addEventListener("click", function(e){
    if(e.target.id == "wrapper"){
        elModalWrapper.classList.add("scale-0")
        document.body.classList.remove("overflow-y-hidden")
    }
})
function handleCancelBtn(){
    elModalWrapper.classList.add("scale-0")
    document.body.classList.remove("overflow-y-hidden")
}
// Update function start 


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
    
    const allDone = todo.length > 0 && todo.every(item => item.isCompleted)
    if (allDone) fireConfetti()
        
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

// Confetti animation start
const fireConfetti = () => {
    playSuccessSound()

    const startTime = Date.now()
    
    const interval = setInterval(() => {
        const elapsed = Date.now() - startTime
        if (elapsed >= 8000) {
            clearInterval(interval)
            return
        }

        confetti({ particleCount: 15, angle: 60,  spread: 70, origin: { x: 0,   y: 0.8 } })
        confetti({ particleCount: 15, angle: 120, spread: 70, origin: { x: 1,   y: 0.8 } })
        confetti({ particleCount: 10, angle: 90,  spread: 100, origin: { x: 0.5, y: 0  } })
    }, 300)
}
// Confetti animation end


// Sound start
function playSuccessSound() {
    const audio = new Audio("./sound/fireworks.mp3")
    audio.volume = 0.8 
    audio.play()

    setTimeout(() => {
        audio.pause()
        audio.currentTime = 0
    }, 8000)
}
// Sound end
