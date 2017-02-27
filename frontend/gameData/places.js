export const dimensions = [4, 4];

export const definitions = [
  {
    position: 'a1',
    name: 'A Darkened Room',
    descriptiveName: '',
    level: 0,
    colorTheme:'veryDark',
    blockedTo: ['w', 'n']
  },
  {
    position: 'a2',
    name: '',
    descriptiveName: '',
    level: 0,
    colorTheme:'ultraDark',
    blockedTo: ['e', 's']
  },
  {
    position: 'a3',
    name: '',
    descriptiveName: '',
    level: 0,
    colorTheme:'dimRed',
    blockedTo: ['w']
  },
  {
    position: 'a4',
    name: '',
    descriptiveName: '',
    level: 0,
    colorTheme:'dimRed',
    blockedTo: ['n', 'e']
  },
  {
    position: 'b1',
    name: 'The Hallway',
    descriptiveName: '',
    level: 0,
    colorTheme:'dim',
    blockedTo: ['w', 's'],
    onEnter: (place) => {
      console.log('Im fuggin in here!');
    }
  },
  {
    position: 'b2',
    name: '',
    descriptiveName: 'dimRed',
    level: 0,
    colorTheme:'normal',
    blockedTo: ['n', 'e'],
    canEnter: (place) => {
      return true;
    }
  },
  {
    position: 'b3',
    name: '',
    descriptiveName: '',
    level: 0,
    colorTheme:'dimRed',
    blockedTo: ['w', 'e']
  },
  {
    position: 'b4',
    name: '',
    descriptiveName: '',
    level: 0,
    colorTheme:'dimRed',
    blockedTo: ['w', 's', 'e']
  },
  {
    position: 'c1',
    name: '',
    descriptiveName: '',
    level: 0,
    colorTheme:'dimRed',
    blockedTo: ['w', 'n', 'e']
  },
  {
    position: 'c2',
    name: '',
    descriptiveName: '',
    level: 0,
    colorTheme:'dim',
    blockedTo: ['w', 's']
  },
  {
    position: 'c3',
    name: '',
    descriptiveName: '',
    level: 0,
    colorTheme:'dim',
    blockedTo: ['s']
  },
  {
    position: 'c4',
    name: '',
    descriptiveName: '',
    level: 0,
    colorTheme:'windowLight', 
    blockedTo: ['n', 'e']
  },
  {
    position: 'd1',
    name: '',
    descriptiveName: '',
    level: 0,
    colorTheme:'veryDark',
    blockedTo: ['w', 's']
  },
  {
    position: 'd2',
    name: '',
    descriptiveName: '',
    level: 0,
    colorTheme:'darkGreen',
    blockedTo: ['s', 'n']
  },
  {
    position: 'd3',
    name: '',
    descriptiveName: '',
    level: 0,
    colorTheme:'darkShadow',
    blockedTo: ['s', 'n']
  },
  {
    position: 'd4',
    name: '',
    descriptiveName: '',
    level: 0,
    colorTheme:'filteredOrange',
    blockedTo: ['s', 'e']
  }
];