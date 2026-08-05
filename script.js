const API_URL= "http://localhost:8080/tasks";

async function loadTasks() {

    const response = await fetch(API_URL);

    const page = await response.json();

    const taskList = document.getElementById("taskList");

    const listItem = document.createElement("li");

    listItem.textContent = page.content[0].title;

    taskList.appendChild(listItem);

    console.log(page.content);

}

loadTasks();