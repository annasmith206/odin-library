myLibrary = [];

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
        myLibrary.push(new Book(`title ${i}`, `author ${i}`, i*10, (i%3)==0));
    }
}

function addBookToLibrary() {
    let title = prompt("Enter a title: ");
    let author = prompt("Enter an author: ");
    let pages = prompt("Enter number of pages: ");
    let read = confirm("Have you read the book?");
    myLibrary.push(new Book(title, author, pages, read));
}

function displayBooks() {
    let table = document.querySelector("table");
    let headerRow = document.createElement("tr");
    populateCell(headerRow, "Title", "th");
    populateCell(headerRow, "Author", "th");
    populateCell(headerRow, "Pages", "th");
    populateCell(headerRow, "Read?", "th");
    table.append(headerRow);
    
    for (const book of myLibrary){
        let bookRow = document.createElement("tr");
        populateCell(bookRow, book.title, "td");
        populateCell(bookRow, book.author, "td");
        populateCell(bookRow, book.pages, "td");
        populateCell(bookRow, book.read, "td");
        table.appendChild(bookRow);
    }
}

function populateCell(row, text, type) {
    let cell = document.createElement(type);
    cell.textContent = text;
    row.appendChild(cell);
}

