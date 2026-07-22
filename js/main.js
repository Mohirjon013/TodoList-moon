import { auth, db, provider, signInWithPopup, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged, collection, doc, setDoc, deleteDoc, onSnapshot, getDoc } from "./firebase.js"

// Selecting elements
const loginScreen = document.getElementById("login-screen")
const googleLoginBtn = document.getElementById("google-login-btn")

let currentUserId = null


const elTodoForm = document.querySelector(".todo-form")
const elTodoInput = document.querySelector(".todo-input")
const elTodoDue = document.querySelector(".todo-due")
const elList = document.querySelector(".todo-list")

const elAllList = document.querySelector(".all-list")
const elProgressList = document.querySelector(".progress-list")
const elDoneList = document.querySelector(".done-list")

const telegramBtn = document.getElementById("telegram-btn")
const telegramBtnText = document.getElementById("telegram-btn-text")
const finishDayBtn = document.getElementById("finish-day-btn")

const progressBar = document.querySelector(".progress")
const stateNumber = document.querySelector(".numbers")

const elModalWrapper = document.querySelector(".modal-wrapper")
const elModalContent = document.querySelector(".modal-content")

const todayDate = document.querySelector(".today-date")

let currentFilter = 'all'

let todo = []

elAllList.addEventListener("click", handleAllListBox)
elProgressList.addEventListener("click", handleProgressListBox)
elDoneList.addEventListener("click", handleDoneListBox)


// Toast start
function showToast(msg) {
    const toast = document.getElementById("toast")
    toast.textContent = msg
    toast.classList.remove("opacity-0")
    toast.classList.add("opacity-100")
    setTimeout(() => {
        toast.classList.remove("opacity-100")
        toast.classList.add("opacity-0")
    }, 3000)
}
// Toast end


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
let date = new Date()
let dateYear = date.getFullYear()
let dateMonth = new Date().toLocaleString('en-US', { month: 'long' })
let dateWeek = new Date().toLocaleString('en-US', { weekday: 'short' })
let dateday = date.getDate()
todayDate.firstElementChild.innerHTML = `${dateWeek} ${dateday} ${dateMonth}`
// Today date end


// apply filter start
function applyCurrentFilter(){
    if(currentFilter === "done"){
        renderTodo(todo.filter(item => item.isCompleted))
    }
    else if(currentFilter == "progress"){
        renderTodo(todo.filter(item => !item.isCompleted))
    }
    else{
        renderTodo(todo)
    }
}
// apply filter end


// add todo start 
elTodoForm.addEventListener("submit", async(e) => {
    e.preventDefault()
    
    if(elTodoInput.value.trim() == ""){
        alert("Text title cannot be empty")
        return
    }
    
    let date = new Date()
    
    let dateYear = date.getFullYear()
    let dateMonth = date.toLocaleString('en-US', { month: 'long' })
    let dateday = date.getDate()
    let dateHour = date.getHours()
    let dateMin = date.getMinutes()

    const maxOrder = todo.length > 0 ? Math.max(...todo.map(t => t.order ?? 0)) : -1
    
    const data = {
        id: Date.now(),
        value: elTodoInput.value.trim(),
        due: elTodoDue.value || null,
        order: maxOrder + 1,
        createdTime:{
            dateYear,dateMonth,dateday,dateHour, dateMin
        },
        completedTime:null,
        isCompleted: false,
    }
    
    await saveTodo(data)
    
    elTodoDue.type = 'text'
    elTodoDue.placeholder = 'Due date (optional)'
    e.target.reset()
})
elTodoInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault(); 
        elTodoForm.requestSubmit();
    }
});
// add todo end 


// render todo start
function renderTodo(arr){
    const fragment = document.createDocumentFragment()
    
    if (arr.length === 0) {
        const li = document.createElement("li")
        li.className = "text-center text-slate-100 sm:text-[#193664] py-4.5 min-[410px]:py-5 sm:py-6 font-family text-[18px] min-[410px]:text-[20px] sm:text-[22px] opacity-60 select-none"
        li.textContent = "No tasks yet — add one above ↑"
        
        elList.replaceChildren(li)
        progressTask()
        elAllList.lastChild.textContent = todo.length
        elProgressList.lastChild.textContent = todo.filter(item => !item.isCompleted).length
        elDoneList.lastChild.textContent = todo.filter(item => item.isCompleted).length
        return
    }
    
    arr.forEach((item, index) => {
        if (!item.createdTime) return
        const now = new Date()
        const dueDate = item.due ? new Date(item.due) : null;
        const isOverdue = dueDate && dueDate < now
        
        const createdTimestamp = new Date(
            item.createdTime.dateYear,
            monthNameToNumber(item.createdTime.dateMonth),
            item.createdTime.dateday,
            item.createdTime.dateHour,
            item.createdTime.dateMin  
        ).getTime()
        const timeTaken = item.completedTime ? item.completedTime - createdTimestamp : null
        let elItem = document.createElement("li")
        elItem.className = "w-[98%] sm:p-2 p-1 sm:pt-2 pt-1.5 sm:pl-1 pl-0 sm:px-1 px-1.5 pb-1.5 rounded-xl bg-gray-200 shadow-[0_3px_8px_rgba(0,0,0,0.5)]"
        elItem.dataset.id = item.id
        
        elItem.innerHTML = `
            <div class="flex items-start gap-1 justify-between ${item.isCompleted ? " opacity-60" : "" }">
                <div class="flex-1 min-w-0 flex items-start">
                    <div class="flex items-center flex-shrink-0 gap-2 ml-2">
                        <div class="py-4 -my-4  drag-handle cursor-grab select-none">
                            <span class="text-gray-400 text-[23px] sm:text-[25px]">⠿</span>
                        </div>
                        <span class="num-span select-none flex-shrink-0 font-semibold max-[370px]:text-[17px] max-[410px]:text-[18px] sm:text-[24px] font-Mono">${index + 1}.</span>
                    </div>
                    <p class="flex-1 min-w-0 sm:ml-1 ml-0 max-[370px]:text-[15px] max-[410px]:text-[16px] sm:text-[22px] font-family sm:mt-0 mt-0.5 break-words ${item.isCompleted ? "line-through opacity-45" : ""}">${item.value}</p>
                </div>
                    
                <div class="flex-shrink-0 flex gap-1">
                    <button class="complete-btn hover:scale-115 duration-400 cursor-pointer ${item.isCompleted ? "hidden" : "block" }">
                        <img class="w-[25px] h-[25px] min-[390px]:w-[29px] min-[390px]:h-[29px] sm:w-[37px] sm:h-[37px]" src="./images/done-icon.svg" alt="done-icon" width="37" height="37">
                    </button>
                    <button class="undo-btn hover:scale-115 duration-400 cursor-pointer ${item.isCompleted ? "block" : "hidden" } ">
                        <img class="w-[25px] h-[25px] min-[390px]:w-[29px] min-[390px]:h-[29px] sm:w-[37px] sm:h-[37px]" src="./images/complete-icon.svg" alt="done-icon" width="37" height="37">
                    </button>
                    <button class="delete-btn hover:scale-115 duration-400 cursor-pointer" type="button">
                        <img class="w-[25px] h-[25px] min-[390px]:w-[29px] min-[390px]:h-[29px] sm:w-[37px] sm:h-[37px]" src="./images/delete-icon.svg" alt="de-icon" width="37" height="37">
                    </button>
                    <button type="button" class="update-btn ${item.isCompleted ? 'opacity-50 cursor-not-allowed' : "hover:scale-115 duration-400 cursor-pointer"}" ${item.isCompleted ? 'disabled' : ""} >
                        <img class="w-[23px] h-[23px] min-[390px]:w-[27px] min-[390px]:h-[27px] sm:w-[35px] sm:h-[35px]" src="./images/edit-icons.svg" alt="edit-icon" width="36" height="36">
                    </button>
                </div>
            </div>
        
            <div class="flex sm:flex-nowrap flex-wrap items-center ml-2 sm:mt-3 mt-2 sm:justify-start justify-between gap-0.5 sm:gap-4 ${item.isCompleted ? "opacity-60" : ""}">
        
        
                <p class="text-[7px] min-[381px]:text-[9px] sm:text-[11px] font-Mono sm:py-0 py-1">Created: ${String(item.createdTime.dateday).padStart(2,0)} ${item.createdTime.dateMonth} ${item.createdTime.dateYear} ${String(item.createdTime.dateHour).padStart(2,0)}:${String(item.createdTime.dateMin).padStart(2,0)} </p>
        
                ${item.isCompleted && timeTaken ? `
                    <p class="text-[7px] min-[381px]:text-[9px] sm:text-[11px] font-Mono bg-[rgba(34,197,94,0.30)] sm:px-2 px-1 p-1 rounded-lg">Completed in: ${formatTimeTaken(timeTaken)} </p>
                    ${item.due && item.completedTime > new Date(item.due).getTime() ? `
                        <div class="flex items-center gap-1 !text-[#7f1d1d] bg-[rgba(239,68,68,0.30)] sm:px-2 px-1 p-1 rounded-lg">
                            <img class="sm:w-[15px] w-[11px] h-[11px] sm:h-[15px]" src="./images/alert-icon.svg" alt="alert-icon" width="15" height="15">
                            <p class="text-[7px] min-[381px]:text-[9px] sm:text-[11px] font-Mono">Completed: ${formatTimeTaken(item.completedTime - new Date(item.due).getTime())} late</p>
                        </div>
                    ` : ''}
                ` : ""}
        
                ${item.due && !item.isCompleted ? `
                    <div class="flex items-center gap-1 text-white ${isOverdue ? "!text-[#7f1d1d] bg-[rgba(239,68,68,0.30)]" : "bg-[rgba(50,125,180,0.30)] !text-[#255867]"} sm:px-2 px-1 p-1 rounded-lg">
                        <img class="sm:w-[15px] w-[11px] h-[11px] sm:h-[15px]" src="${isOverdue ? "./images/warning-icon.svg" : "./images/clock-icon.svg"}"  alt="clock-icon" width="15" height="15">
        
        
                        <p class="text-[7px] min-[381px]:text-[9px] sm:text-[11px] font-Mono !tracking-tighter whitespace-nowrap">${isOverdue ? 'Overdue:' : 'Due:'} ${new Date(item.due).toLocaleString('en-US', {month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit'}).replace("," , "")}</p>
                    </div>
                ` : ''}
            </div>
        `
        fragment.appendChild(elItem)
        
    });
    
    elList.replaceChildren(fragment)
    progressTask()
    elAllList.lastChild.textContent = todo.length
    elProgressList.lastChild.textContent = todo.filter(item => !item.isCompleted).length
    elDoneList.lastChild.textContent = todo.filter(item => item.isCompleted).length
}
renderTodo(todo)
// render todo end

elList.addEventListener("click", (e) => {  
    const li = e.target.closest("li")  
    if (!li) return  
    
    const id = Number(li.dataset.id)  
    
    if (e.target.closest(".delete-btn")) {  
        handleDeleteBtn(id)  
    }  
    
    if (e.target.closest(".complete-btn")) {  
        handleCompletedBtn(id)  
    }  
    
    if (e.target.closest(".undo-btn")) {  
        handleCompletedBtn(id)  
    }  
    
    if (e.target.closest(".update-btn")) {  
        handleUpdateBtn(id)  
    }  
})

// Update function start
function handleUpdateBtn(id){
    elModalWrapper.classList.remove("scale-0")
    document.body.classList.add("overflow-y-hidden")
    
    const findedUpdatedItem = todo.find(item => item.id === id)
    elModalContent.innerHTML = `
        <form class="update-form max-w-[500px] mx-auto px-4 mb-3">
            <label class="w-full">
                <span class="inline-block text-[23px] font-family mb-1">Task Description</span>
                <input class="update-input w-full p-2 bg-white font-family text-[21px] rounded-xl outline-none focus:shadow-md focus:shadow-zinc-600 duration-400 shadow-[0_3px_8px_rgba(0,0,0,0.5)]" 
                    type="text" 
                    value="${findedUpdatedItem.value}" 
                    name="inputValue" 
                    placeholder="Add new task..." 
                    required aria-label="add new task" 
                    autocomplete="off">
            </label>
                
            <label class="w-full inline-block mt-5">
                <span class="inline-block text-[23px] font-family mb-1">Due Date</span>
                <input class="update-due w-full text-[21px] p-2 pl-3 bg-white font-family rounded-xl outline-none focus:shadow-md focus:shadow-zinc-600 duration-400 shadow-[0_3px_8px_rgba(0,0,0,0.5)]" type="datetime-local" value="${findedUpdatedItem.due || ''}" name="inputDue" autocomplete="off">
            </label>
                    
            <div class="mt-9 flex items-center justify-between">
                <button type="submit" class="w-[65%] text-white py-2 bg-mist-700 rounded-lg shadow-[0_3px_8px_rgba(0,0,0,0.5)] cursor-pointer border-2 border-white/18">Save Changes</button>
                <button type="button" class=" cancel-btn w-[30%] text-mist-700 py-2 bg-white rounded-lg shadow-[0_3px_8px_rgba(0,0,0,0.5)] cursor-pointer border-2 border-mist-500">Cancel</button>
            </div>
        </form>
    `
    elModalContent.querySelector(".cancel-btn").addEventListener("click", handleCancelBtn)
    
    if (!findedUpdatedItem.due) {
        setupDuePlaceholder(document.querySelector('.update-due'))
    }
    let elUpdateForm = document.querySelector(".update-form")
    
    elUpdateForm.onsubmit = async(e) => {
        e.preventDefault()
        
        findedUpdatedItem.value = e.target.inputValue.value
        findedUpdatedItem.due = e.target.inputDue.value || null
        
        await saveTodo(findedUpdatedItem)
        
        elModalWrapper.classList.add("scale-0")
        document.body.classList.remove("overflow-y-hidden")
    }
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
// Update function end 


// delete function start 
async function handleDeleteBtn(id) {
    const todoRef = doc(db, "users", currentUserId, "todos", String(id))
    await deleteDoc(todoRef)
}
// delete function end 


// complete start 
async function handleCompletedBtn(id){
    const findCompletedObj = todo.find(item => item.id === id)
    findCompletedObj.isCompleted = !findCompletedObj.isCompleted
    findCompletedObj.completedTime = findCompletedObj.isCompleted ? Date.now() : null
    
    const allDone = todo.length > 2 && todo.every(item => item.isCompleted)
    if (allDone) fireConfetti()
        
    await saveTodo(findCompletedObj)
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
    stateNumber.textContent = `${completeTask} / ${totalTask}`
}
// progress Bar end


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
let confettiInterval = null

const fireConfetti = () => {
    if (confettiInterval) clearInterval(confettiInterval)
        
    playSuccessSound()
    
    const startTime = Date.now()
    
    confettiInterval = setInterval(() => {
        const elapsed = Date.now() - startTime
        if (elapsed >= 8000) {
            clearInterval(confettiInterval)
            confettiInterval = null
            return
        }
        
        confetti({ particleCount: 15, angle: 60,  spread: 70, origin: { x: 0,   y: 0.8 } })
        confetti({ particleCount: 15, angle: 120, spread: 70, origin: { x: 1,   y: 0.8 } })
        confetti({ particleCount: 10, angle: 90,  spread: 100, origin: { x: 0.5, y: 0  } })
    }, 300)
}
// Confetti animation end


// Sound start
let currentAudio = null

function playSuccessSound() {
    if (currentAudio) {
        currentAudio.pause()
        currentAudio.currentTime = 0
    }
    currentAudio = new Audio("./sound/fireworks.mp3")
    currentAudio.volume = 0.8
    currentAudio.play()
    
    setTimeout(() => {
        currentAudio.pause()
        currentAudio.currentTime = 0
    }, 8000)
}
// Sound end


// Reliable due date placeholder start
setupDuePlaceholder(document.querySelector('.todo-due'))

function setupDuePlaceholder(input) {
    if (!input) return
    
    if (!input.value) {
        input.type = 'text'
        input.placeholder = 'Due date (optional)'
    }
    
    input.addEventListener('focus', function () {
        this.type = 'datetime-local'
    })
    
    input.addEventListener('blur', function () {
        if (!this.value) {
            this.type = 'text'
            this.placeholder = 'Due date (optional)'
        }
    })
}
// Reliable due date placeholder end


// Drag to reorder start
Sortable.create(elList, {
    animation: 200,
    handle: '.drag-handle',
    ghostClass: 'opacity-30',
    
    onEnd: async function (evt) {
        if (currentFilter !== 'all') {
            applyCurrentFilter()
            alert("Reordering only works in All view.")
            return
        }
        if (evt.oldIndex === evt.newIndex) return
        
        const movedItem = todo.splice(evt.oldIndex, 1)[0]
        todo.splice(evt.newIndex, 0, movedItem)
        
        todo.forEach((item, i) => { item.order = i })
        for (const item of todo) { await saveTodo(item) }
        
        elList.querySelectorAll('li[data-id]').forEach((li, i) => {
            const numSpan = li.querySelector('.num-span')
            if (numSpan) numSpan.textContent = (i + 1) + '.'
        })
    }
})
// Drag to reorder end



// --------------------------------- Sign In and Out --------------------

// login IN start
googleLoginBtn.addEventListener("click", async () => {
    try {
        provider.setCustomParameters({ prompt: 'select_account' })
        await signInWithPopup(auth, provider)
    } catch (err) {
        if (err.code === 'auth/popup-blocked' || err.code === 'auth/popup-closed-by-user') {
            await signInWithRedirect(auth, provider)
        }
        console.error("Login error:", err)
    }
})

getRedirectResult(auth).then((result) => {
    if (result?.user) {
        loginScreen.style.display = "none"
        document.body.style.overflow = ""
    }
}).catch(err => console.error(err))

onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUserId = user.uid
        loginScreen.style.display = "none"
        document.body.style.overflow = ""
        loadTodos()
    } else {
        currentUserId = null
        loginScreen.style.display = "flex"
        document.body.style.overflow = "hidden"
        todo = []
        renderTodo([])
    }
})
// login IN end


// login Out start
const logoutBtn = document.getElementById("logout-btn")
logoutBtn.addEventListener("click", async () => {
    await signOut(auth)
})
// login Out end


// Telegram connect start
let telegramOpened = false
telegramBtn.addEventListener("click", async () => {
    
    if (!telegramOpened) {
        window.open("https://t.me/momentum_todo_bot?start=hi", "_blank")
        telegramOpened = true
        telegramBtnText.textContent = "Enter Chat ID"
        return
    }
    
    const current = await loadChatId()
    const msg = current 
    ? `Enter new chat_id (current: ${current}):`
    : `1. Open @momentum_todo_bot and press /start\n2. Enter the chat_id you received:`
    
    const chatId = prompt(msg)
    if (!chatId) return
    await saveChatId(chatId.trim())
    telegramBtnText.textContent = "Telegram ✅"
})

finishDayBtn.addEventListener("click", async () => {
    const chatId = await loadChatId()
    if (!chatId) {
        showToast("⚠️ Please connect Telegram first!")
        return
    }

    if(todo.length === 0){
        showToast("🚫 No tasks to report!")
        return
    }
    
    const now = new Date()
    const dateStr = now.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    
    let message = `📅 <b>Daily Report — ${dateStr}</b>\n\n`
    
    todo.forEach((item, i) => {
        message += `${i + 1}. ${item.value} ${item.isCompleted ? "✅" : "❌"}\n`
    })
    
    const completed = todo.filter(item => item.isCompleted).length
    message += `\n📊 <b>Completed: ${completed} / ${todo.length}</b>`
    
    await fetch("https://todo-list-moon.vercel.app/api/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId, message })
    })
    
    for (const item of todo) {
        const todoRef = doc(db, "users", currentUserId, "todos", String(item.id))
        await deleteDoc(todoRef)
    }
    
    showToast("✅ Sent to Telegram!")
})
// Telegram connect end


// loadTodos start
function loadTodos() {
    const todosRef = collection(db, "users", currentUserId, "todos")
    onSnapshot(todosRef, (snapshot) => {
        todo = snapshot.docs.map(doc => doc.data())
        todo.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        applyCurrentFilter()
    })
    
    loadChatId().then(chatId => {
        if (chatId) {
            telegramBtnText.textContent = "Telegram ✅"
        }
    })
}
// loadTodos end


// save todo start
async function saveTodo(item) {
    const todoRef = doc(db, "users", currentUserId, "todos", String(item.id))
    await setDoc(todoRef, item)
}
// save todo end


// Save chatId start
async function saveChatId(chatId) {
    const userRef = doc(db, "users", currentUserId, "profile", "telegram")
    await setDoc(userRef, { chatId })
}

async function loadChatId() {
    const userRef = doc(db, "users", currentUserId, "profile", "telegram")
    const snap = await getDoc(userRef)
    return snap.exists() ? snap.data().chatId : null
}
// Save chatId end