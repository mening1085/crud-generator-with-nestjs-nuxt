module.exports = {
  name: 'product',
  fields: [
    { name: 'title', type: 'string', required: true },
    { name: 'price', type: 'number', required: true },
    { name: 'isActive', type: 'boolean', required: false },
  ],
};
