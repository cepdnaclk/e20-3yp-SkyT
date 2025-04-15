import { InferSchemaType, model, Schema } from "mongoose";

const feedbackSchema = new Schema({
  name: { type: String, required: true },
  note: { type: String, required: true },
  role: { type: String, required: true },
  date: { type: String, required: true },
});

type Feedback = InferSchemaType<typeof feedbackSchema>;

export default model<Feedback>("Feedbacks", feedbackSchema); // (<collection_name_in_plural>, <schema_name>)
