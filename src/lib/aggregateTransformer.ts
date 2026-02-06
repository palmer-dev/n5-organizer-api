import { Types } from "mongoose";

/**
 * Interface de base pour représenter la structure Mongoose
 * sans dépendre de la classe lourde Document.
 */
interface MongooseBase {
  _id: Types.ObjectId | string | unknown;
  __v?: number;
}

/**
 * Le type de sortie :
 * On retire les clés internes et on force la présence de 'id'
 */
export type TransformedDoc<T extends MongooseBase> = Omit<T, "_id" | "__v"> & {
  id: T["_id"];
};

export function applyAggregateTransforms<
  T,
  TB extends MongooseBase = MongooseBase
>(doc: TB): T {
  // On utilise la décomposition (destructuring) pour extraire
  // proprement les propriétés à supprimer
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id, __v, ...rest } = doc;

  // On retourne un nouvel objet avec 'id' typé comme l'était '_id'
  return {
    ...rest,
    id: _id,
  } as T;
}
