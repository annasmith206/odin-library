// initialize data
const library = new Library();

// initialize dom references
const dataTable = new DataTable();
dataTable.addColumnDef("Title");
dataTable.addColumnDef("Author");
dataTable.addColumnDef("Pages");
dataTable.addColumnDef("Status", "button",[{eventType: "click", func: onToggleRead}]);
dataTable.addColumnDef("", "button", [{eventType: "click", func: onDeleteRow}]);

const inputFields = new InputFields();

// add initial data
initializeView();


/** Event Handling */

const addBookForm = document.querySelector("form");
addBookForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const newBookData = inputFields.getData();
    newBook = new Book(...newBookData);
    const ID = library.addBook(newBook);
    dataTable.addRow(makeRowParams(newBook), ID);

    inputFields.clear();
});

function onToggleRead(event) {
    const targetRow = event.target.parentElement.parentElement;
    const ID = Number(targetRow.dataset.ID);
    library.toggleRead(ID);
    dataTable.updateRow(makeRowParams(library.getBook(ID)), ID);
} 

function onDeleteRow(event) {
    const targetRow = event.target.parentElement.parentElement;
    const ID = Number(targetRow.dataset.ID);
    library.deleteBook(ID);
    dataTable.deleteRow(ID);
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
    this.books = new Map();
    this.nextID = 0;

    this.getBook = function(i) {
        return this.books.get(i);
    }

    this.addBook = function(book) {
        this.books.set(this.nextID, book);
        return this.nextID++;
    }

    this.deleteBook = function(i) {
        this.books.delete(i);
    }

    this.toggleRead = function(i) {
        this.books.get(i).read = !this.books.get(i).read;
    }

    this.populate = function(count) {
        for(let i = 0; i < count; i++){
            this.addBook(new Book(`title ${i}`, `author ${i}`, i*10, (i%3)==0));
        }
    }
}


/** Element Classes */

function DataTable() {
    this.table = document.querySelector("table");
    this.columnDefs = [];
    this.headerElement = document.createElement("tr");
    this.rowElements = new Map();
    this.table.appendChild(this.headerElement);

    this.addColumnDef = function(header, type, callBacks){
        this.populateCell(this.headerElement, header, "th");

        const column = new DataColumn(header ?? "", type ?? "", callBacks ?? []);
        this.columnDefs.push(column);
    }

    this.addRow = function(rowData, ID) {
        let row = this.createRow(rowData, ID);
        this.table.appendChild(row);
        this.rowElements.set(ID, row);
    }

    this.updateRow = function(rowData, ID) {
        let updatedRow = this.createRow(rowData, ID);
        this.rowElements.get(ID).replaceWith(updatedRow);
        this.rowElements.set(ID, updatedRow);
    }

    this.deleteRow = function(ID) {
        this.rowElements.get(ID).remove();
        this.rowElements.delete(ID);
    }

    this.createRow = function(rowData, ID){
        let row = document.createElement("tr");
        row.dataset.ID = ID;

        let i = 0;
        for (cellData of rowData) {
            this.populateCell(row, cellData, "td", this.columnDefs[i]);
            i++;
        }

        return row;
    }

    this.populateCell = function(row, text, cellType, columnDef) {
        let cell = document.createElement(cellType);

        if(columnDef && columnDef.type !== ""){
            let innerCell = document.createElement(columnDef.type);
            
            for (callBack of columnDef.callBacks) {
                innerCell.addEventListener(callBack.eventType, callBack.func);
            }

            innerCell.textContent = text;
            cell.appendChild(innerCell);
        } else {
            cell.textContent = text;
        }

        row.appendChild(cell);
    }
}

function DataColumn(header, type, callBacks) {
    this.header = header;
    this.type = type;
    this.callBacks = callBacks;
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
    library.populate(10);
    for (let [ID, book] of library.books) {
        dataTable.addRow(makeRowParams(book), ID);
    }
}

function makeRowParams(book) {
    return [book.title, book.author, book.pages, book.read ? "Read" : "Not Read", "Delete"];
}
