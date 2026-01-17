import {
  Schema,
  type Document,
  type SchemaDefinition,
  type SchemaOptions,
} from "mongoose";

class SchemaExtended<T extends Document = Document> extends Schema<T> {
  constructor(definition: SchemaDefinition<T>, options?: SchemaOptions) {
    super(definition, options as never);

    // Override toJSON
    this.method("toJSON", this.toJSON);
  }

  toJSON(this: T) {
    const obj = this.toObject({ virtuals: true });
    const { _id, __v, ...rest } = obj;
    return { id: _id, ...rest };
  }
}

export default SchemaExtended;
