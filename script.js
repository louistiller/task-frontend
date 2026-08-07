const API_URL = "https://task-api-u38p.onrender.com/tasks";
const taskList = document.getElementById("taskList");
const addButton = document.getElementById("addButton")
const taskTitle= document.getElementById("taskTitle");
const allButton = document.getElementById("allButton");
const openButton = document.getElementById("openButton");
const completedButton = document.getElementById("completedButton");
let currentFilter= "all";

allButton.classList.add("active");

allButton.addEventListener("click", function () {
    currentFilter = "all";

    allButton.classList.add("active");
    openButton.classList.remove("active");
    completedButton.classList.remove("active");

    loadTasks();
});

openButton.addEventListener("click", function () {
    currentFilter = "open";

    allButton.classList.remove("active");
    openButton.classList.add("active");
    completedButton.classList.remove("active");

    loadTasks();
});

completedButton.addEventListener("click", function () {
    currentFilter = "completed";

    allButton.classList.remove("active");
    openButton.classList.remove("active");
    completedButton.classList.add("active");

    loadTasks();
});

async function addTask(){const title= taskTitle.value;
    const response=await fetch(API_URL, {
        method: "POST",
    headers:{"Content-Type":"application/json"}, 
body: JSON.stringify({title: title})});
console.log(response.status);
if(response.ok){
taskTitle.value="";
await loadTasks();
}
}
addButton.addEventListener("click", addTask);

async function deleteTask(id){
    const response= await fetch(`${API_URL}/${id}`,{
        method:"DELETE"});
console.log(response.status);

await loadTasks();
}

async function updateTask(id, title, completed){
const response= await fetch(`${API_URL}/${id}`,{
    method:"PUT",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({title:title, completed:completed})
});
console.log(response.status);
if(response.ok){
await loadTasks();
}
}

async function loadTasks() {

    const response = await fetch(`${API_URL}?size=50`);

    const page = await response.json();

    taskList.innerHTML = "";

    let tasks= page.content;

    if (currentFilter === "open") {
    tasks = tasks.filter(task => !task.completed);
}

if (currentFilter === "completed") {
    tasks = tasks.filter(task => task.completed);
}

    for(const task of tasks){
        const listItem = document.createElement("li");
        listItem.classList.add("task");
if (task.completed) {
    listItem.classList.add("completed");}
        listItem.textContent= task.title;
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Löschen";
        deleteButton.addEventListener("click", () => deleteTask(task.id));
        const completeCheckbox= document.createElement("input");
        completeCheckbox.type= "checkbox";
        completeCheckbox.checked = task.completed;
        completeCheckbox.addEventListener("change", function(){
            updateTask(task.id, task.title, completeCheckbox.checked);
        })
        const editButton = document.createElement("button");
editButton.textContent = "Bearbeiten";
editButton.addEventListener("click", function () {
const newTitle = prompt("Neuer Titel:", task.title);
 if (newTitle !== null && newTitle.trim() !== "") {
        updateTask(task.id, newTitle.trim(), task.completed);
    }
});

const actions= document.createElement("div");
actions.appendChild(deleteButton);
actions.appendChild(editButton);
        listItem.prepend(completeCheckbox);
        listItem.appendChild(actions);
        taskList.appendChild(listItem);
        deleteButton.classList.add("delete-button");
editButton.classList.add("edit-button");
actions.classList.add("actions");
    }

    console.log(page.content);

}
loadTasks();