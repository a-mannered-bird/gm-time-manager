
export default {
  backups: {
    lastBackupDate: new Date().valueOf(),
  },

  presentMoments: {
    count: 1,
    items: [
      {
        id: 1,
        projectId: 1,
        year: 0,
        month: 1,
        day: 1,
        hour: 12,
        minute: 0,
        second: 0,
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
