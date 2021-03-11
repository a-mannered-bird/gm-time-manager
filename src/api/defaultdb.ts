
export default {
  backups: {
    lastBackupDate: new Date().valueOf(),
  },

  presentTimes: {
    count: 1,
    items: [
      {
        id: 1,
        projectId: 1,
        value: '0/1/1/12/0/0',
      }
    ],
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
            monthDaysCount: [
              31,
              28,
              31,
              30,
              31,
              30,
              31,
              31,
              30,
              31,
              30,
              31,
            ],
            monthNames: [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ],
            weekDaysCount: 7,
            weekDaysNames: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ],
          }
        }
      }
    ],
  },
}
