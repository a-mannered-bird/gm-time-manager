
const defaultDb = {
  backups: {
    lastBackupDate: new Date().valueOf(),
  },

  roleActions: {
    count: 1,
    items: [
      {
        id: 1,
        externalId: 'c5106266-2d88-4ebd-b002-0dgcf3b05531',
        projectId: 1,
        name: 'Action test 1',
        description: 'Notes for test event 2',
        typeIds: [1],
        events: [
          {
            id: 1,
            externalId: 'c5106255-2d88-4ebd-b002-0dccf3b05531',
            projectId: 1,
            name: 'Action event 1',
            notes: 'Notes for action test event 1',
            start: 0,
            end: 0,
            typeIds: [1],
          },
          {
            id: 2,
            externalId: 'c5106255-2d22-4ebd-b002-0dccf3b05531',
            projectId: 1,
            name: 'Action event 2',
            notes: 'Notes for action test event 2',
            start: 60,
            end: 60,
            typeIds: [2],
          },
        ],
      },
    ],
  },

  roleEvents: {
    count: 4,
    items: [
      {
        id: 2,
        externalId: 'c5106266-2d88-4ebd-b002-0dccf3b05531',
        projectId: 1,
        name: 'Test event 2',
        notes: 'Notes for test event 2',
        start: -2,
        end: -2,
        typeIds: [1],
      },
      {
        id: 1,
        externalId: 'c5106266-2d88-4ebd-b002-0dccf3b05531',
        projectId: 1,
        name: 'Test event 1',
        notes: 'Notes for test event 1',
        start: -1,
        end: -1,
        typeIds: [1],
      },
      {
        id: 4,
        externalId: 'c5106266-2d88-4ebd-b002-0dccf3b05531',
        projectId: 1,
        name: 'Test event 4',
        notes: 'Notes for test event 4',
        start: 0,
        end: 504,
        typeIds: [1, 2],
      },
      {
        id: 3,
        externalId: 'c5106266-2d88-4ebd-b002-0dccf3b05531',
        projectId: 1,
        name: 'Test event 3',
        notes: 'Notes for test event 3',
        start: 1,
        end: 503,
        typeIds: [2],
      },
    ],
  },

  roleEventTypes: {
    count: 2,
    items: [
      {
        id: 1,
        externalId: 'f7849984-4ae8-4a29-9c38-293996fcb250',
        projectId: 1,
        name: 'Category 1',
        color: '#ff0000',
        description: 'Description for category 1',
      },
      {
        id: 2,
        externalId: 'f7849984-4ae8-4a29-9c38-293996fcb259',
        projectId: 1,
        name: 'Category 2',
        color: '#00ff00',
        description: 'Description for category 2',
      },
    ],
  },

  projects: {
    count: 1,
    items: [
      {
        id: 1,
        name: "Demo",
        dashboardTime: 0,

        // **** SETTINGS ****
        settings: {
          changeTimeType: 'relative',
          timeDefinitions: {
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
 export default defaultDb