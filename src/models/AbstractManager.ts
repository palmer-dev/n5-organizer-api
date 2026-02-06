import {
  type Model,
  type Document,
  type Types,
  RootFilterQuery,
} from "mongoose";

export default class AbstractManager<T extends Document = Document> {
  protected model: Model<T>;

  protected readonly userId?: Types.ObjectId;

  constructor(model: Model<T>, userId?: Types.ObjectId) {
    this.model = model;
    this.userId = userId;
  }

  protected userFilter() {
    return this.userContextProperty("user");
  }

  private userContextProperty(property: string) {
    return this.userId ? { [property]: this.userId } : {};
  }

  find(id: string | Types.ObjectId): Promise<T | null> {
    return this.model
      .findOne({
        _id: id,
        ...this.userFilter(),
      })
      .exec();
  }

  findAll(): Promise<T[]> {
    return this.model.find(this.userFilter()).exec();
  }

  delete(id: string | Types.ObjectId): Promise<T | null> {
    return this.model
      .findOneAndDelete({
        _id: id,
        // ...this.userFilter(),
      })
      .exec();
  }

  create(data: Partial<T>): Promise<T> {
    if (!this.userId) {
      throw new Error("User context required");
    }

    // Model.create renvoie l'instance créée (et une Promise)
    return this.model.create({
      ...data,
      ...this.userContextProperty("createdBy"),
    } as unknown as T);
  }

  update(data: Partial<T> & Pick<T, "id">): Promise<T | null> {
    // { new: true } pour retourner le document mis à jour
    return this.model.findByIdAndUpdate(data.id, data, { new: true }).exec();
  }

  findWithoutExec(search: RootFilterQuery<T> = {}) {
    return this.model.find({
      ...search,
    });
  }
}
