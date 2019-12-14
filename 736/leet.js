/**
 * @param {string} expression
 * @return {number}
 */
var evaluate = function (expression) {

    return ParseExpression(expression, {})

};

function ParseExpression(expr, vars) {

    var words = []
    var word = ''

    for (var i = 0; i < expr.length; i++) {

        if (expr.charAt(i) == '(') {

            var skipCount = 0
            for (var x = i + 1; x < expr.length; x++) {
                if (expr.charAt(x) == '(') {
                    skipCount++
                } else if (expr.charAt(x) == ')') {
                    if (skipCount > 0) {
                        skipCount--
                    } else {

                        // we're about to resolve a nested bracket, set up the variable context
                        if (words[0] == 'let') {
                            AssignVariables(words, vars)
                        }
                    
                        words.push(ParseExpression(expr.substr(i + 1, x - i - 1), Object.assign({},vars)))
                        
                        i = x + 1

                        break;
                    }
                }
            }

        } else if (expr.charAt(i) != ' ') {
            word += expr.charAt(i)
        } else {
            // it must be a space
            words.push(word)
            word = ''
        }
    }

    if (word != "") {
        words.push(word)
    }

    if (words[0] == 'add' || words[0] == 'mult') {

        var num1, num2

        if (!(isNaN(words[1]))) {
            num1 = parseInt(words[1])
        } else {
            num1 = parseInt(vars[words[1]])
        }

        if (!(isNaN(words[2]))) {
            num2 = parseInt(words[2])
        } else {
            num2 = parseInt(vars[words[2]])
        }

        if (words[0] == 'add') {
            return num1 + num2
        } else {
            return num1 * num2
        }

    } else if (words[0] == 'let') {
        AssignVariables(words, vars)

        if (!(isNaN(words[words.length - 1]))) {
            return parseInt(words[words.length - 1])
        } else {
            var resp = vars[words[words.length - 1]]

            if (!(isNaN(resp))) {
                return resp
            } else {
                return parseInt(vars[resp])
            }

        }
    } else {
        return words[words.length - 1]
    }
}

function AssignVariables(words, vars) {
    
    for (var i = 1; i < words.length - 1; i++) {
        if ((i + 1) % 2 == 0) {
            vars[words[i]] = words[i + 1]
        }
    }

}