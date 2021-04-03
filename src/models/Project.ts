
// TODO: add externalId to projects

export default interface Project {
  id: number;
  name: string;
  dashboardTime: number;
  settings: {
    [key: string]: any;
    changeTimeType: 'absolute' | 'relative';
    timeDefinitions: TimeDefinitions;
  }
}

export interface TimeDefinitions {
  [key: string]: any;
  monthDaysCount: number[];
  monthNames: string[];
  weekDaysNames: string[];
  weekDaysCount: number;
  yearMonthsCount: number;
}
