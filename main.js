const listBook = [];
const SAVED_EVENT = 'saved-todo';
const STORAGE_KEY = 'BOOK_APPS';

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Your browser does not support local storage');
        return false;
    }
    return true;
}

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});

const filter = document.getElementById('searchSubmit');
filter.addEventListener("click", function (event) {
    event.preventDefault()
    const hBook = document.getElementById("searchBookTitle");
    const filter = hBook.value.toUpperCase();
    const bookItemh2 = document.querySelectorAll(".item h2");
    const bookItem = document.querySelectorAll(".item");
    for (let i = 0; i < bookItem.length; i++) {
        titleBook = bookItemh2[i].innerText;
        if (titleBook.toUpperCase().indexOf(filter) > -1) {
            bookItem[i].style.display = "";
        } else {
            bookItem[i].style.display = "none";
        }
    }
});


function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            listBook.push(book);
        }
    }

    document.dispatchEvent(new Event("bookChanged"));
}

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });
    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

function addBook() {
    const bookTitle = document.getElementById("bookTitle").value;
    const bookAuthor = document.getElementById("bookAuthor").value;
    const bookYear = document.getElementById("bookYear").value;
    const isComplete = document.getElementById("isComplete").checked;
    const dataBook = {
        id: +new Date(),
        title: bookTitle,
        author: bookAuthor,
        year: bookYear,
        isComplete: isComplete,
    };
    listBook.push(dataBook)
    document.dispatchEvent(new Event("bookChanged"))
    saveData()
}

function makeTodo(data) {
    const textTitle = document.createElement('h2');
    textTitle.innerText = data.title;
    const textAuthor = document.createElement('p');
    textAuthor.innerText = data.author;
    const textYear = document.createElement('p');
    textYear.innerText = data.year;
    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle, textAuthor, textYear);
    const container = document.createElement('div');
    container.classList.add('item', 'shadow');
    container.append(textContainer);
    container.setAttribute('id', `todo-${data.id}`);
    if (data.isComplete) {
        const finishButton = document.createElement('button');
        finishButton.innerText = "unfinish"
        finishButton.classList.add('inList');

        finishButton.addEventListener('click', function () {
            moveUnfinish(data.id);
        });

        const deleteButton = document.createElement('button');
        deleteButton.innerText = "delete"
        deleteButton.classList.add('inList');

        deleteButton.addEventListener('click', function () {
            customDialog = document.getElementById("modal")
            customDialog.style.display = "block";
            opmodal(data.id)
        });

        container.append(finishButton, deleteButton);
    } else {
        const unfinishButton = document.createElement('button');
        unfinishButton.innerText = "finish"
        unfinishButton.classList.add('inList');

        unfinishButton.addEventListener('click', function () {
            moveFinish(data.id);
        });

        const deleteButton = document.createElement('button');
        deleteButton.innerText = "delete"
        deleteButton.classList.add('inList');

        deleteButton.addEventListener('click', function () {
            customDialog = document.getElementById("modal")
            customDialog.style.display = "block";
            opmodal(data.id)
        });

        container.append(unfinishButton, deleteButton);
    }

    return container;
}

function moveFinish(dataID) {
    const target = findData(dataID);

    if (target == null) return;

    target.isComplete = true;
    document.dispatchEvent(new Event("bookChanged"))
    saveData()
}

function moveUnfinish(dataID) {
    const target = findData(dataID);

    if (target == null) return;

    target.isComplete = false;
    document.dispatchEvent(new Event("bookChanged"))
    saveData()
}

function findData(dataID) {
    for (const data of listBook) {
        if (data.id === dataID) {
            return data;
        }
    }
    return null;
}

function opmodal(dataID) {
    const yesdelete = document.getElementById("yes");
    yesdelete.addEventListener("click", function () {
        deleteData(dataID);
        customDialog.style.display = "none";
    });
    const nodelete = document.getElementById("no");
    nodelete.addEventListener("click", function () {
        customDialog.style.display = "none";
        dataID= null;
    });
    console.log(dataID)
}


function deleteData(dataID) {
    const target = findTodoIndex(dataID);

    if (target === -1) return;

    listBook.splice(target, 1);
    document.dispatchEvent(new Event("bookChanged"));
    saveData();
}

function findTodoIndex(dataID) {
    for (const index in listBook) {
        if (listBook[index].id === dataID) {
            return index;
        }
    }
    return -1;
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(listBook);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event("bookChanged"));
    }
}


document.addEventListener("bookChanged", function () {
    let selectListBook1 = document.getElementById('finishedBook');
    let selectListBook = document.getElementById('unfinishedBook');
    selectListBook.innerHTML = '';
    selectListBook1.innerHTML = '';
    for (const book of listBook) {
        fitBook = makeTodo(book);
        if (book.isComplete == false) {
            selectListBook.append(fitBook);
        } else if (book.isComplete == true) {
            selectListBook1.append(fitBook);
        }
    }
});
