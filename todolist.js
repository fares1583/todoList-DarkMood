let input = document.querySelector("input");
let add = document.querySelector(".button");
let taskList = document.querySelector("#task-list");
let deleteAll = document.querySelector(".deleteAll");
let tasksLength = document.querySelector(".task-todo");
let doneLength = document.querySelector(".done-task-count");
let doneBtn = document.querySelector(".done-button");
let arr = [];

if (window.localStorage.getItem("task")) {
  arr = JSON.parse(localStorage.getItem("task"));
}

getDataFromLocalStor();

add.onclick = function () {
  input.value = input.value.trim();
  if (input.value != "" && input.value.length >= 3) {
    addTaskToArr(input.value);
    input.value = "";
    input.focus();
  }
};

function addTaskToArr(task) {
  let date = new Date();

  let formattedDate =
    ("0" + date.getDate()).slice(-2) +
    "-" +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    "-" +
    date.getFullYear() +
    " " +
    ("0" + date.getHours()).slice(-2) +
    ":" +
    ("0" + date.getMinutes()).slice(-2) +
    ":" +
    ("0" + date.getSeconds()).slice(-2);

  let taskObj = {
    id: formattedDate,
    title: task,
    completed: false,
  };

  arr.push(taskObj);

  // Add element to page
  addEleToPage(arr);

  // Add task to local storage
  addTaskToLocalStor(arr);
  tasksLength.textContent = `Tasks to do - ${arr.length}`;
}

// Create length of tasks
tasksLength.textContent = `Tasks to do - ${arr.length}`;

// Update done length
doneLength.textContent = `Done - ${
  document.querySelectorAll("#done-task-list li").length
}`;

deleteAll.onclick = function () {
  taskList.innerHTML = "";
  document.querySelector("#done-task-list").innerHTML = "";
  arr = [];
  window.localStorage.clear();
  tasksLength.textContent = `Tasks to do - ${arr.length}`;
  doneLength.textContent = `Done - ${
    document.querySelectorAll("#done-task-list li").length
  }`;
};

function addEleToPage(arr) {
  taskList.innerHTML = "";
  let doneTaskList = document.querySelector("#done-task-list");
  doneTaskList.innerHTML = "";
  arr.forEach((task) => {
    let li = document.createElement("li");
    li.appendChild(document.createTextNode(task.title));
    li.setAttribute("data-id", task.id);

    if (arr.length > 1) {
      deleteAll.style.display = "inline";
    } else {
      deleteAll.style.display = "none";
    }

    let date = document.createElement("span");
    date.appendChild(document.createTextNode(task.id));
    date.style.fontSize = "10px";

    let deleteImg = document.createElement("img");
    deleteImg.className = "delete-button";
    deleteImg.src = "./images/TrashSimple.svg";

    let doneImg = document.createElement("img");
    doneImg.className = "done-button";
    doneImg.src = "images/check.svg";

    let innerDiv = document.createElement("div");
    console.log(li.classList.contains("done"));

    if (task.completed) {
      let doneTaskList = document.querySelector("#done-task-list");
      doneTaskList.appendChild(li);

      if (li.lastElementChild) {
        li.lastElementChild.firstChild.remove();
      }
    } else {
      li.className = "done";
      li.appendChild(date);
      innerDiv.appendChild(doneImg);
      innerDiv.appendChild(deleteImg);
      li.appendChild(innerDiv);
      taskList.appendChild(li);
    }
  });
  tasksLength.textContent = `Tasks to do - ${taskList.children.length}`;
  doneLength.textContent = `Done - ${doneTaskList.children.length}`;
}

// Handle done elements
// document.querySelectorAll(".done").forEach((li) => {
//   if (li.classList.contains("done")) {
//     let doneTaskList = document.querySelector("#done-task-list");
//     doneTaskList.appendChild(li);

//     if (li.lastElementChild) {
//       li.lastElementChild.firstChild.remove();
//     }
//   }
//   doneLength.textContent = `Done - ${
//     document.querySelectorAll("#done-task-list li").length
//   }`;
// });

console.log(document.querySelectorAll(".done"));

tasksLength.textContent = `Tasks to do - ${
  document.querySelector("#task-list").children.length
}`;

function addTaskToLocalStor() {
  window.localStorage.setItem("task", JSON.stringify(arr));
}

function getDataFromLocalStor() {
  let dataFromLocalStor = window.localStorage.getItem("task");
  if (dataFromLocalStor) {
    let task = JSON.parse(dataFromLocalStor);
    arr = task; // Restore the array of tasks
    addEleToPage(arr); // Rebuild the task lists based on the task data
  }
}

// Remove task from page
taskList.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-button")) {
    e.target.parentElement.parentElement.remove();

    tasksLength.textContent = `Tasks to do - ${
      document.querySelectorAll("#task-list li").length
    }`;

    // Remove task from local storage
    removeTaskLocalStor(
      e.target.parentElement.parentElement.getAttribute("data-id")
    );
  } else if (e.target.classList.contains("done-button")) {
    e.target.parentElement.parentElement.classList.add("done");

    // let doneTaskList = document.querySelector("#done-task-list");
    taskDone(e.target.parentElement.parentElement.getAttribute("data-id"));
    // doneTaskList.appendChild(e.target.parentElement.parentElement);

    tasksLength.textContent = `Tasks to do - ${
      document.querySelectorAll("#task-list li").length
    }`;
    doneLength.textContent = `Done - ${
      document.querySelectorAll("#done-task-list li").length
    }`;
  }
});

function removeTaskLocalStor(taskId) {
  arr = arr.filter((e) => e.id !== taskId);
  addTaskToLocalStor(arr);
}

// Mark task as done
function taskDone(taskId) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id == taskId) {
      arr[i].completed = !arr[i].completed;
    }
  }
  addTaskToLocalStor(arr);
  addEleToPage(arr);
}
