/* eslint-disable linebreak-style */
/* eslint-disable no-shadow */
/* eslint-disable no-trailing-spaces */
const { nanoid } = require('nanoid');
const bookshelf = require('./bookshelf');

const addBooks = (request, h) => {
  const { 
    name, year, author, summary, publisher, pageCount, readPage, reading, 
  } = request.payload;
   
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  let finished = false;
   
  if (pageCount === readPage) {
    finished = true;
  }
    
  const newBooks = {
    id, 
    name, 
    year, 
    author, 
    summary, 
    publisher, 
    pageCount, 
    readPage, 
    reading, 
    insertedAt, 
    updatedAt, 
    finished, 
  };

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
    
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  bookshelf.push(newBooks);

  const isSuccess = bookshelf.filter((book) => book.id === id).length > 0;
   
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getBooks = (request, h) => {
  const { name, reading, finished } = request.query;

  if (name) {
    const book = bookshelf.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
    const response = h.response({
      status: 'success',
      data: {
        books: book.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }

  if (reading) {
    const book = bookshelf.filter((book) => Number(book.reading) === Number(reading));
    const response = h.response({
      status: 'success',
      data: {
        books: book.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }

  if (finished) {
    const book = bookshelf.filter((book) => Number(book.finished) === Number(finished));
    const response = h.response({
      status: 'success',
      data: {
        books: book.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'success',
    data: {
      books: bookshelf.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });
  response.code(200);
  return response;
};

const getBooksID = (request, h) => {
  const { bookId } = request.params;
  const book = bookshelf.filter((book) => book.id === bookId)[0];
   
  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  }
   
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const updateBooks = (request, h) => {
  const { bookId } = request.params;
   
  const { 
    name, year, author, summary, publisher, pageCount, readPage, reading, 
  } = request.payload;

  const updatedAt = new Date().toISOString();
  const index = bookshelf.findIndex((book) => book.id === bookId);
   
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const finished = (pageCount === readPage);

  if (index !== -1) {
    bookshelf[index] = {
      ...bookshelf[index],
      name, 
      year, 
      author, 
      summary, 
      publisher, 
      pageCount, 
      readPage,
      finished,  
      reading, 
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBooks = (request, h) => {
  const { bookId } = request.params;
  const index = bookshelf.findIndex((books) => books.id === bookId);

  if (index !== -1) {
    bookshelf.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = { 
  addBooks, getBooks, getBooksID, updateBooks, deleteBooks, 
};
