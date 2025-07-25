module.exports = {
  name: "product",
  fields: [
    { name: "title", type: "string", required: true },
    { name: "description", type: "textarea", required: false },
    { name: "price", type: "number", required: true },
    {
      name: "category",
      type: "select",
      required: true,
      options: [
        { label: "Electronics", value: "electronics" },
        { label: "Clothing", value: "clothing" },
        { label: "Books", value: "books" },
        { label: "Home & Garden", value: "home_garden" },
      ],
    },
    { name: "releaseDate", type: "date", required: false },
    { name: "lastUpdated", type: "datetime", required: false },
    { name: "isActive", type: "boolean", required: false },
  ],
};
