const API_URL = "https://task-api-u38p.onrender.com/tasks?size=50";
const taskList = document.getElementById("taskList");
const addButton = document.getElementById("addButton")
const taskTitle= document.getElementById("taskTitle");

async function addTask(){const title= taskTitle.value;
    const response=await fetch(API_URL, {
        method: "POST",
    headers:{"Content-Type":"application/json"}, 
body: JSON.stringify({title: title})});
console.log(response.status);
if(response.ok){
taskTitle.value="";
await loadTasks()
}
}
addButton.addEventListener("click", addTask);


async function loadTasks() {

    const response = await fetch(API_URL, {
    cache: "no-store"
});

    const page = await response.json();

    taskList.innerHTML="";

    for(const task of page.content){
        const listItem = document.createElement("li");
        listItem.textContent= task.title;
        taskList.appendChild(listItem);
    }

    console.log(page.content);

}
loadTasks();