var Parser = function () {
    this.lexer = new Lexer();
    this.oneTokenBuffor = undefined;
};

var Parameter = function (typeParameter, nameParameter) {
    this.typeParameter = typeParameter;
    this.nameParameter = nameParameter;
};

var Quote = function (quote) {
    this.value = quote;
};


Parser.prototype.parse = function () {

    var func;
    var functions = [];
    this.oneTokenBuffor = this.lexer.token();
    var globalScope = new ScopeProto();

    globalScope.functions['print']= new PrintNode;
    globalScope.functions['send']= new SendNode;
    while ((func = this._parseFunction(globalScope) ) !== undefined) {
        functions.push(func);
    }

    var a = new ProgramNode(functions,globalScope);
    console.log(a);

    this._scanFunctionsDefinitions(globalScope);
    a.execute(globalScope);
    console.log(a);
    return new ProgramNode(functions,globalScope);
};

Parser.prototype._scanFunctionsDefinitions = function (globalScope) {

    for(var func in globalScope.functions) {
        if (globalScope.functions[func] === "") {
            var type = "Function " + func + "is not defined";
            ErrorHandler.error(new MyError(ErrorType.SEMANTICERROR, type, "", ""));
        }
    }

    if(globalScope.functions["main"] === undefined){
        var type = "Function main is not defined";
        ErrorHandler.error(new MyError(ErrorType.SEMANTICERROR, type, "", ""));
    }

};

Parser.prototype._parseVariable = function (name, type, scope) {
    //Brak accept bo przy decydowaniu czy funkacja czy zmennaa jest pobierany
    console.log("_parseVariable open");

    var variableNode = new VariableNode();

    if (!scope._hasVariable(name)) {
        var type = "VariableNode " + name + " is not defined";
        ErrorHandler.error(new MyError(type, ErrorType.SEMANTICERROR, "", ""));
    }

    if (!scope._isVariableDefined(name)) {
        var type = "VariableNode " + name + " is empty";
        ErrorHandler.error(new MyError(ErrorType.SEMANTICERROR, type, "", ""));
    }

    variableNode.setName(name);
    variableNode.setType(type);

    console.log("_parseVariable close", variableNode);

    return variableNode;
};

Parser.prototype._parseFunction = function (globalScope) {

    console.log("_parseFunction open");

    if (!Parser._tokenIsType(this.getCurrToken(), [TokenType.FUNCTION]))
        return undefined;

    this.accept([TokenType.FUNCTION]);

    var name = this.getCurrToken().value;
    this.accept([TokenType.IDENTIFIER]);

    //Funkcja może byc już zdefiniowana w wywołaniu
    if(globalScope.functions[name] === undefined)
        globalScope.functions[name] = "";

    var scope = new ScopeProto();
    scope.parentScope = globalScope;

    var parameters = this._parseParameters(scope);
    var block = this._parseBlock(scope);

    console.log("_parseFunction close");
    var funcTmp = new FunctionNode(name, parameters, block);

    globalScope.functions[name] = funcTmp;

    return funcTmp;
};

Parser.prototype._parseParameters = function (scope) {

    console.log("_parseParameters open");

    var param = [];

    var type;
    var name;

    this.accept([TokenType.PARENTHOPEN]);

    if (!Parser._tokenIsType(this.getCurrToken(), [TokenType.PARENTHCLOSE])) {

        type = this.getCurrToken().type;
        this.accept([TokenType.RESPONSE, TokenType.TEST, TokenType.URL, TokenType.VAR]);

        name = this.getCurrToken().value;
        this.accept([TokenType.IDENTIFIER]);

        param.push(new Parameter(type, name));
        scope._addVariable(name,type);
        scope._setVariableDefined(name);

        while (Parser._tokenIsType(this.getCurrToken(), [TokenType.COMMA])) {
            this.accept([TokenType.COMMA]);

            type = this.getCurrToken().type;
            this.accept([TokenType.RESPONSE, TokenType.TEST, TokenType.URL, TokenType.VAR]);

            name = this.getCurrToken().value;
            this.accept([TokenType.IDENTIFIER]);

            param.push(new Parameter(type, name));
            scope._addVariable(name,type);
            scope._setVariableDefined(name);
        }
    }
    this.accept([TokenType.PARENTHCLOSE]);

    console.log("_parseParameters close", param);

    return param;
};

Parser.prototype._parseBlock = function (scopeParent) {

    console.log("_parseBlock Open");

    if (!Parser._tokenIsType(this.getCurrToken(), [TokenType.BROCKETOPEN]))
        return undefined;

    this.accept(TokenType.BROCKETOPEN);

    var functionNode;
    var blockFunctionsNode = [];
    var scope = new ScopeProto();
    scope.parentScope = scopeParent;

    while ((functionNode = this._parseIfStatement(scope)) !== undefined ||
    (functionNode = this._parseForStatement(scope)) !== undefined ||
    (functionNode = this._parseAssignmentOrFunCall(scope)) !== undefined ||
    (functionNode = this._parseUrlDeclaration(scope)) !== undefined ||
    (functionNode = this._parseVarDeclaration(scope)) !== undefined ||
    (functionNode = this._parseTestDeclaration(scope)) !== undefined ||
    (functionNode = this._parseBodyDeclaration(scope)) !== undefined ||
    (functionNode = this._parseResponseDeclaration(scope)) !== undefined ||
    (functionNode = this._parseReturnStatement(scope)) !== undefined ||
    (functionNode = this._parseBlock(scope)) !== undefined ||
    (functionNode = this._parseLoopBreak(scope)) !== undefined) {
        blockFunctionsNode.push(functionNode);
    }

    this.accept(TokenType.BROCKETCLOSE);

    console.log("_parseBlock End");

    return new BlockStatementNode(blockFunctionsNode, scope);
};

Parser.prototype._parseIfStatement = function (scope) {

    console.log("_parseIfStatement Open");

    if (!Parser._tokenIsType(this.getCurrToken(), [TokenType.IF]))
        return undefined;

    this.accept([TokenType.IF]);
    this.accept([TokenType.PARENTHOPEN]);

    var condition = this._parseCondition(scope);

    this.accept([TokenType.PARENTHCLOSE]);

    var trueBlock = this._parseBlock(scope);

    var falseBlock;

    if (Parser._tokenIsType(this.getCurrToken(), [TokenType.ELSE])) {
        this.accept(TokenType.ELSE);
        falseBlock = this._parseBlock(scope);
    }

    console.log("_parseIfStatement Close");

    return new IfStatementNode(condition, trueBlock, falseBlock);
};

Parser.prototype._parseCondition = function (scope) {

    console.log("_parseCondition Open");

    var operants = [];
    var operator;

    operants.push(this._parseAndCondition(scope));

    while (Parser._tokenIsType(this.getCurrToken(), [TokenType.OR])) {
        operator = this.getCurrToken().type;
        this.accept([TokenType.OR]);
        operants.push(this._parseAndCondition(scope));
    }

    console.log("_parseCondition Close");

    return new ConditionNode(operants, operator);
};

Parser.prototype._parseAndCondition = function (scope) {

    console.log("_parseAndCondition Open");

    var operants = [];
    var operator;

    operants.push(this._parseEqualityCondition(scope));

    while (Parser._tokenIsType(this.getCurrToken(), [TokenType.AND])) {
        operator = this.getCurrToken().type;
        this.accept([TokenType.AND]);
        operants.push(this._parseEqualityCondition(scope));
    }

    console.log("_parseAndCondition Close");

    return new ConditionNode(operants, operator);
};

Parser.prototype._parseEqualityCondition = function (scope) {

    console.log("_parseEqualityCondition Open");

    var operants = [];
    var operator;

    operants.push(this._parseRelationalCondition(scope));

    while (Parser._tokenIsType(this.getCurrToken(), [TokenType.EQUALITY, TokenType.INEQUALITY])) {
        operator = this.getCurrToken().type;
        this.accept([TokenType.EQUALITY, TokenType.INEQUALITY]);
        operants.push(this._parseRelationalCondition(scope));
    }

    console.log("_parseEqualityCondition Close");

    return new ConditionNode(operants, operator);
};

Parser.prototype._parseRelationalCondition = function (scope) {

    console.log("_parseRelationalCondition Open");

    var operants = [];
    var operator;

    operants.push(this._parsePrimaryCondition(scope));

    while (Parser._tokenIsType(this.getCurrToken(), [TokenType.LESS, TokenType.LESSOREQUAL, TokenType.GREATER, TokenType.GREATEROREQUAL])) {
        operator = this.getCurrToken().type;
        this.accept([TokenType.LESS, TokenType.LESSOREQUAL, TokenType.GREATER, TokenType.GREATEROREQUAL]);
        operants.push(this._parsePrimaryCondition(scope));
    }

    console.log("_parseRelationalCondition Close");

    return new ConditionNode(operants, operator);
};

Parser.prototype._parsePrimaryCondition = function (scope) {

    console.log("_parsePrimaryCondition Open");

    var operants = [];
    var operator = undefined;
    var negation = false;

    if (Parser._tokenIsType(this.getCurrToken(), [TokenType.NEGATION])) {
        this.accept([TokenType.NEGATION]);
        negation = true;
    }

    if (Parser._tokenIsType(this.getCurrToken(), [TokenType.PARENTHOPEN])) {
        this.accept([TokenType.PARENTHOPEN]);
        operants.push(this._parseCondition(scope));
        this.accept([TokenType.PARENTHCLOSE]);
    } else {
        if (Parser._tokenIsType(this.getCurrToken(), [TokenType.IDENTIFIER])) {
            var name = this.getCurrToken().value;
            var type = this.getCurrToken().type;
            this.accept([TokenType.IDENTIFIER]);
            operants.push(this._parseVariable(name, type, scope));
        } else {
            operants.push(this._parseLiteral());
        }
    }

    console.log("_parsePrimaryCondition Close");

    var conditionNode = new ConditionNode(operants, operator);
    if (negation)
        conditionNode.setNegated();
    return conditionNode;
};

Parser.prototype._parseForStatement = function (scope) {

    console.log("_parseForStatement Open");
    if (!Parser._tokenIsType(this.getCurrToken(), [TokenType.FOR]))
        return undefined;

    this.accept(TokenType.FOR);

    var start;
    var end;

    var name;
    var type;

    if (Parser._tokenIsType(this.getCurrToken(), [TokenType.IDENTIFIER])) {
        name = this.getCurrToken().value;
        type = this.getCurrToken().type;
        this.accept([TokenType.IDENTIFIER]);
        start = this._parseVariable(name, type, scope);
    }

    if (Parser._tokenIsType(this.getCurrToken(), [TokenType.NUMBERLITERAL]))
        start = this._parseExpression(this.getCurrToken().value, this.getCurrToken().type, scope);

    this.accept([TokenType.FORTO]);

    if (Parser._tokenIsType(this.getCurrToken(), [TokenType.IDENTIFIER])) {
        name = this.getCurrToken().value;
        type = this.getCurrToken().type;
        this.accept([TokenType.IDENTIFIER]);
        end = this._parseVariable(name, type, scope);
    }
    if (Parser._tokenIsType(this.getCurrToken(), [TokenType.NUMBERLITERAL]))
        end = this._parseExpression(this.getCurrToken().value, this.getCurrToken().type);

    var block = this._parseBlock(scope);

    console.log("_parseForStatement Close");

    return new ForStatementNode(start, end, block);
};

Parser.prototype._parseAssignmentOrFunCall = function (scope) {

    console.log("_parseAssignmentOrFunCall Open");

    if (!Parser._tokenIsType(this.getCurrToken(), [TokenType.IDENTIFIER]))
        return undefined;

    var name = this.getCurrToken().value;
    var type = this.getCurrToken().type;
    this.accept([TokenType.IDENTIFIER]);

    if (Parser._tokenIsType(this.getCurrToken(), [TokenType.PARENTHOPEN])) {
        console.log("_parseAssignmentOrFunCall Close");
        var funCall = this._parseFunCall(name, scope);
        this.accept([TokenType.SEMICOLN]);
        return funCall;
    } else {
        scope._setVariableDefined(name);
        var variable = this._parseVariable(name, type, scope);
        this.accept([TokenType.ASSIGNEMENT]);
        var value = this._parseAssignable(scope);

        console.log("_parseAssignmentOrFunCall Close");

        this.accept([TokenType.SEMICOLN]);

        return new AssignmentNode(variable, value)
    }
};

Parser.prototype._parseAssignable = function (scope) {

    console.log("_parseAssignable Open");

    var name = this.getCurrToken().value;
    var type = this.getCurrToken().type;

    switch (type) {
        case TokenType.IDENTIFIER:
            this.accept([TokenType.IDENTIFIER]);

            if (Parser._tokenIsType(this.getCurrToken(), [TokenType.PARENTHOPEN])) {

                console.log("_parseAssignable Close");
                return this._parseFunCall(name, scope);
            }
            else {
                console.log("_parseAssignable Close");
                return this._parseExpression(name, type, scope);
            }
        case TokenType.SQUAREBRACKETOPEN:
            console.log("_parseAssignable Close");
            return this._parseTest(scope);
        case TokenType.BROCKETOPEN:
            console.log("_parseAssignable Close");
            return this._parseBody(scope);
        case TokenType.QUOTE:
            this.accept([TokenType.QUOTE]);
            console.log("_parseAssignable Close");
            return new Quote(name);
        default:
            console.log("_parseAssignable Close");
            return this._parseExpression(name, type, scope);
    }
};

Parser.prototype._parseExpression = function (name, type, scope) {

    console.log("_parseExpression Open");

    var operations = [];
    var operants = [];

    operants.push(this._parseMultiplicativeExpression(name, type, scope));

    while (Parser._tokenIsType(this.getCurrToken(), [TokenType.PLUS, TokenType.MINUS])) {
        var operatorType = this.getCurrToken().type;
        this.accept([TokenType.PLUS, TokenType.MINUS]);
        operations.push(operatorType);
        if(Parser._tokenIsType(this.getCurrToken(), [TokenType.IDENTIFIER])) {
            var nname = this.getCurrToken().value;
            var ttype = this.getCurrToken().type;
            this.accept([TokenType.IDENTIFIER]);
            operants.push(this._parseMultiplicativeExpression(nname, ttype, scope));
        } else
            operants.push(this._parseMultiplicativeExpression(undefined,undefined,scope));
    }

    console.log("_parseExpression Close");

    return new ExpressionNode(operations, operants);
};

Parser.prototype._parseMultiplicativeExpression = function (name, type, scope) {

    console.log("_parseMultiplicativeExpression Open");

    var operations = [];
    var operants = [];

    operants.push(this._parsePrimaryExpression(name, type, scope));

    while (Parser._tokenIsType(this.getCurrToken(), [TokenType.MULTIPLY, TokenType.DIVIDE, TokenType.MODULO])) {
        var operatorType = this.getCurrToken().type;
        this.accept([TokenType.MULTIPLY, TokenType.DIVIDE, TokenType.MODULO]);
        operations.push(operatorType);
        if(Parser._tokenIsType(this.getCurrToken(), [TokenType.IDENTIFIER])) {
            var nname = this.getCurrToken().value;
            var ttype = this.getCurrToken().type;
            this.accept([TokenType.IDENTIFIER]);
            operants.push(this._parsePrimaryExpression(nname, ttype, scope));
        } else
            operants.push(this._parsePrimaryExpression(undefined,undefined,scope));
    }

    console.log("_parseMultiplicativeExpression Close");

    return new ExpressionNode(operations, operants);
};

Parser.prototype._parsePrimaryExpression = function (name, type, scope) {

    console.log("_parsePrimaryExpression Open");

    var expressionNode;

    if (Parser._tokenIsType(this.getCurrToken(), [TokenType.PARENTHOPEN])) {
        this.accept([TokenType.PARENTHOPEN]);
        expressionNode = this._parseExpression(undefined, undefined, scope);
        this.accept([TokenType.PARENTHCLOSE]);

        console.log("_parsePrimaryExpression Close");
        return expressionNode;
    }

    if (name && type === TokenType.IDENTIFIER) {
        return this._parseVariable(name, type, scope);
    }

    return this._parseLiteral();
};

Parser.prototype._parseLiteral = function () {
    var negative = false;

    console.log("_parseLiteral Open");

    if (Parser._tokenIsType(this.getCurrToken(), [TokenType.MINUS])) {
        this.accept([TokenType.MINUS]);
        negative = true;
    }

    var operant = parseInt(this.getCurrToken().value);
    this.accept([TokenType.NUMBERLITERAL]);

    if (negative)
        operant = (-1) * operant;

    console.log("_parseLiteral Close");

    return new LiteralNode(operant);
};

Parser.prototype._parseVarDeclaration = function (scope) {
    console.log("_parseVarDeclaration");
    if (!Parser._tokenIsType(this.getCurrToken(), [TokenType.VAR]))
        return undefined;

    this.accept([TokenType.VAR]);

    var name = this.getCurrToken().value;
    this.accept([TokenType.IDENTIFIER]);
    var value;

    scope._addVariable(name,TokenType.VAR);

    if (Parser._tokenIsType(this.getCurrToken(), [TokenType.ASSIGNEMENT])) {
        this.accept([TokenType.ASSIGNEMENT]);
        value = this._parseAssignable(scope);
        scope._setVariableDefined(name);
    }

    this.accept([TokenType.SEMICOLN]);

    console.log("_parseVarDeclaration Close");

    return new VarDeclarationNode(name, value);
};

Parser.prototype._parseUrlDeclaration = function (scope) {
    console.log("_parseVarDeclaration");
    if (!Parser._tokenIsType(this.getCurrToken(), [TokenType.URL]))
        return undefined;

    this.accept([TokenType.URL]);

    var name = this.getCurrToken().value;
    this.accept([TokenType.IDENTIFIER]);
    var value;

    scope._addVariable(name,TokenType.URL);

    if (Parser._tokenIsType(this.getCurrToken(), [TokenType.ASSIGNEMENT])) {
        this.accept([TokenType.ASSIGNEMENT]);
        value = this._parseAssignable(scope);
        scope._setVariableDefined(name);
    }

    this.accept([TokenType.SEMICOLN]);

    console.log("_parseVarDeclaration Close");

    return new UrlDeclarationNode(name, value);
};

Parser.prototype._parseTestDeclaration = function (scope) {
    console.log("_parseTestDeclaration");
    if (!Parser._tokenIsType(this.getCurrToken(), [TokenType.TEST]))
        return undefined;

    this.accept([TokenType.TEST]);

    var name = this.getCurrToken().value;
    this.accept([TokenType.IDENTIFIER]);
    var value;

    scope._addVariable(name,TokenType.TEST);

    if (Parser._tokenIsType(this.getCurrToken(), [TokenType.ASSIGNEMENT])) {
        this.accept([TokenType.ASSIGNEMENT]);
        value = this._parseAssignable(scope);
        scope._setVariableDefined(name);
    }

    this.accept([TokenType.SEMICOLN]);

    console.log("_parseTestDeclaration Close");

    return new TestDeclarationNode(name, value);
};

Parser.prototype._parseBodyDeclaration = function (scope) {
    console.log("_parseBodyDeclaration");
    if (!Parser._tokenIsType(this.getCurrToken(), [TokenType.BODY]))
        return undefined;

    this.accept([TokenType.BODY]);

    var name = this.getCurrToken().value;
    this.accept([TokenType.IDENTIFIER]);
    var value;

    scope._addVariable(name,TokenType.BODY);


    if (Parser._tokenIsType(this.getCurrToken(), [TokenType.ASSIGNEMENT])) {
        this.accept([TokenType.ASSIGNEMENT]);
        value = this._parseAssignable(scope);
        scope._setVariableDefined(name);
    }

    this.accept([TokenType.SEMICOLN]);

    console.log("_parseBodyDeclaration Close");

    return new BodyDeclarationNode(name, value);
};

Parser.prototype._parseResponseDeclaration = function (scope) {
    console.log("_parseResponseDeclaration");
    if (!Parser._tokenIsType(this.getCurrToken(), [TokenType.RESPONSE]))
        return undefined;

    this.accept([TokenType.RESPONSE]);

    var name = this.getCurrToken().value;
    this.accept([TokenType.IDENTIFIER]);
    var value;

    scope._addVariable(name,TokenType.RESPONSE);

    if (Parser._tokenIsType(this.getCurrToken(), [TokenType.ASSIGNEMENT])) {
        this.accept([TokenType.ASSIGNEMENT]);
        value = this._parseAssignable(scope);
        scope._setVariableDefined(name);
    }

    this.accept([TokenType.SEMICOLN]);

    console.log("_parseResponseDeclaration Close");

    return new ResponseDeclarationNode(name, value);
};

Parser.prototype._parseBody = function () {
    console.log("_parseBody", this.getCurrToken());

    this.accept([TokenType.BROCKETOPEN]);

    var bodyElems = [];

    while (Parser._tokenIsType(this.getCurrToken(), [TokenType.QUOTE])) {
        var name = this.getCurrToken().value;
        this.accept([TokenType.QUOTE]);

        this.accept([TokenType.COLON]);
        var value = this.getCurrToken().value;
        this.accept([TokenType.QUOTE]);

        bodyElems.push(new BodyValue(name, value))
    }

    this.accept([TokenType.BROCKETCLOSE]);

    console.log("_parseBody Close");

    return new BodyNode(bodyElems);
};

Parser.prototype._parseTest = function (scope) {
    console.log("_parseTest");

    this.accept([TokenType.SQUAREBRACKETOPEN]);

    var url = this._parseAssignable(scope).value;

    this.accept([TokenType.SQUAREBRACKETCLOSE]);

    this.accept([TokenType.PARENTHOPEN]);

    var body = this._parseAssignable(scope).value;

    this.accept([TokenType.PARENTHCLOSE]);

    console.log("_parseTest Close");

    return new TestNode(url, body);
};

Parser.prototype._parseFunCall = function (name,scope) {
    console.log("_parseFunCall Open");

    var argument;
    var arguments = [];
    this.accept([TokenType.PARENTHOPEN]);

    var globalScope = scope;

    while(globalScope.parentScope)
        globalScope = globalScope.parentScope;

    //Funkcja może byc już zdefiniowana w wywołaniu
    if(globalScope.functions[name] === undefined)
        globalScope.functions[name] = "" ;


    if (Parser._tokenIsType(this.getCurrToken(), [TokenType.PARENTHCLOSE])){
        this.accept([TokenType.PARENTHCLOSE]);
        console.log("_parseFunCall Close 2");

        return new FunctionCallNode(name, arguments);
    }

    while ((argument = this._parseAssignable(scope)) !== undefined) {
        arguments.push(argument);

        if (Parser._tokenIsType(this.getCurrToken(), [TokenType.PARENTHCLOSE])) {
            console.log( this.getCurrToken());
            this.accept([TokenType.PARENTHCLOSE]);
            break;
        }
        if (Parser._tokenIsType(this.getCurrToken(), [TokenType.COMMA])) {
            this.accept([TokenType.COMMA]);
            continue;
        }
        var type = "Nieoczekiwany Token " + this.getCurrToken().type + " nie jest typu " + TokenType.COMMA + ", " + TokenType.PARENTHCLOSE;
        ErrorHandler.error(new MyError(ErrorType.PARSERERROR, type, this.getCurrToken().posLine, this.getCurrToken().numLine));
    }

    console.log("_parseFunCall Close 1", this.getCurrToken());

    return new FunctionCallNode(name, arguments);
};

Parser.prototype._parseReturnStatement = function (scope) {

    console.log("_parseReturnStatement Open");
    if (!Parser._tokenIsType(this.getCurrToken(), [TokenType.RETURN]))
        return undefined;

    this.accept([TokenType.RETURN]);

    var value = this._parseAssignable(scope);

    this.accept([TokenType.SEMICOLN]);

    console.log("_parseReturnStatement Close");

    return new ReturnStatementNode(value);
};

Parser.prototype._parseLoopBreak = function () {

    console.log("_parseLoopBreak Open");
    if (!Parser._tokenIsType(this.getCurrToken(), [TokenType.BREAK]))
        return undefined;
    this.accept([TokenType.BREAK]);

    this.accept([TokenType.SEMICOLN]);

    console.log("_parseLoopBreak Close");

    return new BreakStatementNode(true);
};

Parser._isRelationOp = function (token) {

    return token.type === TokenType.LESS || token.type === TokenType.LESSOREQUAL ||
        token.type === TokenType.GREATER || token.type === TokenType.GREATEROREQUAL;
};

Parser._tokenIsType = function (token, acceptList) {

    return acceptList.indexOf(token.type) > -1;
};

Parser.prototype.getCurrToken = function () {
    return this.oneTokenBuffor;
};

Parser.prototype.accept = function (tokens) {

    if (tokens.indexOf(this.oneTokenBuffor.type) > -1) {
        this.oneTokenBuffor = this.lexer.token();
        while (this.oneTokenBuffor.type === TokenType.COMMENT)
            this.oneTokenBuffor = this.lexer.token();
        return true;
    } else {
        var type = "Token " + this.oneTokenBuffor.type + " is not valid type";
        ErrorHandler.error(new MyError(ErrorType.SYNTAXERROR, type, this.oneTokenBuffor.posLine, this.oneTokenBuffor.numLine));
    }
};

var lexer;

function start() {
    lexer = new Parser();

    lexer.lexer.fileReader.load();
}

function nextToken() {
    console.log(lexer.parse())
}