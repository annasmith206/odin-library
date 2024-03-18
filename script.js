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

function addBookToLibrary() {
    let title = prompt("Enter a title: ");
    let author = prompt("Enter an author: ");
    let pages = prompt("Enter number of pages: ");
    let read = confirm("Have you read the book?");
    myLibrary.push(new Book(title, author, pages, read));
}