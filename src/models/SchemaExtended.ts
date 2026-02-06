import {
  Schema,
  type SchemaDefinition,
  type SchemaOptions,
  type Document,
  type Types,
} from "mongoose";

export class SchemaExtended<T extends Document = Document> extends Schema<T> {
  constructor(definition: SchemaDefinition<T>, options?: SchemaOptions) {
    super(definition, options as never);

    this.enableVirtuals();
    this.applyTransforms();
  }

  /**
   * Active les virtuals dans les sorties
   */
  private enableVirtuals() {
    this.set("toJSON", { virtuals: true });
    this.set("toObject", { virtuals: true });
  }

  /**
   * Applique un transform commun (id, cleanup, etc.)
   */
  private applyTransforms() {
    const transform = (_doc: unknown, ret: unknown) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      // eslint-disable-next-line no-underscore-dangle,no-param-reassign
      ret.id = ret._id;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      // eslint-disable-next-line no-param-reassign,no-underscore-dangle
      delete ret._id;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      // eslint-disable-next-line no-param-reassign,no-underscore-dangle
      delete ret.__v;
      return ret;
    };

    this.set("toJSON", {
      virtuals: true,
      transform,
    });

    this.set("toObject", {
      virtuals: true,
      transform,
    });
  }
}

export default SchemaExtended;
