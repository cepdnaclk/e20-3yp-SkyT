import { InferSchemaType, model, Schema } from "mongoose";

const newsSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  publishedAt: { type: String, required: true },
  imageUrl: { type: String, required: false },
  star: { type: Boolean, required: true },
});

type News = InferSchemaType<typeof newsSchema>;

export default model<News>("news", newsSchema); // (<collection_name_in_plural>, <schema_name>)
