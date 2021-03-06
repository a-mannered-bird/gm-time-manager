
export default interface Document {
  id?: number;
  name: string;
  content: string;
  categoryId?: number;
  creationDate: number;
  modificationDate: number;
  projectId?: number;
}
