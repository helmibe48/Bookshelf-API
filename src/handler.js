const { nanoid } = require('nanoid');
const bookshelf = require('./bookshelf');

const addBooks = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
   
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    let finished = false;
   
    const newBooks = {
        name, year, author, summary, publisher, pageCount, readPage, reading, id, finished, insertedAt, updatedAt 
    };
   
    bookshelf.push(newBooks);

    if (pageCount === readPage) {
      finished = true;}
    
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
    const books = bookshelf.filter((books) => books.name.toLowerCase().includes(name.toLowerCase()));
    const response = h.response({
      status: 'success',
      data: {
        books: bookshelf.map((books) => ({
          id : books.id,
          name: books.name,
          publisher: books.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }

  if (reading) {
    const books = bookshelf.filter((books) => Number(books.reading) === Number(reading));
    const response = h.response({
      status: 'success',
      data: {
        books: bookshelf.map((books) => ({
          id : books.id,
          name: books.name,
          publisher: books.publisher
        })),
      },
    });
    response.code(200);
    return response;
  }

  if (finished) {
    const books = bookshelf.filter((book) => Number(books.finished) === Number(finished));
    const response = h.response({
      status: 'success',
      data: {
        books: bookshelf.map((books) => ({
          id : books.id,
          name: books.name,
          publisher: books.publisher
        })),
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'success',
    data: {
      books: bookshelf.map((books) =>  ({
        id : books.id,
        name: books.name,
        publisher: books.publisher
      })),
    },
  });
  response.code(200);
  return response;

};

const getBooksID = (request, h) => {
    const { bookId } = request.params;
    const books = bookshelf.filter((n) => n.id === bookId)[0];
   
   if (books === undefined) {
      const response = h.response ({
        status: 'fail',
        message: 'Buku tidak ditemukan',
      });
      response.code(404);
      return response;
    }
   
    const response = h.response({
      status: 'success',
      data: {
        books,
      },
    });
      response.code(200);
      return response;
};

const updateBooks = (request, h) => {
    const { bookId } = request.params;
   
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
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
 
module.exports = { addBooks, getBooks, getBooksID, updateBooks, deleteBooks };