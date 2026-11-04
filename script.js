const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");

const errorText = document.querySelector("#error-text");

const todoList = document.querySelector("#todo-list");

const taskCounter = document.querySelector("#task-counter");

const clearBtn = document.querySelector("#clear-btn");
const clearDoneBtn = document.querySelector("#clear-done-btn");
const undoBtn = document.querySelector("#undo-btn");
const showAllBtn = document.querySelector("#show-all-btn");
const showActiveBtn = document.querySelector("#show-active-btn");
const showDoneBtn = document.querySelector("#show-done-btn");



let todos = [];
let deletedHistory = [];
let currentFilter = "all";
let clickTimer = null;



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

    let filteredTodos = todos;
    if (currentFilter === "active") {
        filteredTodos = todos.filter(todo => !todo.done);
    } else if (currentFilter === "done") {
        filteredTodos = todos.filter(todo => todo.done);
    }

    for (let i = 0; i < filteredTodos.length; i++) {
        const todo = filteredTodos[i];

        const todoLi = createTextElement("li", "");
        todoLi.classList.add("todoStyle");

        const taskText = createTextElement("span", todo.task)

        if (todo.done) {
            taskText.classList.add("todoDone");
        }

        taskText.addEventListener("click", function (event) {
            event.stopPropagation();

            if (clickTimer !== null) {
                clearTimeout(clickTimer);
                clickTimer = null;
                return;
            }

            clickTimer = setTimeout(function () {
                clickTimer = null;

                todo.done = !todo.done;
                save();
                render();
            }, 250);
        });

        taskText.addEventListener("dblclick", function (event) {
            event.stopPropagation();

            if (clickTimer !== null) {
                clearTimeout(clickTimer);
                clickTimer = null;
            }

            const editInput = document.createElement("input");
            editInput.type = "text";
            editInput.value = todo.task;
            editInput.classList.add("todoStyle");

            todoLi.replaceChild(editInput, taskText);
            editInput.focus();

            function saveEdit() {
                const newText = editInput.value.trim();
                if (newText !== "") {
                    todo.task = newText;
                    save();
                }
                render();
            }

            editInput.addEventListener("keydown", function (e) {
                if (e.key === "Enter") {
                    saveEdit();
                }
            });

            editInput.addEventListener("blur", function () {
                saveEdit();
            });
        });

        const xBtn = createTextElement("button", "X");
        xBtn.classList.add("btnStyle");

        xBtn.addEventListener("click", function (event) {
            event.stopPropagation();

            const originalIndex = todos.indexOf(todo);
            const removedItems = todos.splice(originalIndex, 1);
            deletedHistory.push(removedItems[0]);

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


clearBtn.addEventListener("click", function () {
    todos.splice(0, todos.length);
    save();
    render();
})

clearDoneBtn.addEventListener("click", function () {
    todos = todos.filter(todo => !todo.done);
    save();
    render();
})

undoBtn.addEventListener("click", function () {
    if (deletedHistory.length > 0) {
        const restoredTodo = deletedHistory.pop()
        todos.push(restoredTodo);

        save();
        render();
    }
})



showAllBtn.addEventListener("click", function () {
    currentFilter = "all";
    render();
})

showActiveBtn.addEventListener("click", function () {
    currentFilter = "active";
    render();
})

showDoneBtn.addEventListener("click", function () {
    currentFilter = "done";
    render();
})