
import RoleTime from './RoleTime';


export default interface Project {
  id: number;
  name: string;
  presentRoleTime: RoleTime;
  settings: {
    [key: string]: any,
    timeDefinitions: TimeDefinitions;
  }
}

export interface TimeDefinitions {
  [key: string]: any,
  monthDaysCount: number[],
  monthNames: string[],
  weekDaysNames: string[],
  weekDaysCount: number,
  yearMonthsCount: number,
  yearNames: { [key: number]: string },
}
