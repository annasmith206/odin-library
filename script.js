myLibrary = [];
populateLibrary(10);

const addBookForm = document.querySelector("form");

const addBookInputs = {
    title : document.querySelector("#title"),
    author : document.querySelector("#author"),
    pages : document.querySelector("#pages"),
    read : document.querySelector("#read"),
    makeBook: () => {
        return new Book(title.value, author.value, pages.value, read.value);
    }
};

addBookForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addBookToLibrary(addBookInputs.makeBook());
});

function Book(title, author, pages, read){
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.info = function() {
        return `${this.title} by ${this.author}, ${this.pages} pages, ${this.read ? "read" : "not read yet"}`;
    };
}

function populateLibrary(count) {
    for(let i = 0; i < count; i++){
        addBookToLibrary(new Book(`title ${i}`, `author ${i}`, i*10, (i%3)==0));
    }
}

function addBookToLibrary(book) {
    myLibrary.push(book);
    addToTable(book);
}

function addToTable(book) {
    let table = document.querySelector("table");
    let bookRow = document.createElement("tr");
    populateCell(bookRow, book.title, "td");
    populateCell(bookRow, book.author, "td");
    populateCell(bookRow, book.pages, "td");
    populateCell(bookRow, book.read, "td");
    table.appendChild(bookRow);
}

function populateCell(row, text, type) {
    let cell = document.createElement(type);
    cell.textContent = text;
    row.appendChild(cell);
}


