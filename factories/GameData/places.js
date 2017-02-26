module.exports.dimensions = [4, 4];

module.exports.definitions = [
  {
    lat: 1,
    long: 1,
    level: 0,
    name: 'A Darkened Room',
    descriptiveName: '',
    colorTheme:'veryDark',
    blockedTo: ['w', 'n']
  },
  {
    lat: 2,
    long: 1,
    level: 0,
    name: '',
    descriptiveName: '',
    colorTheme:'ultraDark',
    blockedTo: ['e', 's']
  },
  {
    lat: 3,
    long: 1,
    level: 0,
    name: '',
    descriptiveName: '',
    colorTheme:'dimRed',
    blockedTo: ['w']
  },
  {
    lat: 4,
    long: 1,
    level: 0,
    name: '',
    descriptiveName: '',
    colorTheme:'dimRed',
    blockedTo: ['n', 'e']
  },
  {
    lat: 1,
    long: 2,
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
    lat: 2,
    long: 2,
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
    lat: 3,
    long: 2,
    level: 0,
    name: '',
    descriptiveName: '',
    colorTheme:'dimRed',
    blockedTo: ['w', 'e']
  },
  {
    lat: 4,
    long: 2,
    level: 0,
    name: '',
    descriptiveName: '',
    colorTheme:'dimRed',
    blockedTo: ['w', 's', 'e']
  },
  {
    lat: 1,
    long: 3,
    level: 0,
    name: '',
    descriptiveName: '',
    colorTheme:'dimRed',
    blockedTo: ['w', 'n', 'e']
  },
  {
    lat: 2,
    long: 3,
    level: 0,
    name: '',
    descriptiveName: '',
    colorTheme:'dim',
    blockedTo: ['w', 's']
  },
  {
    lat: 3,
    long: 3,
    level: 0,
    name: '',
    descriptiveName: '',
    colorTheme:'dim',
    blockedTo: ['s']
  },
  {
    lat: 4,
    long: 3,
    level: 0,
    name: '',
    descriptiveName: '',
    colorTheme:'windowLight', 
    blockedTo: ['n', 'e']
  },
  {
    lat: 1,
    long: 4,
    level: 0,
    name: '',
    descriptiveName: '',
    colorTheme:'veryDark',
    blockedTo: ['w', 's']
  },
  {
    lat: 2,
    long: 4,
    level: 0,
    name: '',
    descriptiveName: '',
    colorTheme:'darkGreen',
    blockedTo: ['s', 'n']
  },
  {
    lat: 3,
    long: 4,
    level: 0,
    name: '',
    descriptiveName: '',
    colorTheme:'darkShadow',
    blockedTo: ['s', 'n']
  },
  {
    lat: 4,
    long: 4,
    level: 0,
    name: '',
    descriptiveName: '',
    colorTheme:'filteredOrange',
    blockedTo: ['s', 'e']
  }
];