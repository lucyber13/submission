const bookItems = [];
const RENDER_EVENT = 'render-book'
const STORAGE_KEY = "BOOKSHELF_LIST" ;

function isStorageExist() {
    return typeof Storage !== "undefined";
    
};
function RenderBookList(bookData) {
    if (bookData === null) {
      return;
    }
}
document.addEventListener('DOMContentLoaded', function() {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', (event) => {
        event.preventDefault();
        addBook();
        console.log(bookItems);

        const bookUncomplete = document.getElementById('uncompleteBookshelfList')
        bookUncomplete.innerHTML = ''

        for (let list of bookItems) {
            const listBook = macBook(list);
            bookUncomplete.append(listBook);
            };
        

    });
    if (isStorageExist()) {
        localDataFromStorage();
    }
});

function addBook() {
    const generateID = generateId();
    const titleBook = document.getElementById('inputBookTitle').value;
    const authorBook = document.getElementById('inputBookAuthor').value;
    const yearBook = document.getElementById('inputBookYear').value;
    const checkSelesai = document.getElementById('inputBookIsComplete').checked;
    const Bookshelf = generateBookObject(generateID, titleBook, authorBook, yearBook,checkSelesai, false);
    bookItems.push(Bookshelf);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}  

function generateId() {
    const idbook = +new Date()
    return idbook;
}

function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
};

const system = document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBookshelfList = document.getElementById('uncompleteBookshelfList');
    uncompletedBookshelfList.innerHTML = '';

    const completedBookshelfList = document.getElementById('completeBookshelfList');
    completedBookshelfList.innerHTML = '';
    const checkSelesai = document.getElementById('inputBookIsComplete').checked;

    for(const bookItem of bookItems){
        const bookElement = macBook(bookItem);

        if(bookItem.isComplete  ){
        completedBookshelfList.append(bookElement);
            } else if(checkSelesai == true){
                completedBookshelfList.innerHTML = ''
                completedBookshelfList.append(bookElement);
            }else{
                uncompletedBookshelfList.append(bookElement);
            }
        }
});


function macBook(Bookshelf) {
    const textJudul = document.createElement('h2'); 
    textJudul.innerText = Bookshelf.title; 

    const textPenulis = document.createElement('strong'); 
    textPenulis.innerText = Bookshelf.author; 

    const textTahun = document.createElement('p');
    textTahun.innerText = Bookshelf.year;


    const textContainer = document.createElement('div'); 
    textContainer.classList.add('input'); 
    textContainer.append(textJudul, textPenulis, textTahun); 

    const container = document.createElement('div'); 
    container.classList.add('item', 'shadow'); 
    container.append(textContainer); 
    container.setAttribute('id', `idbook-${Bookshelf.id}`); 

    if(Bookshelf.isComplete){
    const belumSelesai = document.createElement('button');
    belumSelesai.classList.add('styleBack');
    belumSelesai.innerText = 'belum selesai';

    belumSelesai.addEventListener('click', function(){
    Bookshelf.isComplete = false;
    undoTaskFromCompleted(Bookshelf.id);
    
    });

    
    const buang = document.createElement('button');
    buang.classList.add('styleDelete');
    buang.innerText = 'Buang';

    buang.addEventListener('click', function(){
    removeTaskFromCompleted(Bookshelf.id);
    });
    const deleteAllBooks = document.createElement('button');
    deleteAllBooks.classList.add('styleDeleteAll')
    deleteAllBooks.innerText = 'Delete All';
    deleteAllBooks.addEventListener('click', function() {
       removeAllBooks(Bookshelf);
    });
   
    container.append(belumSelesai, buang, deleteAllBooks);
    
    } else {
   
    const selesai = document.createElement('button');
    selesai.classList.add('styleNext');
    selesai.innerText = 'Selesai';
    
    selesai.addEventListener('click',function(){
    addBookToComplete(Bookshelf.id);
    });
    const buang = document.createElement('button');
    buang.classList.add('styleDelete');
    buang.innerText = 'Buang';

    buang.addEventListener('click', function(){
    removeTaskFromCompleted(Bookshelf.id);
    });

    container.append(selesai, buang);
    }
    return container;
}

function addBookToComplete (bookId) {
    const BookObject = findBook(bookId);
    if(BookObject == null) return;
    BookObject.isComplete = true;
    const daftarBukuCompleted = document.getElementById('completeBookshelfList');
    daftarBukuCompleted,innerHTML = '';
    daftarBukuCompleted.append(BookObject);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData()
}

function findBook(bookId) {
    for(const bookItem of bookItems) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function findBookIndex (bookId){
    for(const index in bookItems) {
        if(bookItems[index].id == bookId){
            return index;
        }
    }
    return -1;
}

function removeAllBooks() {
    let eksekusi = confirm('Yakin mau menghapus semua buku dari list?')
    
    if(eksekusi == true) {
        bookItems.splice(bookItems)
    } else {
        alert('Buku gagal dihapus')
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

function removeTaskFromCompleted(bookId){ 
    const BookObject = findBookIndex(bookId);

        if(BookObject == -1) return;   
        bookItems.splice(BookObject, 1); //menghapus elemen array
    
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

function undoTaskFromCompleted(bookId) {
    const BookObject = findBook(bookId);

    if(BookObject == null) return;

    BookObject.isCompleted == false;

    const daftarBukuUncompleted = document.getElementById('uncompleteBookshelfList');
    daftarBukuUncompleted.innerHTML = '';
    daftarBukuUncompleted.append(BookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};


function saveData() {
    if(isStorageExist()) {
        const parsed = JSON.stringify(bookItems);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT)); 
    }
}

const SAVED_EVENT = 'saved-book';

document.addEventListener(SAVED_EVENT, function() {
    console.log(localStorage.getItem(STORAGE_KEY));
})

function localDataFromStorage() {
    const passData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(passData);

    if(data !== null) {
        for (const book of data) {
            bookItems.push(book);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
};
const title = itemElement.childNodes[0].innerText;
const titleNameAttribut = itemElement.childNodes[0].getAttribute("name");
for (let index = 0; index < bookData.length; index++) {
  if (bookData[index].title === title && bookData[index].id == titleNameAttribut) {
    bookData[index].isComplete = !bookData[index].isComplete;
    break;
  }

}
function SearchBookList(titleBook) {
    const bookData = localDataFromStorage();
    if (bookData,length === 0) {
        return;
    }
    for ( let index = 0; index<bookData.length; index++) {
        const tempTitle = bookData[index].titleBook.toLowerCase();
        if (bookData[index].titleBook.includes(titleBook) || tempTitle.includes(tempTitleTarget)) {
            bookItems.push(bookData[index]);
        }
    }
}
const searchBook = document.getElementById('searchButton');
searchBook.addEventListener('click', function(e) {
    e.preventDefault();
    const bookData = localDataFromStorage();
    if (bookData === 0) {
        return;
    }
        const searchTitle = document.getElementById("searchBookTitle").value;
        if (searchTitle === null) {
            RenderBookList(bookData);
            return;
        }
        const bookList = SearchBookList(titleBook);
        RenderBookList(bookList);
})
