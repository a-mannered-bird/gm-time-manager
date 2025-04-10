
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
        name: 'Drink a shot',
        description: 'Intoxicating but brings courage.',
        typeIds: [1],
        events: [
          {
            id: 1,
            externalId: 'c5106255-2d88-4ebd-b002-0dccf3b05531',
            projectId: 1,
            name: 'You\'re drunk',
            notes: 'The character has disadvantage on ability checks.',
            start: 180,
            end: 3600,
            typeIds: [2],
          },
          {
            id: 2,
            externalId: 'c5106255-2d22-4ebd-b002-0dccf3b05531',
            projectId: 1,
            name: 'Braver',
            notes: 'Your character has advantage on morale checks.',
            start: 0,
            end: 3600,
            typeIds: [2],
          },
        ],
      },
    ],
  },

  roleEvents: {
    count: 5,
    items: [
      {
        id: 2,
        externalId: 'c5106266-2d88-4ebd-b002-0dccf3b05531',
        projectId: 1,
        name: 'New Year\'s Eve Party',
        notes: 'The party where it all started...',
        start: 63071982000,
        end: 63072021540,
        typeIds: [1],
      },
      {
        id: 1,
        externalId: 'c5106266-2d88-4ebd-b002-0dccf3b05532',
        projectId: 1,
        name: 'Zombie Day',
        notes: 'The Zombie Apocalypse starts now!',
        start: 63072000000,
        end: 63072086399,
        typeIds: [1],
      },
      {
        id: 4,
        externalId: 'c5106266-2d88-4ebd-b002-0dccf3b05533',
        projectId: 1,
        name: 'Countdown to year 2000',
        notes: 'The world will never be the same again...',
        start: 63071999990,
        end: 63072000000,
        typeIds: [1],
      },
      {
        id: 3,
        externalId: 'c5106266-2d88-4ebd-b002-0dccf3b05534',
        projectId: 1,
        name: 'You\'re drunk',
        notes: 'All players and NPCs are affected by the effets of alcohol.',
        start: 63071996390,
        end: 63072003590,
        typeIds: [2],
      },
      {
        id: 5,
        externalId: 'c5106266-2d88-4ebd-b002-0dccf3b05535',
        projectId: 1,
        name: 'Z day News broadcast',
        notes: 'An ominous TV broadcast is being watched by a few guests in a bedroom.',
        start: 63071998790,
        end: 63071999390,
        typeIds: [2],
      }
    ],
  },

  roleEventTypes: {
    count: 2,
    items: [
      {
        id: 1,
        externalId: 'f7849984-4ae8-4a29-9c38-293996fcb250',
        projectId: 1,
        name: 'Activities',
        color: '#ff0000',
        description: 'Things happening in the world.',
      },
      {
        id: 2,
        externalId: 'f7849984-4ae8-4a29-9c38-293996fcb259',
        projectId: 1,
        name: 'Effects',
        color: '#00ff00',
        description: 'Statuses and effects for players and NPC.',
      },
    ],
  },

  projects: {
    count: 1,
    items: [
      {
        id: 1,
        name: "Realistic Calendar (demo)",
        dashboardTime: 63071999990,

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