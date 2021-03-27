
export default interface RoleEvent {
  id: number;
  externalId: string;
  projectId: number;
  name: string;
  notes: string;
  start: number;
  end: number;
  typeIds: number[];
}
