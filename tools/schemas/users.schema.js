module.exports = {
  name: "users",
  fields: [
    { name: "username", type: "string", required: true },
    { name: "email", type: "email", required: true },
    {
      name: "role",
      type: "select",
      required: true,
      options: [
        { label: "Admin", value: "admin" },
        { label: "User", value: "user" },
        { label: "Moderator", value: "moderator" },
      ],
    },
    { name: "birthDate", type: "date", required: false },
    { name: "isActive", type: "boolean", required: false },
    { name: "bio", type: "textarea", required: false },
  ],
};
