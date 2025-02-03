import { InferSchemaType, model, Schema } from "mongoose";

const siteAdminSchema = new Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
});

type SiteAdmin = InferSchemaType<typeof siteAdminSchema>;

export default model<SiteAdmin>("siteAdmins", siteAdminSchema); // (<collection_name_in_plural>, <schema_name>)
