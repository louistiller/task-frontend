const API_BASE_ONLINE = "https://task-api-u38p.onrender.com";
const API_BASE_LOCAL = "http://192.168.178.110:8080";
const local = false;
const API_BASE = local ? API_BASE_LOCAL : API_BASE_ONLINE;
const API_URL = `${API_BASE}/tasks`;
const taskList = document.getElementById("taskList");
const addButton = document.getElementById("addButton")
const taskTitle= document.getElementById("taskTitle");
const allButton = document.getElementById("allButton");
const openButton = document.getElementById("openButton");
const completedButton = document.getElementById("completedButton");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const sortSelect= document.getElementById("sortSelect");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const registerButton = document.getElementById("registerButton");
const loginButton = document.getElementById("loginButton");
const authContainer = document.querySelector(".auth");
const appContainer = document.getElementById("app");
let currentFilter= "all";
let currentSearch="";

searchButton.addEventListener("click", function () {
    currentSearch=searchInput.value.toLowerCase();
        loadTasks();
    
});

sortSelect.addEventListener("change", function () {
    loadTasks();
});

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

async function register() {
    try {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: usernameInput.value,
                password: passwordInput.value
            })
        });

        if (!response.ok) {
            throw new Error("Registrierung fehlgeschlagen");
        }

        alert("Registrierung erfolgreich");

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

registerButton.addEventListener("click", register);

async function login() {
    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                username: usernameInput.value,
                password: passwordInput.value
            })
        });

        if (!response.ok) {
            throw new Error("Login fehlgeschlagen");
        }

    authContainer.style.display = "none";
appContainer.style.display = "block";

        alert("Login erfolgreich");
        await loadTasks();

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

loginButton.addEventListener("click", login);

async function addTask(){const title= taskTitle.value;
    try{
    const response=await fetch(API_URL, {
        method: "POST",
    headers:{"Content-Type":"application/json"},
    credentials: "include", 
body: JSON.stringify({title: title})});
console.log(response.status);
if(!response.ok){
throw new Error("Aufgabe konnte nicht erstellt werden");
}
taskTitle.value="";
await loadTasks();
}
catch(error){
    console.error(error);
    alert("Fehler beim hinzufügen der Aufgabe: " + error.message);
}}

addButton.addEventListener("click", addTask);

async function deleteTask(id){
    try{
    const response= await fetch(`${API_URL}/${id}`,{
        method:"DELETE",
    credentials: "include"});
console.log(response.status);

if(!response.ok){
    throw new Error("Aufgabe konnte nicht gelöscht werden");
}

await loadTasks();
    }
    catch(error){
        console.error(error);
        alert("Fehler beim Löschen der Aufgabe: " + error.message);
    }
}

async function updateTask(id, title, completed){
    try{
const response= await fetch(`${API_URL}/${id}`,{
    method:"PUT",
    headers:{"Content-Type":"application/json"},
    credentials: "include",
    body: JSON.stringify({title:title, completed:completed})
});
console.log(response.status);
if(!response.ok){
    throw new Error("Aufgabe konnte nicht aktualisiert werden");
}
await loadTasks();

}
catch(error){
    console.error(error);
    alert("Fehler beim Aktualisieren der Aufgabe: " + error.message);
}
}

async function loadTasks() {
try{
    taskList.innerHTML = `
    <li class="loading">
        <span class="spinner"></span>
        Lade Aufgaben...
    </li>
`;
    const response = await fetch(`${API_URL}?size=50`, {
        credentials: "include"
    });

    if (!response.ok){
        throw new Error("Fehler beim Laden der Aufgaben");
    }
    const page = await response.json();

    taskList.innerHTML = "";

    let tasks= page.content;

    const searchText=searchInput.value.toLowerCase();

    if (currentFilter === "open") {
    tasks = tasks.filter(task => !task.completed);
}

if (currentFilter === "completed") {
    tasks = tasks.filter(task => task.completed);
}

const sortValue = sortSelect.value;

if (sortValue === "newest") {
    tasks.sort((a, b) => b.id - a.id);
}

if (sortValue === "oldest") {
    tasks.sort((a, b) => a.id - b.id);
}

if (sortValue === "az") {
    tasks.sort((a, b) => a.title.localeCompare(b.title));
}

if (sortValue === "za") {
    tasks.sort((a, b) => b.title.localeCompare(a.title));
}

if(currentSearch !== ""){
tasks= tasks.filter(task=> task.title.toLowerCase().includes(searchText));}

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
}catch(error){
console.error(error);
taskList.innerHTML= "<li>Fehler beim Laden der Aufgaben.</li>";
}
}