
export default {
  backups: {
    lastBackupDate: new Date().valueOf(),
  },


  projects: {
    count: 1,
    items: [
      {
        id: 1,
        name: "Demo",

        // **** SETTINGS ****
        settings: {
          timeDefinitions: {
            yearNames: {
              2000: "L'année du test",
            },
            yearMonthsCount: 12,
            monthDaysCount: {
              0: 31,
              1: 28,
              2: 31,
              3: 30,
              4: 31,
              5: 30,
              6: 31,
              7: 31,
              8: 30,
              9: 31,
              10: 30,
              11: 31,
            },
            monthNames: {
              0: "January",
              1: "February",
              2: "March",
              3: "April",
              4: "May",
              5: "June",
              6: "July",
              7: "August",
              8: "September",
              9: "October",
              10: "November",
              11: "December",
            },
            weekDaysCount: 7,
            weekDaysNames: {
              0: "Monday",
              1: "Tuesday",
              2: "Wednesday",
              3: "Thursday",
              4: "Friday",
              5: "Saturday",
              6: "Sunday",
            }
          }
        }
      }
    ],
  },
}
