
const search = document.querySelector('.search');

const cardContainer = document.querySelector('.container');
const inputBtn = document.querySelector('.input-btn');
const bookResults = document.querySelector('.bookResults');

let bookCards = document.querySelectorAll('.card');
const bookResultsShow = document.querySelector('.bookResults');

let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

inputBtn.addEventListener('click', async (e) => {
e.preventDefault();


bookResults.innerHTML = search.value;

let myArr = search.value.split(' ');
let newSearch = myArr.join('+');

if (search.value !== '') {

    const date = new Date();
    const searchHistoryNow = {
        date: date.toLocaleDateString(),
        time: date.toLocaleTimeString(),
        search: search.value,
    };
    searchHistory.push(searchHistoryNow);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

    cardContainer.classList.remove('hide');

    try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${newSearch}`);
        const data = await response.json();
        let bookStore = [];

        const dataItems = data.items;
        dataItems.forEach(arrItems => {
            const bookInfo = arrItems.volumeInfo;
            const books = {
                id: arrItems.id,
                image: bookInfo.imageLinks.thumbnail,
                title: bookInfo.title || 'NA',
                author: bookInfo.authors ? bookInfo.authors[0] : 'NA',
                pageCount: bookInfo.pageCount || 'NA',
                publisher: bookInfo.publisher || 'NA',
            };
            if (bookStore.length < dataItems.length) {
                bookStore.push(books);
            }
            localStorage.setItem('bookStore', JSON.stringify(bookStore));
        });

        const cardWrapper = document.querySelector('.card-wrapper');
        const booksInStorage = JSON.parse(localStorage.getItem('bookStore')) || [];
        cardWrapper.innerHTML = "";
        booksInStorage.forEach(item => {
            cardWrapper.innerHTML += `
                <div class="card">
                    <img class="image-top" src=${item.image} alt="${item.name}">
                    <div class="card-body">
                        <h5 class="card-title">${item.title}</h5>
                        <p class="card-author">Author: ${item.author}</p>
                        <p class="card-page-count">Page Count: ${item.pageCount}</p>
                        <p class="card-publisher">Publisher: ${item.publisher}</p>
                    </div>
                    <div class="btn">
                        <button class="buy-now">Buy Now</button>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error(error);
    }

} else {
    cardContainer.classList.add('hide');
}
});