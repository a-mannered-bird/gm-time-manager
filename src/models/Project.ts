
export default interface Project {
  id: number;
  name: string;
  settings: {
    [key: string]: any,
    timeDefinitions: {
      [key: string]: any,
      monthDaysCount: { [key: number]: number },
      monthNames: { [key: number]: string },
      weekDaysNames: { [key: number]: string },
      weekDaysCount: number,
      yearMonthsCount: number,
      yearNames: { [key: number]: string },
    }
  }
}
