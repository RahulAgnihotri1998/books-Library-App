const searchHistory = localStorage.getItem('searchHistory') ? JSON.parse(localStorage.getItem('searchHistory')) : [];

const searchList = document.querySelector('.search-lists');
searchList.innerHTML = searchHistory.map((search, index) => `
  <div class="search-items">
    <div class="id-name">
      <div class="search-id">${index + 1}.</div>
      <div class="search-name">${search.search}</div>
    </div>
    <div class="date-time">Searched On: ${search.date} at ${search.time}</div>
  </div>
`).join('');

const cardContainer = document.querySelector('.container');

function displayBookCards(bookStore) {
  const cardWrapper = document.querySelector('.card-wrapper');
  cardWrapper.innerHTML = bookStore.map(book => `
    <div class="card">
      <img class="image-top" src="${book.image}" alt="${book.title}">
      <div class="card-body">
        <h5 class="card-title">${book.title}</h5>
        <p class="card-author">Author: ${book.author}</p>
        <p class="card-page-count">Page Count: ${book.pageCount}</p>
        <p class="card-publisher">Publisher: ${book.publisher}</p>
      </div>
      <div class="btn">
        <a href="https://www.amazon.in/s?k=${book.title} ${book.author}" target="_blank"><button class="buy-now">Buy Now</button></a>
      </div>
    </div>
  `).join('');
}

function fetchBookData(search) {
  return fetch(`https://www.googleapis.com/books/v1/volumes?q=${search}`)
    .then(response => response.json())
    .then(data => {
      const bookStore = data.items.map(book => {
        const volumeInfo = book.volumeInfo;
        return {
          id: book.id,
          image: volumeInfo.imageLinks?.thumbnail,
          title: volumeInfo.title ?? 'NA',
          author: volumeInfo.authors?.[0] ?? 'NA',
          pageCount: volumeInfo.pageCount ?? 'NA',
          publisher: volumeInfo.publisher ?? 'NA',
        };
      });
      localStorage.setItem('bookStore', JSON.stringify(bookStore));
      displayBookCards(bookStore);
    });
}

const searchItems = document.querySelectorAll('.search-items');
searchItems.forEach(item => {
  const search = item.querySelector('.search-name').innerText;
  item.addEventListener('click', () => {
    if (search !== '') {
      cardContainer.classList.remove('hide');
      fetchBookData(search);
    } else {
      cardContainer.classList.add('hide');
    }
  });
});