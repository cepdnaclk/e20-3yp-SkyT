import { InferSchemaType, model, Schema } from "mongoose";

const teacherSchema = new Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  avatar: { type: String, required: false },
});

type Teacher = InferSchemaType<typeof teacherSchema>;

export default model<Teacher>("teachers", teacherSchema); // (<collection_name_in_plural>, <schema_name>)
