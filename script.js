// initialize data
const library = new Library();

// initialize dom references
const dataTable = new DataTable();
const inputFields = new InputFields();

// add initial data
initializeView();


/** Event Handling */

const addBookForm = document.querySelector("form");
addBookForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const newBookData = inputFields.getData();
    library.addBook(new Book(...newBookData));
    dataTable.addRow(newBookData, onDeleteRow);

    inputFields.clear();
});

function onDeleteRow(event) {
    const targetRow = event.target.parentElement;
    const index = targetRow.dataset.index;
    library.deleteBook(index);
    dataTable.deleteRow(index);
}


/** Data Classes */

function Book(title, author, pages, read){
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;

    this.info = function() {
        return `${this.title} by ${this.author}, ${this.pages} pages, ${this.read ? "read" : "not read yet"}`;
    };
}

function Library(){
    this.books = [];

    this.addBook = function(book) {
        this.books.push(book);
    }

    this.deleteBook = function(i) {
        this.books.splice(i, 1);
    }

    this.populate = function(count) {
        for(let i = 0; i < count; i++){
            this.addBook(new Book(`title ${i}`, `author ${i}`, i*10, (i%3)==0));
        }
    }
}


/** Element Classes */

function DataTable() {
    this.domElements = [];
    this.table = document.querySelector("table ");

    this.addHeader = function(headerData) {
        let row = document.createElement("tr");
        for (cellData of headerData) {
            this.populateCell(row, cellData, "th");
        }
        this.populateCell(row, "", "th");
        this.table.appendChild(row);
    }

    this.addRow = function(rowData, onDeleteCallBack) {
        let row = document.createElement("tr");

        for (cellData of rowData) {
            this.populateCell(row, cellData, "td");
        }

        this.populateCell(row, "Delete", "button", "click", onDeleteCallBack);

        row.dataset.index = this.domElements.length;

        this.table.appendChild(row);
        this.domElements.push(row);
    }

    this.deleteRow = function(i) {
        this.domElements[i].remove();
    }

    this.populateCell = function(row, text, type, event, callback) {
        let cell = document.createElement(type);
        cell.textContent = text;
        if(event && callback) {
            cell.addEventListener(event, callback);
        }
        row.appendChild(cell);
    }

    this.populateCallbackCell = function(row, text, type, event, callback) {
        let cell = document.createElement(type);
        cell.textContent = text;
        cell.addEventListener(event, callback);
        row.appendChild(cell);
    }
}

function InputFields() {
    this.inputFields = document.querySelectorAll("form > input");

    this.getData = function() {
        let data = [];
        Array.from(this.inputFields).forEach((field) => {
            data.push(field.type === "checkbox" ? field.checked : field.value);
        });
        return data;
    }

    this.clear = function() {
        Array.from(this.inputFields).forEach((field) => {
            if (field.type === "checkbox") {
                field.checked = false;
            } else {
                field.value = "";
            }
        });
    }
}


/** Helper Functions */

function initializeView(){
    dataTable.addHeader(["Title", "Author", "Pages", "Read?"]);
    library.populate(10);
    for (let book of library.books) {
        dataTable.addRow([book.title, book.author, book.pages, book.read], onDeleteRow);
    }
}

