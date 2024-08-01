export default {
  Game: [
    {
      id: Date.now(),
      name: 'Warframe',
      tasks: [
        { id: 1, name: 'Tribute', frequency: 'daily', resetTime: new Date().setHours(18, 0, 0, 0), completed: false },
        { id: 2, name: 'Nightwave daily', frequency: 'daily', resetTime: new Date().setHours(18, 0, 0, 0), completed: false },
        { id: 3, name: 'Steel Path Alerts', frequency: 'daily', resetTime: new Date().setHours(18, 0, 0, 0), completed: false },
        { id: 4, name: 'Focus', frequency: 'daily', resetTime: new Date().setHours(18, 0, 0, 0), completed: false },
        { id: 5, name: 'Standing', frequency: 'daily', resetTime: new Date().setHours(18, 0, 0, 0), completed: false },
        { id: 6, name: 'Sortie', frequency: 'daily', resetTime: new Date().setHours(10, 0, 0, 0), completed: false },
        { id: 7, name: 'Syndicate Missions', frequency: 'daily', resetTime: new Date().setHours(10, 0, 0, 0), completed: false },
        { id: 8, name: 'The Circuit', frequency: 'weekly', resetDay: 'Sunday', resetTime: new Date().setHours(18, 0, 0, 0), completed: false },
        { id: 9, name: 'The Circuit (Steel Path)', frequency: 'weekly', resetDay: 'Sunday', resetTime: new Date().setHours(18, 0, 0, 0), completed: false },
        { id: 10, name: 'Nightwave Weekly', frequency: 'weekly', resetDay: 'Sunday', resetTime: new Date().setHours(18, 0, 0, 0), completed: false },
        { id: 11, name: 'Break Narmer (Kahl)', frequency: 'weekly', resetDay: 'Sunday', resetTime: new Date().setHours(18, 0, 0, 0), completed: false },
        { id: 12, name: 'Archon Hunt', frequency: 'weekly', resetDay: 'Sunday', resetTime: new Date().setHours(18, 0, 0, 0), completed: false },
        { id: 13, name: 'Treasure Hunt', frequency: 'weekly', resetDay: 'Sunday', resetTime: new Date().setHours(18, 0, 0, 0), completed: false },
        { id: 14, name: 'Netracell', frequency: 'weekly', resetDay: 'Sunday', resetTime: new Date().setHours(18, 0, 0, 0), completed: false },
      ]
    },
    {
      id: Date.now() + 1,
      name: 'FFXIV',
      tasks: [
        { id: 1, name: 'Expert Roulette', frequency: 'daily', resetTime: new Date().setHours(9, 0, 0, 0), completed: false },
        { id: 2, name: 'High-Level Dungeon Roulette', frequency: 'daily', resetTime: new Date().setHours(9, 0, 0, 0), completed: false },
        { id: 3, name: 'Leveling Roulette', frequency: 'daily', resetTime: new Date().setHours(9, 0, 0, 0), completed: false },
        { id: 4, name: 'Trials Roulette', frequency: 'daily', resetTime: new Date().setHours(9, 0, 0, 0), completed: false },
        { id: 5, name: 'Main Scenario Roulette', frequency: 'daily', resetTime: new Date().setHours(9, 0, 0, 0), completed: false },
        { id: 6, name: 'Alliance Raid Roulette', frequency: 'daily', resetTime: new Date().setHours(9, 0, 0, 0), completed: false },
        { id: 7, name: 'Normal Raid Roulette', frequency: 'daily', resetTime: new Date().setHours(9, 0, 0, 0), completed: false },
        { id: 8, name: 'Frontline Roulette', frequency: 'daily', resetTime: new Date().setHours(9, 0, 0, 0), completed: false },
        { id: 9, name: 'Endwalker Tribals', frequency: 'daily', resetTime: new Date().setHours(9, 0, 0, 0), completed: false },
        { id: 10, name: 'Island Sanctuary', frequency: 'daily', resetTime: new Date().setHours(9, 0, 0, 0), completed: false }
      ]
    }
  ],
  'Home Section': [{
    id: Date.now(),
    name: 'Cleaning',
    tasks: [
      { id: 1, name: 'trash', frequency: 'weekly', resetDay: 'Tuesday', resetTime: new Date().setHours(23, 0, 0, 0), completed: false },
    ]
  }]
};
