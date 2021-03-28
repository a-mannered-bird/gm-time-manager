
export default interface RoleEvent {
  isAllDay?: boolean;
  id: number;
  externalId: string;
  projectId: number;
  name: string;
  notes: string;
  start: number;
  end: number;
  typeIds: number[];
}
