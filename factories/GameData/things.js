module.exports.things = [
    {
        name: 'book',
        canHold: true,
        canUse: true,
        description: `The book is brown with a golden imprint. It's rather tattered looking.`, 
        position: [2,1],
        situation: 'on',
        isLocked: false,
        useCount: 0,
        useLimit: 0,
    },
    {
        name: 'key',
        canHold: true,
        canUse: true,
        description: `The key is heavy. Looks pretty old as well. There's an inscription reading "With love".`, 
        position: [2,2],
        situation: 'on'
    },
    {
        name: 'beer can',
        canHold: true,
        canUse: true,
        description: `Coors. Empty and slightly dented. There is red lipstick along it's rim`, 
        position: [3,2],
        situation: 'on'
    },
    {
        name: 'underwire bra',
        canHold: true,
        canUse: true,
        description: 'A lacey undergarment. Large enough to wear as a Roman war helmet.', 
        position: [3,2],
        situation: 'on'
    },
    {
        name: 'metal door',
        canHold: false,
        canUse: true,
        description: `The door looks like it would withstand nuclear testing. It's gray and scratched. There's a key hole under the rusty handle.`, 
        position: [3,3],
        situation: 'fixed',
        isLocked: true,
        hasRequirement: true,
        requirement: 'key',
    }
];