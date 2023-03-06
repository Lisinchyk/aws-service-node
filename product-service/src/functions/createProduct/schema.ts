export default {
  type: "object",
  properties: {
    title: { type: "string" },
    count: { type: "number" },
    price: { type: "number" },
    description: { type: "string" }
  },
  required: ["title", "count", "price", "description"]
} as const;
