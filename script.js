const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");

const errorText = document.querySelector("#error-text");

const todoList = document.querySelector("#todo-list");

const taskCounter = document.querySelector("#task-counter");



let todos = [];



try {
    const saved = localStorage.getItem("todos");
    todos = JSON.parse(saved) || [];
} catch (error) {
    console.log("Could not read saved to do list.");
};



function save() {
    const todosText = JSON.stringify(todos);
    localStorage.setItem("todos", todosText)
};



function createTextElement(tag, text) {
    const element = document.createElement(tag);
    element.textContent = text;
    return element;
};



function render() {
    todoList.textContent = "";

    let doneCounter = todos.filter(todo => todo.done).length;
    let totalTasks = todos.length;
    taskCounter.textContent = `${doneCounter} tasks done of ${totalTasks} total`;

    for (let i = 0; i < todos.length; i++) {

        const todoLi = createTextElement("li", "");
        todoLi.classList.add("todoStyle");

        const taskText = createTextElement("span", todos[i].task)

        if (todos[i].done) {
            taskText.classList.add("todoDone");
        }

        taskText.addEventListener("click", function (event) {
            event.stopPropagation();
            todos[i].done = !todos[i].done;
            save();
            render();
        });

        const xBtn = createTextElement("button", "X");
        xBtn.classList.add("btnStyle");

        xBtn.addEventListener("click", function (event) {
            event.stopPropagation();
            todos.splice(i, 1);
            save();
            render();
        });

        todoLi.appendChild(taskText)
        todoLi.appendChild(xBtn)
        todoList.appendChild(todoLi);
    }
};

render();



todoForm.addEventListener("submit", function (event) {
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

    save()
    render();
});



