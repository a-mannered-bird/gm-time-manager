
import RoleTime from './RoleTime';

export default interface RoleEvent {
  id: number;
  externalId: string;
  name: string;
  notes: string;
  start: RoleTime;
  end: RoleTime;
  typeIds: number[];
}
