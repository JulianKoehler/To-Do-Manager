
// Model


let todoItems; // The todo data as an Array where all the todo data is saved. The function changeTodoStatus is adding another property called "isDone" to save the data whether the todo is done or not.

const savedTodoItems = JSON.parse(localStorage.getItem('todoItems'));

// If the local storage has an Array saved then use it
// Otherwise use the default array

if (Array.isArray(savedTodoItems)) {
    todoItems = savedTodoItems;
} else {
    todoItems = [ // the default values as examples when starting the App the first time
        {
            title: "Do some chores",
            dueDate: "Monday, August 22, 2022",
            id: "id1",
            isEditing: undefined
        },
        {
            title: "Learn some coding",
            dueDate: "Tuesday, August 23, 2022",
            id: "id2",
            isEditing: undefined
        },
        {
            title: "Buy a gift for my mother",
            dueDate: "Wednesday, August 24, 2022",
            id: "id3",
            isEditing: undefined
        }
        ]
}

    // Create a todo

function createTodo(title, dueDate) {
   const ID = new Date().getTime(); //creates a larger random number that serves as ID for a new todo item
0
    todoItems.unshift(
        {
            title: title,
            dueDate: dueDate,
            id: ID,
            isEditing: undefined
        }
    );

    saveTodos();
}
    // Delete a todo

function removeTodo(id) {
        // if the ID of this todo matches the ID_TO_DELETE then return false
    todoItems = todoItems.filter(todo => {
        if (todo.id == id) { // We MUST us the "==" Oprator since the ID from the HTML element is a string, common source of bugs, typescript is helping here
            return false;
        } else {
            return true;
        }
    });

    saveTodos();
}

    // Check a todo

function changeTodoStatus(checkboxId, status) {
    //get the corresponding todo item
    todoItems.forEach(todo => {
        if (todo.id == checkboxId) {
            todo.isDone = status;
        }

        // when the todo item was clicked as done, it should move to the bottom of the list
        if (todo.id == checkboxId && todo.isDone === true) { // check if the IDs are matching AND if it's done
            const TODO_INDEX = todoItems.indexOf(todo);
            console.log(TODO_INDEX);
            moveCheckedItem(TODO_INDEX);
        };

        // when a todo item which is marked as "Done" is unchecked, it should move back up
        if (todo.id == checkboxId && todo.isDone === false) {
            const TODO_ITEM_ARR = todoItems.splice(todoItems.indexOf(todo), 1);
            const TODO_ITEM = JSON.parse(JSON.stringify(TODO_ITEM_ARR).replace(/[\[\]']+/g,''));
            todoItems.unshift(TODO_ITEM);
        }
    });

    saveTodos();
}

function moveCheckedItem(todoIndex) {
    const TODO_ITEM_ARR = todoItems.splice(todoIndex, 1); // remove the todo from the todo list and save it in this variable (as a new array)
    const TODO_ITEM = JSON.parse(JSON.stringify(TODO_ITEM_ARR).replace(/[\[\]']+/g,'')); // convert the todo from an Array data type back to a JSON
    todoItems.push(TODO_ITEM); //push the todo to the end of list
    // console.log(todoItems);
}

    // Edit a todo

function editTodo(editButtonID) {
    todoItems.forEach(todo => {
        if (todo.id == editButtonID) {
            todo.isEditing = true;
        }
    });

    saveTodos();

}

    // Update a todo
function updateTodo(updateButtonID) {
    todoItems.forEach(todo => {
        if (todo.id == updateButtonID) {
            const UPDATED_TODO_TITLE = document.getElementById(todo.id + 'title').value;
            const UPDATED_TODO_DUEDATE = document.getElementById(todo.id + 'date').value;
            todo.title = UPDATED_TODO_TITLE;
            if (UPDATED_TODO_DUEDATE != '') {
                todo.dueDate = convertTime(UPDATED_TODO_DUEDATE)
            };
            todo.isEditing = false;
        }
    });

    saveTodos();

}

function saveTodos() {
    localStorage.setItem('todoItems', JSON.stringify(todoItems))
}

// View

renderItems();

function renderItems() {
    //reset the list so it doesn't render twice
    document.getElementById('todo-list').innerHTML = '';
    //the actual render code
    todoItems.forEach(todo => {
        // render the Todo item
        const TODO_ITEM_LINE = document.createElement('div');
        TODO_ITEM_LINE.className = 'item-line';

        //render the text field
        const TODO_TEXT_FIELD = document.createElement('div');
        TODO_TEXT_FIELD.className = 'text-field';
        const TEXT_AREA = document.createElement('p');
        TEXT_AREA.className = 'text-field-title';
        const LINE_BREAK = document.createElement('br');
        const DUE_DATE = document.createElement('p');
        if (todo.dueDate === '') {  // in case the user has not selected any date the program shall only show the todo title
            TEXT_AREA.textContent = `${todo.title}`;
        } else {
            TEXT_AREA.textContent = todo.title;
            TEXT_AREA.appendChild(LINE_BREAK);
            DUE_DATE.textContent = todo.dueDate;
            TEXT_AREA.appendChild(DUE_DATE);
        }
        TODO_TEXT_FIELD.appendChild(TEXT_AREA)

        //render the checkbox
        const CHECKBOX = document.createElement('input');
        CHECKBOX.type = 'checkbox';
        CHECKBOX.className = 'checkbox';
        CHECKBOX.onchange = checkItem; // call the function to toggle it when checking the checkbox
        CHECKBOX.dataset.todoId = todo.id; // setting the checkbox ID equally to the todo object's ID
        if (todo.isDone === true) { // 
            CHECKBOX.checked = true;
            TODO_ITEM_LINE.className = 'done';
        } else {
            CHECKBOX.checked = false;
        }

        // create the Button Wrapper for Layout Purposes
        const ITEM_LINE_BUTTONS = document.createElement('div');
        ITEM_LINE_BUTTONS.className = 'item-line-buttons';

        // render the delete button
        const DELETE_BUTTON = document.createElement('button');
        DELETE_BUTTON.innerText = 'Delete';
        DELETE_BUTTON.className = 'delete-button'
        DELETE_BUTTON.onclick = deleteItem;
        DELETE_BUTTON.id = todo.id; // to be able to associate the delete button with its todo item

        //render the update button
        const UPDATE_BUTTON = document.createElement('button');
        UPDATE_BUTTON.innerText = 'Update';
        UPDATE_BUTTON.className = 'update-button';
        UPDATE_BUTTON.onclick = updateItem;
        UPDATE_BUTTON.id = todo.id;

        //render the update input field
        const UPDATE_TEXT_INPUT = document.createElement('input');
        UPDATE_TEXT_INPUT.type = 'text';
        UPDATE_TEXT_INPUT.className = 'input-textfield';
        UPDATE_TEXT_INPUT.id = todo.id + 'title';

        //render the update date picker
        const UPDATE_DATE_PICKER = document.createElement('input');
        UPDATE_DATE_PICKER.type = 'date';
        UPDATE_DATE_PICKER.className = 'todo-due-date';
        UPDATE_DATE_PICKER.id = todo.id + 'date';

        // render the edit button and its click event
        const EDIT_BUTTON = document.createElement('button');
        EDIT_BUTTON.innerText = 'Edit';
        EDIT_BUTTON.className = 'edit-button';
        EDIT_BUTTON.onclick = editItem;
        EDIT_BUTTON.id = todo.id;
        if (todo.isEditing === true) { // if the edit button was clicked and the property "isEditing" turns true, don't render what we had before, instead render a textbox, a date picker and an update button
           TODO_TEXT_FIELD.className = 'text-field-editing';
           UPDATE_TEXT_INPUT.value = todo.title;
           UPDATE_DATE_PICKER.value = convertTimeBack(todo.dueDate); // In the "pretty" format the date picker won't get the time value, that's why we have to convert it back to standard format.
           console.log(todo.dueDate);
           TODO_ITEM_LINE.innerHTML = '';
           TODO_TEXT_FIELD.innerHTML= '';
           TODO_TEXT_FIELD.prepend(UPDATE_TEXT_INPUT);
           TODO_TEXT_FIELD.appendChild(UPDATE_DATE_PICKER);
           TODO_ITEM_LINE.appendChild(TODO_TEXT_FIELD);
           ITEM_LINE_BUTTONS.appendChild(UPDATE_BUTTON);
           TODO_ITEM_LINE.appendChild(ITEM_LINE_BUTTONS);
        } else {
            TODO_TEXT_FIELD.prepend(CHECKBOX);
            TODO_ITEM_LINE.appendChild(TODO_TEXT_FIELD);
            ITEM_LINE_BUTTONS.appendChild(EDIT_BUTTON);
            ITEM_LINE_BUTTONS.appendChild(DELETE_BUTTON);
            TODO_ITEM_LINE.appendChild(ITEM_LINE_BUTTONS);
        }
         
        //render the todo item
        const TODO_LIST = document.getElementById('todo-list') // A seperate Div that can be cleared out for the render reset.
        TODO_LIST.appendChild(TODO_ITEM_LINE);
    });
}

    //convert the due Date to a nicer format

function convertTime(time) {
    return new Date(time).toLocaleDateString('en-us', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    })
}

    //convert the due Date back to make it readable for the date picker when editing

function convertTimeBack(time) {
    let d = new Date(time),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

// Controller

function addItem() {
    const TITLE = document.getElementById('user-input').value;
    let dueDate = document.getElementById('date-picker').value;
    if (dueDate != '') {
        dueDate = convertTime(dueDate);
        document.getElementById('date-picker').value = '' // Reseting the content of the date input field after the add button has been clicked
    }
    document.getElementById('user-input').value = ''; // Reseting the content of the text input field after the add button has been clicked
    

    createTodo(TITLE, dueDate);
    renderItems();
}

function deleteItem(event) {
    const DELETE_BUTTON = event.target;
    const ID_TO_DELETE = DELETE_BUTTON.id;  

    removeTodo(ID_TO_DELETE);
    renderItems();
}

function checkItem(event) {
    const CHECKBOX = event.target;
    const ID_TO_CHECK = CHECKBOX.dataset.todoId
    const CHECKED = CHECKBOX.checked

    changeTodoStatus(ID_TO_CHECK, CHECKED);
    renderItems();
}

function editItem(event) {
    const EDIT_BUTTON = event.target;
    const ID_TO_EDIT = EDIT_BUTTON.id

    editTodo(ID_TO_EDIT);
    console.log(todoItems)
    renderItems();
}

function updateItem(event) {
    const UPDATE_BUTTON = event.target;
    const ID_TO_UPDATE = UPDATE_BUTTON.id;

    updateTodo(ID_TO_UPDATE);
    console.log(todoItems)
    renderItems();
}