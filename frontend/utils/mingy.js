import Command from './command';

class Parser {
  
  constructor(commands) {
    this.commands = {};
    this.validators = {};
    this.env = {};
    this.lexemeTransforms = [];
  }

  addCommand(name) {
    var command = new Command(name);
    this.commands[name] = command;
    return command;
  }

  addValidator(name, logic) {
    this.validators[name] = logic;
  }
  
  addFailCatch(logic){
    this.failCatch = logic;
  }

  addLexemeTransform(logic) {
    this.lexemeTransforms.push(logic);
  }

  parse(input) {
    input = this.cleanInput(input);
    var lexemes = input.split(' ');
    return this.parseLexemes(lexemes);
  }

  cleanInput(input) {
    input = input.replace("\r\n", "\n");
    if (input.slice(-1) == "\n") {
      input = input.slice(0, input.length - 1);
    }
    while (input.indexOf('  ') != -1) {
      input = input.replace('  ', ' ');
    }
    return input;
  }

  validCommands(lexemes) {

    var matchingCommands = [];
    // cycle through commands looking for syntax match
    
    for (var index in this.commands) {
      var command = this.commands[index];
      // we clone lexemes because if the last syntax lexeme has a wildcard the
      // submitted lexeme corresponding to the last syntax lexeme ends up
      // getting subsequent submitted lexemes added to it
      var vettedCommand = command.returnMatchingCommands(this.validators, this.clone(lexemes));
      if (vettedCommand !== null) {
        matchingCommands.push(vettedCommand);
      }
    }
    return matchingCommands;
  }

  parseLexemes(lexemes) {

    // transformations first
    for (var index in this.lexemeTransforms) {
      lexemes = this.lexemeTransforms[index](lexemes, this.env);
    }

    var validatedCommands = this.validCommands(lexemes);
  
    if(validatedCommands.length > 0){
      
      for (var index in validatedCommands) {
        var command = validatedCommands[index].command;
        var validatedResults = command.testValidators(validatedCommands[index].syntaxLexemes, this.validators, this.clone(lexemes));
        if(validatedResults.success){
          command.success(validatedResults);
        } else {
          command.fail(validatedResults);
        }
      }
    } else {
      this.failCatch({success: false, message: "I don't know what you mean..."})
    }
  }

  clone(obj) {
    var newObj = (obj instanceof Array) ? [] : {};
    for (var i in obj) {
      if (i == 'clone') continue;
      if (obj[i] && typeof obj[i] == "object") {
        newObj[i] = this.clone(obj[i]);
      } else newObj[i] = obj[i];
    } return newObj;
  }
}

export default Parser;