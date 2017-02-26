import parser from '../utils/parser';

var commands = function (Game) {

    parser.addCommand('go')
        .set('syntax', ['go <validDirection:direction>', 'move <validDirection:direction>', 'walk <validDirection:direction>', 'run <validDirection:direction>'])
        .set('success', function (result) {
            if(result.args.direction === 'back'){
                Game.moveBack();
            } else {
                Game.moveTo(result.args.direction);
            }
        })
        .set('fail', function (result) {
            Game.responseHandler(result);
        });

    parser.addCommand('take')
        .set('syntax', ['take <validThing:thing*>', 'take the <validThing:thing*>', 'pick up <validThing:thing*>', 'pick up the <validThing:thing*>'])
        .set('success', function (result) {
            Game.pickupThing(result.args.thing);
        })
        .set('fail', function (result) {
            Game.responseHandler(result);
        });

    parser.addCommand('drop')
        .set('syntax', ['drop <validThing:thing*>', 'drop the <validThing:thing*>', 'put down <validThing:thing*>', 'put down the <validThing:thing*>'])
        .set('success', function (result) {
            Game.putDownThing(result.args.thing);
        })
        .set('fail', function (result) {
            Game.responseHandler(result);
        });

    parser.addCommand('lookat')
        .set('syntax', ['look at <validThing:thing*>', 'look at the <validThing:thing*>'])
        .set('success', function (result) {
            Game.lookAt(result.args.thing);
        })
        .set('fail', function (result) {
            Game.responseHandler(result);
        });
    
    parser.addCommand('look', 'look around')
        .set('syntax', ['look'])
        .set('success', function (result) {
            Game.lookAround();
        })
        .set('fail', function (result) {
            Game.responseHandler(result);
        });
    
    parser.addFailCatch(function(result){
        Game.responseHandler(result);
    });
};

export default commands;