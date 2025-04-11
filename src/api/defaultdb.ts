
const defaultDb = {
  backups: {
    lastBackupDate: new Date().valueOf(),
  },

  roleActions: {
    count: 2,
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
      {
        description: "Choose a willing creature that you can see within range. Until the spell ends, the target's speed is doubled, it gains a +2 bonus to AC, it has advantage on Dexterity saving throws, and it gains an additional action on each of its turns. That action can be used only to take the Attack (one weapon attack only), Dash, Disengage, Hide, or Use an Object action.\n\nWhen the spell ends, the target can't move or take actions until after its next turn, as a wave of lethargy sweeps over it.",
        events: [
          {
            id: 1,
            externalId: "8d8274e6-3f7a-45d0-b619-7e8a47f8d805",
            projectId: 2,
            name: "Haste",
            notes: "The target's speed is doubled, it gains a +2 bonus to AC, it has advantage on Dexterity saving throws, and it gains an additional action on each of its turns. That action can be used only to take the Attack (one weapon attack only), Dash, Disengage, Hide, or Use an Object action.",
            start: 0,
            end: 60,
            typeIds: [
              4
            ],
            interval: "",
            intervalLength: 0
          },
          {
            id: 2,
            externalId: "1a55bbba-1eab-45fa-9f0a-3c4ba7a65161",
            projectId: 2,
            name: "Haste aftershock",
            notes: "The target can't move or take actions until after its next turn, as a wave of lethargy sweeps over it.",
            start: 0,
            end: 6,
            typeIds: [
              4
            ],
            interval: "",
            intervalLength: 0
          }
        ],
        name: "Haste spell",
        typeIds: [
          4
        ],
        id: 2,
        externalId: "5c28458c-48ba-4d76-b437-efb178a10ee8",
        projectId: 2
      },
    ],
  },

  roleEvents: {
    count: 9,
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
      },
      {
        id: 6,
        externalId: "04e4e5e9-03da-4196-b5d2-812faf32b1e0",
        projectId: 2,
        name: "Short Rest",
        notes: "",
        start: 47114832600,
        end: 47114836200,
        typeIds: [
          3
        ],
        interval: "",
        intervalLength: 0
      },
      {
        id: 7,
        externalId: "0696255f-c85e-4dbe-9e8b-5644c45491a8",
        projectId: 2,
        name: "Bandits Ambush!",
        notes: "Encounter starts, let's roll for initiative!",
        start: 47114834398,
        end: 47114834399,
        typeIds: [
          3
        ],
        interval: "",
        intervalLength: 0
      },
      {
        id: 8,
        externalId: "27479d56-062d-47f6-bb8a-7d59831acdef",
        projectId: 2,
        name: "Barbarian is raging",
        notes: "Lasts one minute, halves damages",
        start: 47114834385,
        end: 47114834445,
        typeIds: [
          4
        ],
        interval: "",
        intervalLength: 0
      },
      {
        id: 9,
        externalId: "007a00a6-7ddd-47b5-a060-04e62cb05347",
        projectId: 2,
        name: "The Winter festival begins!",
        notes: "Faerûn's Winter Festival happens every year at this date",
        start: 47114870400,
        end: 47114956799,
        typeIds: [
          5
        ],
        interval: "1/0/0/0/0/0",
        intervalLength: 0,
        isAllDay: true,
        intervalIndex: 0
      }
    ],
  },

  roleEventTypes: {
    count: 5,
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
      {
        name: "Activities",
        color: "#0206F1",
        description: "Activities happening around the players",
        id: 3,
        externalId: "c3ba2d5f-7df6-49ca-83f1-9570ce1c964c",
        projectId: 2
      },
      {
        name: "Effects",
        color: "#F89706",
        description: "Statuses and effects applied to NPCs and players",
        id: 4,
        externalId: "3856d7c5-ac14-4426-870e-21739b3125d7",
        projectId: 2
      },
      {
        name: "Events",
        color: "#02B113",
        description: "Events in the world of the Forgotten Realms",
        id: 5,
        externalId: "cce0236d-7274-49b5-9210-f994d13103c5",
        projectId: 2
      }
    ],
  },

  projects: {
    count: 2,
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
      },
      {
        id: 2,
        name: "Forgotten Realms Calendar (demo)",
        dashboardTime: 47114834400,
        settings: {
          changeTimeType: "absolute",
          timeDefinitions: {
            yearMonthsCount: "17",
            monthDaysCount: [
              30,
              1,
              30,
              30,
              30,
              1,
              30,
              30,
              30,
              1,
              30,
              30,
              1,
              30,
              30,
              1,
              30
            ],
            monthNames: [
              "Hammer \"Deepwinter\"",
              "Midwinter",
              "Alturiak \"The Claw of Winter\"",
              "Ches \"The Claw of Sunsets\"",
              "Tarsakh \"The Claw of Storms\"",
              "Greengrass",
              "Mirtul \"The Melting\"",
              "Kythorn \"The Time of Flowers\"",
              "Flamerule \"Summertide\"",
              "Midsummer",
              "Eleasis \"Highsun\"",
              "Eleint \"The Fading\"",
              "Highharvestide",
              "Marpenoth \"Leatfall\"",
              "Uktar \"The Rotting\"",
              "Feast of the Moon",
              "Nightal \"The Drawing Down\""
            ],
            weekDaysCount: "10",
            weekDaysNames: [
              "First day",
              "Second day",
              "Third day",
              "Fourth day",
              "Fifth day",
              "Sixth day",
              "Seventh day",
              "Eighth day",
              "Ninth day",
              "Tenth day"
            ]
          }
        }
      }
    ],
  },
}
 export default defaultDb