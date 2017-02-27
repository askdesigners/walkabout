
class Command {

  constructor(name) {

    this.name = name || ''
    this.caseSensitive = false
  }

  set(property, value) {
    this[property] = value
    return this
  }


  returnMatchingCommands(validators, lexemes) {

    // try each syntax form
    if (this.syntax) {
      for (var index in this.syntax) {
        var syntaxLexemes = this.syntax[index].split(' ');
        var valid = this.trySyntaxKeywords(syntaxLexemes, lexemes);
        // valid syntax pattern found... now check that arg lexemes are proper
        if (valid) {
          return { validCommand: true, command: this, syntaxLexemes: syntaxLexemes };
        } else {
          return null;
        }
      }
    }
  }

  testValidators(syntaxLexemes, validators, lexemes) {
    // assumes valid command
    // returns: { valid[bool], args }

    // if the last syntax lexeme ends with an *, amalgamate execess
    // submitted lexemes to the submitted lexemes at the same
    // position as the last syntax lexeme
    
    
    var lastSyntaxLexemeIndex = syntaxLexemes.length - 1
    if (syntaxLexemes[lastSyntaxLexemeIndex].match(/\*>$/)) {
      var joinedLexemes = lexemes.slice(lastSyntaxLexemeIndex, lexemes.length).join(' ');
      var syntaxPart = lexemes.slice(0, lastSyntaxLexemeIndex);
      
      lexemes = [].concat(syntaxPart, joinedLexemes);
      
      
    } else if(syntaxLexemes[lastSyntaxLexemeIndex].match(/\*\d>$/)){
      
    }

    // see if the arguments given to the command are valid
    var result = this.determineCommandArguments(validators, syntaxLexemes, lexemes);
    return result;
  }

  type(object) {
    return object.constructor.name;
  }

  trySyntaxKeywords(syntaxLexemes, submittedLexemes) {

    var valid = true,
      lexemeToTest = 0,
      secondToLast;

    for (var index in syntaxLexemes) {

      var syntaxLexeme = syntaxLexemes[index];
      var submittedLexeme = submittedLexemes[lexemeToTest];

      if (!this.caseSensitive) {
        syntaxLexeme = (typeof syntaxLexeme == 'string')
          ? syntaxLexeme.toLowerCase()
          : syntaxLexeme;
        submittedLexeme = (typeof submittedLexeme == 'string')
          ? submittedLexeme.toLowerCase()
          : submittedLexeme;
      }

      // if lexeme doesn't reference an object, test as a keyword
      if (syntaxLexeme[0] != '<' && (syntaxLexeme != submittedLexeme)) {
        valid = false;
      }

      lexemeToTest++;
    }

    secondToLast = syntaxLexemes[index][(syntaxLexemes[index].length - 2)]

    // if final syntax lexeme didn't end with a * character and length of syntax
    // vs submitted is different then invalid
    if (secondToLast != '*' && syntaxLexemes.length != submittedLexemes.length) {
      valid = false
    }
    return valid
  }

  trimArgDelimiters(arg) {
    return arg.slice(1, arg.length - 1)
  }

  determineCommandArguments(validators, syntaxLexemes, inputLexemes) {
    var lexemeToTest = 0,
      lexemes = inputLexemes,
      success = true,
      arg = {},
      referenceData,
      referenceType,
      referenceName;
      
    for (var index in syntaxLexemes) {

      var lexeme = syntaxLexemes[index]

      if (lexeme[0] == '<') {

        // determine reference type
        referenceData = this.trimArgDelimiters(lexeme).split(':')
        referenceType = referenceData[0]

        // trim "<" and ">" from reference to determine reference type
        referenceName = (referenceData[1])
          ? referenceData[1].replace('*','')
          : referenceType
          
        // if there's a validator, use it to test lexeme
        if (validators[referenceType]) {

          // need to return an object with success, value, and message
          // success determines whether validation was successful
          // value allows transformation of the lexeme
          // message allows a message to be passed back???
          var result = validators[referenceType](lexemes[lexemeToTest]);
          if (result.success) {
            arg[referenceName] = (result.value === undefined)
              ? lexemes[lexemeToTest]
              : result.value
          } else {
            // if error is set to a string this message will be returned to the user
            if (result.message) {
              return { 'success': false, 'message': result.message }
            }
          }

        } else {

          if (referenceData.length == 1
            || typeof lexemes[lexemeToTest] == referenceType
          ) {
            arg[referenceName] = lexemes[lexemeToTest]
          }
          else {
            // if error is simply true a generic error message will be returned to the user
            success = false
          }
        }
      }

      lexemeToTest += 1
    }

    return {
      'success': success,
      'args': arg
    }
  }
}

export default Command;