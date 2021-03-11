
import Moment from './Moment';


export default interface Project {
  id: number;
  name: string;
  presentMoment: Moment;
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
