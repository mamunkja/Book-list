//get UI elements
let form = document.querySelector('#add_form');
let booklist = document.querySelector('#book-list');

//Book class
class Book{
    constructor(name, author, isbn){
        this.name = name;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI class
class UI{
    
    //add book to table list as tr
    static addBooklist(book) {
        let list = document.querySelector('#book-list');
        let row = document.createElement('tr');
        row.innerHTML = `
        <td>${book.name}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href='#' class='delete'>X</a></td>`;

        list.appendChild(row);        
    }

    //clear all input fields
    static clearFields() {
        document.querySelector('#name').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }

    static showAlert(message, className){
        let div = document.createElement('div');
        div.className = `alert ${className}`;
        div.appendChild(document.createTextNode(message));

        let cont = document.querySelector('.container');
        let form = document.querySelector('#add_form');
        cont.insertBefore(div, form);

        setTimeout(() => {
            document.querySelector('.alert').remove();
        }, 3000);
    }

    static deleteBook(target) {
        if (target.hasAttribute('href')){
            if(confirm('Are you sure to delete')){
                target.parentElement.parentElement.remove();
                Store.removeBook(target.parentElement.previousElementSibling.textContent.trim());
                UI.showAlert('Book deleted successfully', 'success');
            }
        }        
    }    
}

//class for local storage
class Store {
    
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    //store book in local storage
    static addBook(book) {
        let books = Store.getBooks();
        books.push(book);        
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn){
        let books = Store.getBooks();
        
        books.forEach((book, index) => {
            if(book.isbn === isbn){
                books.splice(index, 1);
            }
        });
        
        localStorage.setItem('books', JSON.stringify(books));    
    }

    static displayBooks() {
        let books = Store.getBooks();

        books.forEach(book => {
            UI.addBooklist(book);
        })
    }
}

form.addEventListener('submit', newBook);
booklist.addEventListener('click', removeBook);
document.addEventListener('DOMContentLoaded', Store.displayBooks);

function newBook(e) {
    //get the value from input fields
    let name = document.querySelector('#name').value.trim(),
    author = document.querySelector('#author').value.trim(),
    isbn = document.querySelector('#isbn').value.trim();

    if(name === '' || author === '' || isbn === ''){
        UI.showAlert('Please fill up all the fields!', 'error');
    } else {
        let book = new Book(name, author, isbn);
    
        UI.addBooklist(book);
        
        Store.addBook(book);
        
        UI.clearFields();    

        UI.showAlert('Book added successfully', 'success');
    }
    
    e.preventDefault();
}

function removeBook(params) {
    UI.deleteBook(params.target);
    params.preventDefault();
}
    