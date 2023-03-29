export default {
  type: "object",
  properties: {
    title: { type: "string" },
    count: { type: "string" },
    price: { type: "string" },
    description: { type: "string" }
  },
  required: ["title", "count", "price", "description"]
} as const;