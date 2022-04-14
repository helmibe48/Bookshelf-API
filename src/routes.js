/* eslint-disable linebreak-style */
const {
  addBooks,
  getBooks,
  getBooksID,
  updateBooks,
  deleteBooks,
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBooks,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getBooks,
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getBooksID,
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: updateBooks,
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBooks,
  },
];

module.exports = routes;
