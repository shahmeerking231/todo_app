const addEventListener = (element, func) => document.querySelector(element).addEventListener("click", func);
const $ = (element) => document.querySelector(element);

const todoContainer = $("#todos-container");

function toast(msg, type) {
    const id = Math.floor(Math.random() * 100);
    const toastTmp = `
    <div class="toast toast-${type} toast-${id}">
        <p>${msg}</p>
        <button id="toast" class="toast-btn-${id}">&times;</button>
    </div>
    `;
    document.body.insertAdjacentHTML("beforeend", toastTmp);
    addEventListener(`.toast-btn-${id}`, () => {
        $(`.toast-${id}`).remove();
    });
    const toastElement = document.querySelector(`.toast-${id}`);
    setTimeout(() => {
        if (toastElement) {
            toastElement.remove();
        }
    }, 5000)
};

function renderTodo(todo) {
    const todoElem = document.createElement("div");
    todoElem.classList.add(`todo`);
    todoElem.classList.add(`todo-${todo.status}`);
    todoElem.classList.add(`id-${todo.id}`);
    todoElem.dataset.id = todo.id;
    todoElem.innerHTML = `
        <button class="deleteBtn sideBtns" data-id="${todo.id}">✕</button>
        <button class="editBtn sideBtns" data-id="${todo.id}">✎</button>
        <h2>${todo.name}</h2>
        <p>${todo.description}</p>
        <div class="todo-details">
            <span>Date: ${todo.date} </span>
            <select name="todoStatus" class="todoStatus" data-id="${todo.id}">
                <option value="active" ${todo.status === "active" ? "selected" : ""}>Active Now</option>
                <option value="complete" ${todo.status === "complete" ? "selected" : ""}>Complete</option>
                <option value="abandoned" ${todo.status === "abandoned" ? "selected" : ""}>Abandoned</option>
            </select>
        </div>`;
    todoContainer.appendChild(todoElem);
}

function showForm(todo) {
    const form = `
        <form>
            <button class="sideBtns" id="closeForm">✕</button>
            <h1>${todo ? "Edit Todo" : "Add Todo"}</h1>
            <input type="text" id="todoName" placeholder="Todo Name" value="${todo ? todo.name : ""}">
            <textarea name="todoDescription" id="todoDescription" placeholder="Todo Description" rows="7">${todo ? todo.description : ""}</textarea>
            <input type="date" id="todoDate" value="${todo ? todo.date : ""}">
            <button id="formBtn" data-operation = "${todo ? "edit" : "add"}" type="submit" ${todo ? `data-id = ${todo.id}` : ""}>${todo ? "Edit Todo" : "Add Todo"}</button>
        </form>
        `;
    document.body.insertAdjacentHTML("beforeend", form);

    const formBtn = $("#formBtn");

    const destroyForm = () => {
        formBtn.removeEventListener("click", handleForm);
        $("#todoForm").remove();
    };

    const handleForm = (event) => {
        event.preventDefault();

        const name = $("#todoName").value;
        const description = $("#todoDescription").value;
        const date = $("#todoDate").value;

        if (!name || !description) {
            return toast("Please fill in all fields", "error");
        }

        const todoData = { name, description, date };

        if (event.target.dataset.operation === "edit") {
            const id = event.target.dataset.id;
            todo1.editTodo(id, todoData);
        } else if (event.target.dataset.operation === "add") {
            todo1.addTodo({ ...todoData, status: "active" });
        } else {
            toast("Error Occurred", "error");
        }
        destroyForm();
    };
    addEventListener("#formBtn", handleForm);
    addEventListener("#closeForm", (event) => {
        event.preventDefault();
        destroyForm();
    })
}

class Todo {
    constructor() {
        let storedData = localStorage.getItem("todos")
        this.todos = storedData ? JSON.parse(storedData) : [];
        if (this.todos.length > 0) {
            this.todos.forEach(todo => {
                renderTodo(todo);
            });
            toast("Saved Todos Fetched", "info");
        }
        else {
            toast("No Saved Todos Found", "info");
        }
    }
    getTodo(todoId) {
        return this.todos.find(todo => todo.id === parseInt(todoId));
    }
    addTodo(todo) {
        const id = Date.now();
        const newTodo = { ...todo, id };
        this.todos.push(newTodo);
        renderTodo(newTodo);
        localStorage.setItem("todos", JSON.stringify(this.todos));
        $("form").remove();
        toast(`Todo Added`, "success");
    }
    removeTodo(todoId) {
        this.todos = this.todos.filter(todo => todo.id !== parseInt(todoId));
        $(`.id-${todoId}`).remove();
        localStorage.setItem("todos", this.todos.length > 0 ? JSON.stringify(this.todos) : null);
        toast(`Todo Deleted`, "success");
    }
    editTodo(todoId, newTodo) {
        const index = this.todos.findIndex(todo => todo.id === parseInt(todoId));
        if (index !== undefined || index !== null) {
            const oldTodo = this.todos[index];
            newTodo.status = oldTodo.status;
            newTodo.id = oldTodo.id;
            this.todos[index] = newTodo;
            $(`.id-${todoId} h2`).innerText = newTodo.name;
            $(`.id-${todoId} p`).innerText = newTodo.description;
            $(`.id-${todoId} div span`).innerText = newTodo.date;
            localStorage.setItem("todos", JSON.stringify(this.todos));
            $("form").remove();
            toast(`Todo Updated`, "success");
        } else {
            toast(`Error while editing todo`, "error");
        }
    }
    changeStatus(todoId, status) {
        const todo = this.todos.find(todo => todo.id === parseInt(todoId));
        if (todo) {
            const todoElm = document.querySelector(`.id-${todoId}`);
            todoElm.classList.remove(`todo-${todo.status}`);
            todoElm.classList.add(`todo-${status}`);
            todo.status = status;
            localStorage.setItem("todos", JSON.stringify(this.todos));
            toast(`${todo.name} - Status Changed`, "success");
        } else {
            toast("Error while changing status", "error");
        }
    }
    clearAllTodos() {
        localStorage.removeItem("todos");
        $("#todos-container").innerHTML = ``;
        toast("All todos are cleared!", "success");
    }
}

const todo1 = new Todo();



todoContainer.addEventListener(("click"), (event) => {
    if (event.target.classList.contains("deleteBtn")) {
        if (confirm("Are you sure, you want to delete this todo?")) {
            todo1.removeTodo(event.target.dataset.id);
        }
    }
    if (event.target.classList.contains("editBtn")) {
        const id = event.target.dataset.id;
        const todo = todo1.getTodo(id);
        if (todo) {
            showForm(todo);
        }
        else {
            toast("Error while editing this todo", "error");
        }
    }
});


todoContainer.addEventListener(("change"), (event) => {
    if (event.target.classList.contains("todoStatus")) {
        todo1.changeStatus(event.target.dataset.id, event.target.value);
    }
});


addEventListener("#addTodo", () => {
    showForm(null);
});

addEventListener("#clearAll", () => {
    if (todo1.todos.length > 0) {
        if (confirm("Are you sure you want to clear all todos?")) {
            todo1.clearAllTodos();
        }
    } else {
        toast("No todos to clear", "info");
    }
})