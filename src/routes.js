const { addBooks } = require('./handler');

const routes = [
    {
      method: 'POST',
      path: '/books',
      handler: addBooks,
    },
  ];
   
  module.exports = routes;