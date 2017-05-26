var SemChecker = function () {
    this.syntaxTree = undefined;
    this.definedFunctions = {};
};

var DefinedFunction = function (name, func) {
    this.name = name;
    this.functions = func;
};

var Position = function (p, n) {
    this.posLine = p;
    this.numLine = n;
};

SemChecker.prototype.check = function (syntaxTree) {

    this.syntaxTree = syntaxTree;

    this.definedFunctions = {};

    this._scanFunctionsDefinitions();
    this._scanMainFunctionsDefinitions();
};

SemChecker.prototype._scanFunctionsDefinitions = function () {

    var definedFunctionsTmp = this.definedFunctions;

    this.syntaxTree.functions.every(function (func) {

        var pos = new Position(func.posLine, func.numLine);

        if (definedFunctionsTmp[func.name] !== undefined) {
            var type = "Function " + func.name + "is not defined";
            ErrorHandler.error(new MyError(ErrorType.SEMANTICERROR, type, pos.posLine, pos.numLine));
            return false;
        }

        definedFunctionsTmp[func.name] = new ExeFunction(func.name);

        var funcTmp = definedFunctionsTmp[func.name];
        func.parameters.forEach(function (variable) {
            if (!funcTmp.scopeProto._addVariable(variable.nameParameter, variable.typeParameter)) {
                var type = "Bad variable";
                ErrorHandler.error(new MyError(ErrorType.SEMANTICERROR, type, pos.posLine, pos.numLine));
                return false;
            }
            funcTmp.scopeProto._setVariableDefined(variable.nameParameter);
        });
        return true;
    });
};

SemChecker.prototype._scanMainFunctionsDefinitions = function () {

    if (this.definedFunctions["main"] === undefined) {
        var type = "Function main is not defined";
        ErrorHandler.error(new MyError(ErrorType.SEMANTICERROR, type, "", ""));
    }
};

SemChecker.prototype._getExeTree = function () {
    var functions = [];

    var checkerTmp = this;

    this.syntaxTree.functions.forEach(function (func) {
        functions.push(checkerTmp._checkFunctions(func))
    });

    return functions;
};

SemChecker.prototype._checkFunctions = function (func) {
    var checkedFunction = this.definedFunctions[func.name];

    checkedFunction.instructions.push(this._checkBlock(checkedFunction.scopeProto, func.blockStatement));

    return checkedFunction;
};

SemChecker.prototype._checkBlock = function (scopeProto, blockStatement) {
    var block = new Block();

    block.scopeProto.parentScope = scopeProto;

    var thisTmp = this;
    if (blockStatement.functions !== undefined) {
        blockStatement.functions.forEach(function (func) {
            var node;
            switch (func.getType()) {
                case "VarDeclarationNode": {
                    node = func;

                    thisTmp._checkVarDeclaration(block.scopeProto, node.name);

                    if (node.value !== undefined && node.value !== "") {
                        block.instructions.push(thisTmp._checkAssignment(block.scopeProto, node.name, node.value, new Position(node.posLine, node.numLine)));
                    }
                    break;
                }
                case "ResponseDeclarationNode": {
                    node = func;
                    thisTmp._checkResponseDeclaration(block.scopeProto, node.name);

                    if (node.value !== undefined && node.value !== "") {
                        block.instructions.push(thisTmp._checkAssignment(block.scopeProto, node.name, node.value, new Position(node.posLine, node.numLine)));
                    }
                    break;
                }
                case "BodyDeclarationNode": {
                    node = func;
                    thisTmp._checkBodyDeclaration(block.scopeProto, node.name);

                    if (node.body !== undefined && node.body !== "") {
                        block.instructions.push(thisTmp._checkAssignment(block.scopeProto, node.name, node.body, new Position(node.posLine, node.numLine)));
                    }
                    break;
                }
                case "TestDeclarationNode": {
                    node = func;
                    thisTmp._checkTestDeclaration(block.scopeProto, node.name);

                    if (node.value !== undefined && node.value !== "") {
                        block.instructions.push(thisTmp._checkAssignment(block.scopeProto, node.name, node.value, new Position(node.posLine, node.numLine)));
                    }
                    break;
                }
                case "AssignmentNode": {
                    node = func;
                    block.instructions.push(thisTmp._checkAssignment(block.scopeProto, node.variable.name, node.value, new Position(node.posLine, node.numLine)));
                    break;
                }
                case "ReturnStatementNode": {
                    node = func;
                    block.instructions.push(thisTmp._checkReturnStatement(block.scopeProto, node.value, new Position(node.posLine, node.numLine)));
                    break;
                }
                case "FunctionCallNode": {
                    node = func;
                    block.instructions.push(thisTmp._checkFunctionCall(block.scopeProto, node, new Position(node.posLine, node.numLine)));
                    break;
                }
                case "StatementBlock": {
                    node = func;
                    block.instructions.push(thisTmp._checkBlock(block.scopeProto, node, new Position(node.posLine, node.numLine)));
                    break;
                }
                case "IfStatementNode": {
                    node = func;
                    block.instructions.push(thisTmp._checkIfStatement(block.scopeProto, node, new Position(node.posLine, node.numLine)));
                    break;
                }
                case "ForStatementNode": {
                    node = func;
                    block.instructions.push(thisTmp._checkForStatement(block.scopeProto, node, new Position(node.posLine, node.numLine)));
                    break;
                }
                case "BreakStatementNode": {
                    node = func;
                    node.isBreak = func.isBreak;
                    block.instructions.push(node);
                    break;
                }
                default: {
                    var type = "Function " + func + " is bad type";
                    ErrorHandler.error(new MyError(ErrorType.SEMANTICERROR, type, func.posLine, func.numLine));
                }
            }
        });
    }
    return block;
};

SemChecker.prototype._checkVarDeclaration = function (scopeProto, name, position) {
    if (!scopeProto._addVariable(name, TokenType.VAR)) {
        var type = "VariableNode " + name.name + "  is already defined";
        ErrorHandler.error(new MyError(ErrorType.SEMANTICERROR, type, position.posLine, position.numLine));
    }
};

SemChecker.prototype._checkResponseDeclaration = function (scopeProto, name, position) {
    if (!scopeProto._addVariable(name, TokenType.RESPONSE)) {
        var type = "VariableNode " + name.name + "  is already defined";
        ErrorHandler.error(new MyError(ErrorType.SEMANTICERROR, type, "", ""));
    }
};

SemChecker.prototype._checkBodyDeclaration = function (scopeProto, name, position) {
    if (!scopeProto._addVariable(name, TokenType.BODY)) {
        var type = "VariableNode " + name.name + " is already defined";
        ErrorHandler.error(new MyError(ErrorType.SEMANTICERROR, type, position.posLine, position.numLine));
    }
};

SemChecker.prototype._checkTestDeclaration = function (scopeProto, name, position) {
    if (!scopeProto._addVariable(name, TokenType.TEST)) {
        var type = "VariableNode " + name.name + " is already defined";
        ErrorHandler.error(new MyError(ErrorType.SEMANTICERROR, type, position.posLine, position.numLine));
    }
};

SemChecker.prototype._checkAssignment = function (scopeProto, name, assignable, position) {
    var node = new AssignemetInstr();

    if (!scopeProto._hasVariable(name)) {
        var type = "VariableNode " + name + " is not defined";
        ErrorHandler.error(new MyError(ErrorType.SEMANTICERROR, type, position.posLine, position.numLine));

        return undefined;
    }

    node.variable.name = name;
    node.value = this._checkAssignable(scopeProto, assignable, position);

    scopeProto._setVariableDefined(name);

    return node;
};

SemChecker.prototype._checkAssignable = function (scopeProto, assignable, position) {

    switch (assignable.getType()) {
        case "FunctionCallNode": {
            return this._checkFunctionCall(scopeProto, assignable, position);
        }
        case "ExpressionNode": {
            return this._checkExpression(scopeProto, assignable, position);
        }
        case "TestNode": {
            return this._checkTest(scopeProto, assignable, position);
        }
        case "BodyNode": {
            return this._checkBody(scopeProto, assignable, position);
        }
        case "ResponseNode": {
            return this._checkResponse(scopeProto, assignable, position);
        }
        default: {
            return undefined
        }
    }
};

SemChecker.prototype._checkFunctionCall = function (scopeProto, call, position) {
    if (this.definedFunctions[call.name] === undefined) {

        var type = "Function " + call.name + " is undefined";
        ErrorHandler.error(new MyError(ErrorType.SEMANTICERROR, type, position.posLine, position.numLine));
        return undefined;
    }

    if (this.definedFunctions[call.name] !== undefined) {
        var functionDef = this.definedFunctions[call.name];
        if (Object.keys(functionDef.scopeProto.variables).length !== call.arguments.length) {
            var type = "Function " + call.name + " get wrong number of variables";
            ErrorHandler.error(new MyError(ErrorType.SEMANTICERROR, type, position.posLine, position.numLine));
            return undefined;
        }
    }

    var obj = new CallInstr();
    obj.name = call.name;

    var thisTmp = this;
    obj.arguments = call.arguments.map(function (arg) {
        return thisTmp._checkAssignable(scopeProto, arg, position)
    });

    return obj;
};

SemChecker.prototype._checkBody = function (scopeProto, body) {

    var obj = new Body();

    if (body.getType() === "BodyNode")
        obj.body = body;
    else {

    }
    return obj;
};

SemChecker.prototype._checkResponse = function (scopeProto, response) {

    var obj = new Response();

    if (response.getType() === "ResNode")
        obj.body = body;
    else {

    }
    return obj;
};

SemChecker.prototype._checkTest = function (scopeProto, test, position) {

    var obj = new Test();

    if (typeof test.url === 'string' || test.url instanceof String) {
        obj.url = test.url;
    } else if (test.url.getType() === "VariableNode") {
        obj.url = this._checkVariable(scopeProto, test.url, position)
    } else {
        var type = "Invalid argument";
        ErrorHandler.error(new MyError(ErrorType.SEMANTICERROR, type, position.posLine, position.numLine));
    }

    obj.body = this._checkBody(scopeProto, test.body);

    return obj;
};

SemChecker.prototype._checkExpression = function (scopeProto, expression, position) {
    var obj = new ExeExpression();

    obj.operations = expression.operations;

    var thisTmp = this;

    expression.operants.forEach(function (operand) {
        {
            //isnumber
            if (!isNaN(parseFloat(operand)) && isFinite(operand)) {
                obj.operants.push(operand);
            } else if (operand.getType() === "ExpressionNode") {
                obj.operants.push(thisTmp._checkExpression(scopeProto, operand, position));
            } else if (operand.getType() === "VariableNode") {
                obj.operants.push(thisTmp._checkVariable(scopeProto, operand, position));
            }
            else {
                var type = "Invalid expression argument";
                ErrorHandler.error(new MyError(ErrorType.SEMANTICERROR, type, position.posLine, position.numLine));
            }
        }
    });

    return obj;
};

SemChecker.prototype._checkVariable = function (scopeProto, variable, position) {
    var obj = new ExeVariable();

    if (!scopeProto._hasVariable(variable.name, position)) {
        var type = "VariableNode " + variable.name + " is not defined";
        ErrorHandler.error(new MyError(ErrorType.SEMANTICERROR, type, position.posLine, position.numLine));

        return undefined;
    }

    if (!scopeProto._isVariableDefined(variable.name, position)) {
        var type = "VariableNode " + variable.name + " is empty";
        ErrorHandler.error(new MyError(ErrorType.SEMANTICERROR, type, position.posLine, position.numLine));

        return undefined;
    }

    obj.name = variable.name;

    return obj;
};

SemChecker.prototype._checkReturnStatement = function (scopeProto, assignable, position) {
    var obj = new ReturnInstr();

    obj.value = this._checkAssignable(scopeProto, assignable, position);

    return obj;
};

SemChecker.prototype._checkIfStatement = function (scopeProto, stmt, position) {
    var obj = new IfStatementInstr();

    obj.condition = this._checkCondition(scopeProto, stmt.condition, position);

    obj.trueBlock = this._checkBlock(scopeProto, stmt.trueBlock, position);

    if (stmt.falseBlock !== undefined) {
        obj.falseBlock = this._checkBlock(scopeProto, stmt.falseBlock, position);
    }
    return obj;
};

SemChecker.prototype._checkForStatement = function (scopeProto, stmt, position) {
    var obj = new ForStatementinstr();

    if (stmt.end.getType() === "VariableNode")
        obj.end = this._checkVariable(scopeProto, stmt.end, position);
    else if (stmt.end.getType() === "ExpressionNode")
        obj.end = this._checkExpression(scopeProto, stmt.end, position);
    else {
        var type = "Invalid condition value";
        ErrorHandler.error(new MyError(ErrorType.SEMANTICERROR, type, position.posLine, position.numLine));
    }

    if (stmt.start.getType() === "VariableNode")
        obj.start = this._checkVariable(scopeProto, stmt.start, position);
    else if (stmt.start.getType() === "ExpressionNode")
        obj.start = this._checkExpression(scopeProto, stmt.start, position);
    else {
        var type = "Invalid condition value";
        ErrorHandler.error(new MyError(ErrorType.SEMANTICERROR, type, position.posLine, position.numLine));
    }

    obj.block = this._checkBlock(scopeProto, stmt.block, position);

    return obj;
};

SemChecker.prototype._checkCondition = function (scopeProto, condition, position) {

    var obj = new ExeCondition();

    obj.operator = condition.operator;
    obj.negated = condition.negated;

    var thisTmp = this;

    condition.operants.forEach(function (operand) {
        {
            if ((!isNaN(parseFloat(operand)) && isFinite(operand)) || operand.name === "false" || operand.name === "true") {
                obj.operants.push(operand);
            } else if (operand.getType() === "ConditionNode") {
                obj.operants.push(thisTmp._checkCondition(scopeProto, operand, position));

            } else if (operand.getType() === "ExpressionNode") {
                obj.operants.push(thisTmp._checkExpression(scopeProto, operand, position));
            } else if (operand.getType() === "VariableNode") {
                obj.operants.push(thisTmp._checkVariable(scopeProto, operand, position));
            } else {
                var type = "Invalid condition value";
                ErrorHandler.error(new MyError(ErrorType.SEMANTICERROR, type, position.posLine, position.numLine));
            }
        }
    });

    return obj;
};

var lexer;
//
// function start() {
//     lexer = new Parser();
//
//     lexer.lexer.fileReader.load();
// }
//
// function nextToken() {
//     var sem = new SemChecker();
//     console.log(sem, lexer);
//     console.log(sem.check(lexer.parse()));
//     console.log(sem._getExeTree());
// }