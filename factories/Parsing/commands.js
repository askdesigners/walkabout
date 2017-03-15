let parser = require('./parser');

var commands = function (Game) {

    parser.addCommand('go')
        .set('syntax', ['go <validDirection:direction>', 'move <validDirection:direction>', 'walk <validDirection:direction>', 'run <validDirection:direction>'])
        .set('success', function ({user, validatedResults}) {
            if(validatedResults.args.direction === 'back'){
                Game.moveBack({user});
            } else {
                Game.moveTo({user, dir: validatedResults.args.direction});
            }
        })
        .set('fail', function ({user, validatedResults}) {
            Game.responseHandler({user, message: validatedResults.message});
        });

    parser.addCommand('take')
        .set('syntax', ['take <validThing:thing*>', 'take the <validThing:thing*>', 'pick up <validThing:thing*>', 'pick up the <validThing:thing*>'])
        .set('success', function ({user, validatedResults}) {
            Game.pickupThing({user, thing: validatedResults.args.thing});
        })
        .set('fail', function ({user, validatedResults}) {
            Game.responseHandler({user, message: validatedResults.message});
        });

    parser.addCommand('drop')
        .set('syntax', ['drop <validThing:thing*>', 'drop the <validThing:thing*>', 'put down <validThing:thing*>', 'put down the <validThing:thing*>'])
        .set('success', function ({user, validatedResults}) {
            Game.putDownThing({user, thing: validatedResults.args.thing});
        })
        .set('fail', function ({user, validatedResults}) {
            Game.responseHandler({user, message: validatedResults.message});
        });

    parser.addCommand('look at')
        .set('syntax', ['look at <validThing:thing*>', 'look at the <validThing:thing*>'])
        .set('success', function ({user, validatedResults}) {
            Game.lookAt({user, thing: validatedResults.args.thing});
        })
        .set('fail', function ({user, validatedResults}) {
            Game.responseHandler({user, message: validatedResults.message});
        });
    
    parser.addCommand('look around')
        .set('syntax', ['look', 'look around'])
        .set('success', function ({user, validatedResults}) {
            Game.lookAround({user});
        })
        .set('fail', function ({user, validatedResults}) {
            Game.responseHandler({user, message: validatedResults.message});
        });
    
    parser.addCommand('inventory')
        .set('syntax', ['what do I have', `what's in my bag`, 'what do I have?', `what's in my bag?`, 'inventory', 'items'])
        .set('success', function ({user, validatedResults}) {
            Game.playerIsHolding({user});
        })
        .set('fail', function ({user, validatedResults}) {
            Game.responseHandler({user, message: validatedResults.message});
        });
    
    parser.addFailCatch(function({user, message}){
        Game.responseHandler({user, message});
    });
};

module.exports = commands;