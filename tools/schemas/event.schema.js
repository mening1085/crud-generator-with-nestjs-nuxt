module.exports = {
  name: "event",
  fields: [
    { name: "title", type: "string", required: true },
    { name: "description", type: "textarea", required: false },
    { name: "organizer_email", type: "email", required: true },
    {
      name: "category",
      type: "select",
      required: true,
      options: [
        { label: "Conference", value: "conference" },
        { label: "Workshop", value: "workshop" },
        { label: "Seminar", value: "seminar" },
        { label: "Networking", value: "networking" },
      ],
    },
    { name: "start_date", type: "date", required: true },
    { name: "start_time", type: "datetime", required: false },
    { name: "max_attendees", type: "number", required: false },
    { name: "ticket_price", type: "decimal", required: false },
    { name: "is_active", type: "boolean", required: false },
    { name: "is_featured", type: "boolean", required: false },
  ],
};
