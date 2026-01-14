let todo = JSON.parse(localStorage.getItem("todo")) || [];

const taskInput = document.getElementById("taskInput");
const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");
const taskCount = document.getElementById("taskCount");
const addButton = document.querySelector(".btnAdicionar");
const deleteButton = document.getElementById("btnExcluir");

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  addButton.addEventListener("click", addTask);
  taskInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addTask();
  });
  deleteButton.addEventListener("click", deleteAllTasks);
  displayTasks();
});

function addTask() {
  const newTask = taskInput.value.trim();
  if (newTask) {
    todo.push({ text: newTask, completed: false });
    saveToLocalStorage();
    taskInput.value = "";
    displayTasks();
  }
}

function displayTasks() {
  pendingTasks.innerHTML = "";
  completedTasks.innerHTML = "";

  todo.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <input type="checkbox" ${item.completed ? "checked" : ""}>
      <span class="${item.completed ? "disabled" : ""}">${item.text}</span>
    `;

    const checkbox = li.querySelector("input");
    const span = li.querySelector("span");

    checkbox.addEventListener("change", () => toggleTask(index));
    span.addEventListener("click", () => editTask(index));

    if (item.completed) {
      completedTasks.appendChild(li);
    } else {
      pendingTasks.appendChild(li);
    }
  });

  const pendingCount = todo.filter(t => !t.completed).length;
  taskCount.textContent = pendingCount;
}

function toggleTask(index) {
  todo[index].completed = !todo[index].completed;
  saveToLocalStorage();
  displayTasks();
}

function editTask(index) {
  const list = todo[index].completed ? completedTasks : pendingTasks;
  const li = list.children[index >= list.children.length ? list.children.length - 1 : index];
  const span = li.querySelector("span");

  const input = document.createElement("input");
  input.type = "text";
  input.value = todo[index].text;

  span.replaceWith(input);
  input.focus();

  input.addEventListener("blur", saveEdit);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") saveEdit();
  });

  function saveEdit() {
    const newText = input.value.trim();
    if (newText) {
      todo[index].text = newText;
      saveToLocalStorage();
    }
    displayTasks();
  }
}

function deleteAllTasks() {
  todo = [];
  saveToLocalStorage();
  displayTasks();
}

function saveToLocalStorage() {
  localStorage.setItem("todo", JSON.stringify(todo));
}
