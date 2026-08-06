const API_URL = "https://task-api-u38p.onrender.com/tasks";
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

    for(const task of page.content){
        const listItem = document.createElement("li");
        listItem.textContent= task.title +", "+ task.completed;
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Löschen";
        deleteButton.addEventListener("click", () => deleteTask(task.id));
        const completeButton= document.createElement("button");
        completeButton.textContent= "Erledigt";
        completeButton.addEventListener("click", function(){
            updateTask(task.id, task.title, !task.completed);
        })
        listItem.appendChild(deleteButton);
        listItem.appendChild(completeButton);
        taskList.appendChild(listItem);
    }

    console.log(page.content);

}
loadTasks();