
export default interface RoleEvent {
  id: number;
  externalId: string;
  projectId: number;
  name: string;
  notes: string;
  isAllDay?: boolean;
  start: number;
  end: number;
  typeIds: number[];
  interval?: string;
  intervalEnd?: number;
  intervalLength?: number;
}
