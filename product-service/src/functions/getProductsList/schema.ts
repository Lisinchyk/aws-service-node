export default {
  type: "array",
  properties: {
    id: { type: "string" },
    title: { type: "string" },
    count: { type: "number" },
    price: { type: "number" },
    description: { type: "string" }
  },
  required: ["id", "title", "count", "price", "description"]
} as const;
