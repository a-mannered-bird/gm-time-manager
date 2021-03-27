
export default {
  backups: {
    lastBackupDate: new Date().valueOf(),
  },

  roleEvents: {
    count: 1,
    items: [
      {
        id: 1,
        externalId: 'c5106266-2d88-4ebd-b002-0dccf3b05531',
        projectId: 1,
        name: 'Test event',
        notes: 'Notes for test event',
        start: 1,
        end: 500,
        typeIds: [1],
      },
      {
        id: 2,
        externalId: 'c5106266-2d88-4ebd-b002-0dccf3b05531',
        projectId: 1,
        name: 'Test event 2',
        notes: 'Notes for test event',
        start: 2,
        end: 500,
        typeIds: [1],
      },
      {
        id: 3,
        externalId: 'c5106266-2d88-4ebd-b002-0dccf3b05531',
        projectId: 1,
        name: 'Test event 3',
        notes: 'Notes for test event',
        start: 3,
        end: 500,
        typeIds: [1],
      },
      {
        id: 4,
        externalId: 'c5106266-2d88-4ebd-b002-0dccf3b05531',
        projectId: 1,
        name: 'Test event 4',
        notes: 'Notes for test event',
        start: 4,
        end: 500,
        typeIds: [1],
      },
    ],
  },

  roleEventTypes: {
    count: 1,
    items: [
      {
        id: 1,
        externalId: 'f7849984-4ae8-4a29-9c38-293996fcb259',
        projectId: 1,
        name: 'Category 1',
        color: 'red',
        description: 'Description for category 1',
      },
    ],
  },

  presentTimes: {
    count: 1,
    items: [
      {
        id: 1,
        projectId: 1,
        value: 0,
      },
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
          changeTimeType: 'relative',
          timeDefinitions: {
            // yearNames: {
            //   2000: "L'année du test",
            // },
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
