import { type Model, type Document, type Types } from "mongoose";

export default class AbstractManager<T extends Document = Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  find(id: string | Types.ObjectId): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  findAll(): Promise<T[]> {
    return this.model.find({}).exec();
  }

  delete(id: string | Types.ObjectId): Promise<T | null> {
    return this.model.findByIdAndDelete(id).exec();
  }

  create(data: Partial<T>): Promise<T> {
    // Model.create renvoie l'instance créée (et une Promise)
    return this.model.create(data as unknown as T);
  }

  update(data: Partial<T> & Pick<T, "id">): Promise<T | null> {
    // { new: true } pour retourner le document mis à jour
    return this.model.findByIdAndUpdate(data.id, data, { new: true }).exec();
  }
}
