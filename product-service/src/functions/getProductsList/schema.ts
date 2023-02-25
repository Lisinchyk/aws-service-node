export default {
  type: "array",
  properties: {
    id: { type: "string" },
    title: { type: "string" },
    count: { type: "number" },
    price: { type: "number" },
    description: { type: "string" },
    logo: { type: "string" },
  },
  required: ["id", "title", "count", "price", "description", "logo"]
} as const;
