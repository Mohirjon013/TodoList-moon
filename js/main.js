

let elTodoForm = document.querySelector(".todo-form")
let elTodoInput = document.querySelector(".todo-input")
let elTodoDue = document.querySelector(".todo-due")
let elList = document.querySelector(".todo-list")

let elAllList = document.querySelector(".all-list")
let elProgressList = document.querySelector(".progress-list")
let elDoneList = document.querySelector(".done-list")

let currentFilter = 'all'

let todo = JSON.parse(localStorage.getItem("setTodo")) || []



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
    
    const data = {
        id: Date.now(),
        value: elTodoInput.value,
        due: elTodoDue.value,
        isCompleted: false,
    }
    todo.push(data)
    applyCurrentFilter()
    localStorage.setItem("setTodo", JSON.stringify(todo))
    
    e.target.reset()
})
// add todo end 


// render todo start
function renderTodo(arr){
    elList.innerHTML = ""
    arr.forEach((item, index) => {
        let elItem = document.createElement("li")
        elItem.className = "w-[98%] p-2 pl-1  rounded-xl bg-gray-200 shadow-[0_3px_8px_rgba(0,0,0,0.5)]"
        
        elItem.innerHTML = `
            <div class="flex items-center gap-1 justify-between ${item.isCompleted ? " opacity-60" : "" }">
                <div class="w-[85%] flex items-center ml-3  ">
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
        
            <div class="flex items-center gap-5 mt-3 ${item.isCompleted ? " opacity-60" : "" }">
                <p class="font-light text-[12px] font-Mono ml-5 ">Created 05 Mar 2026 20:33</p>
                <div class="flex items-center gap-1 text-white !text-[#7f1d1d] bg-[rgba(239,68,68,0.30)] px-2 p-1 rounded-xl">
                    <img src="./images/clock-icon.svg" alt="clock-icon" width="15" height="15">
                    <p class="font-light text-[12px] font-Mono ">Overdue 08 Mar 2026 17:00</p>
                </div>
            </div>
        `
        elList.appendChild(elItem)
        
    });
    
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
    localStorage.setItem("setTodo", JSON.stringify(todo))
}
// delete function start 


// complete start 
function handleCompletedBtn(id){
    const findCompletedObj = todo.find(item => item.id == id)
    findCompletedObj.isCompleted = !findCompletedObj.isCompleted
    applyCurrentFilter()
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