
import RoleTime from './RoleTime';

export default interface RoleEvent {
  id: number;
  externalId: string;
  projectId: number;
  name: string;
  notes: string;
  start: RoleTime;
  end: RoleTime;
  typeIds: number[];
}
