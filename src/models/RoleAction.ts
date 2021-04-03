
import RoleEvent from './RoleEvent'

export default interface RoleAction {
  id: number;
  externalId: string;
  projectId: number;
  name: string;
  description: string;
  typeIds: number[];
  events: RoleEvent[];
}
