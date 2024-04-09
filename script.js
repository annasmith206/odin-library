// initialize data
const library = new Library();

// initialize dom references
const dataTable = new DataTable();
dataTable.addColumnDef("Title");
dataTable.addColumnDef("Author");
dataTable.addColumnDef("Pages");
dataTable.addColumnDef("Status");
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
    library.addBook(newBook);
    dataTable.addRow(makeRowParams(newBook));

    inputFields.clear();
});

function onDeleteRow(event) {
    const targetRow = event.target.parentElement.parentElement;
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
    this.table = document.querySelector("table");
    this.columnDefs = [];
    this.headerElement = document.createElement("tr");
    this.rowElements = [];
    this.table.appendChild(this.headerElement);

    this.addColumnDef = function(header, type, callBacks){
        this.populateCell(this.headerElement, header, "th");

        const column = new DataColumn(header ?? "", type ?? "", callBacks ?? []);
        this.columnDefs.push(column);
    }

    this.addRow = function(rowData) {
        let row = document.createElement("tr");

        let i = 0;
        for (cellData of rowData) {
            this.populateCell(row, cellData, "td", this.columnDefs[i]);
            i++;
        }

        row.dataset.index = this.rowElements.length;

        this.table.appendChild(row);
        this.rowElements.push(row);
    }

    this.deleteRow = function(i) {
        this.rowElements[i].remove();
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
    for (let book of library.books) {
        dataTable.addRow(makeRowParams(book));
    }
}

function makeRowParams(book) {
    return [book.title, book.author, book.pages, book.read ? "Read" : "Not Read", "Delete"];
}
