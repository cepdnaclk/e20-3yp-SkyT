import { InferSchemaType, model, Schema } from "mongoose";

const imageSchema = new Schema({
  image: { type: String, required: true },
  title: { type: String, required: true },
});

const gallerySchema = new Schema({
  event: { type: String, required: true },
  note: { type: String, required: true },
  images: [imageSchema],
});

type Gallery = InferSchemaType<typeof gallerySchema>;

export default model<Gallery>("Galleries", gallerySchema); // (<collection_name_in_plural>, <schema_name>)
