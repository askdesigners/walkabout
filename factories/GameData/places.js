module.exports.dimensions = [4, 4];

module.exports.definitions = [
  {
    x: 1,
    y: 1,
    level: 0,
    name: 'A Darkened Room',
    descriptiveName: '',
    colorTheme:'veryDark',
    blockedTo: ['w', 'n']
  },
  {
    x: 2,
    y: 1,
    level: 0,
    name: '',
    descriptiveName: '',
    colorTheme:'ultraDark',
    blockedTo: ['e', 's']
  },
  {
    x: 3,
    y: 1,
    level: 0,
    name: '',
    descriptiveName: '',
    colorTheme:'dimRed',
    blockedTo: ['w']
  },
  {
    x: 4,
    y: 1,
    level: 0,
    name: '',
    descriptiveName: '',
    colorTheme:'dimRed',
    blockedTo: ['n', 'e']
  },
  {
    x: 1,
    y: 2,
    level: 0,
    name: 'The Hallway',
    descriptiveName: '',
    colorTheme:'dim',
    blockedTo: ['w', 's'],
    onEnter: (place) => {
      console.log('Im fuggin in here!');
    }
  },
  {
    x: 2,
    y: 2,
    level: 0,
    name: '',
    descriptiveName: 'dimRed',
    colorTheme:'normal',
    blockedTo: ['n', 'e'],
    canEnter: (place) => {
      return true;
    }
  },
  {
    x: 3,
    y: 2,
    level: 0,
    name: '',
    descriptiveName: '',
    colorTheme:'dimRed',
    blockedTo: ['w', 'e']
  },
  {
    x: 4,
    y: 2,
    level: 0,
    name: '',
    descriptiveName: '',
    colorTheme:'dimRed',
    blockedTo: ['w', 's', 'e']
  },
  {
    x: 1,
    y: 3,
    level: 0,
    name: '',
    descriptiveName: '',
    colorTheme:'dimRed',
    blockedTo: ['w', 'n', 'e']
  },
  {
    x: 2,
    y: 3,
    level: 0,
    name: '',
    descriptiveName: '',
    colorTheme:'dim',
    blockedTo: ['w', 's']
  },
  {
    x: 3,
    y: 3,
    level: 0,
    name: '',
    descriptiveName: '',
    colorTheme:'dim',
    blockedTo: ['s']
  },
  {
    x: 4,
    y: 3,
    level: 0,
    name: '',
    descriptiveName: '',
    colorTheme:'windowLight', 
    blockedTo: ['n', 'e']
  },
  {
    x: 1,
    y: 4,
    level: 0,
    name: '',
    descriptiveName: '',
    colorTheme:'veryDark',
    blockedTo: ['w', 's']
  },
  {
    x: 2,
    y: 4,
    level: 0,
    name: '',
    descriptiveName: '',
    colorTheme:'darkGreen',
    blockedTo: ['s', 'n']
  },
  {
    x: 3,
    y: 4,
    level: 0,
    name: '',
    descriptiveName: '',
    colorTheme:'darkShadow',
    blockedTo: ['s', 'n']
  },
  {
    x: 4,
    y: 4,
    level: 0,
    name: '',
    descriptiveName: '',
    colorTheme:'filteredOrange',
    blockedTo: ['s', 'e']
  }
];