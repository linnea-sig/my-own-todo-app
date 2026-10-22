const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");

const errorText = document.querySelector("#error-text");

const todoList = document.querySelector("#todo-list");

const taskCounter = document.querySelector("#task-counter");

let todos = [];




todoForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const todoText = todoInput.value.trim();

    if (todoText === "") {
        errorText.textContent = "Please enter a to do!";
        return;
    }

    if (todoText.length < 2) {
        errorText.textContent = "To do must be longer than one character!";
        return; 
    }

    errorText.textContent = "";


    const todoObj = {
        task: todoText,
        done: false
    }

    todos.push(todoObj);
    todoInput.value = "";
});

console.log(todos);