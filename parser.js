var Parser = function () {
    this.lexer = new Lexer();

    this.oneTokenBuffor = undefined;
};

var Parameter = function (typeParameter, nameParameter) {
    this.typeParameter = typeParameter;
    this.nameParameter = nameParameter;
};

var Quote = function(quote) {
    this.value = quote;
};


Parser.prototype.parse = function () {

    var func;
    var functions = [];
    while ((func = this._parseFunction() ) !== undefined) {
        functions.add(func);
    }

    return new ProgramNode(functions);
};

Parser.prototype._parseVariable = function (name, type) {
    //Brak accept bo przy decydowaniu czy funkacja czy zmennaa jest pobierany
    console.log("_parseVariable open");

    var variableNode = new VariableNode();

    variableNode.setName(name);
    variableNode.setType(type);

    console.log("_parseVariable close", variableNode);

    return variableNode;
};

Parser.prototype._parseFunction = function () {

    console.log("_parseFunction open");

    if (!Parser._tokenIsType(this.getCurrToken(), [TokenType.FUNCTION]))
        return undefined;

    this.accept([TokenType.FUNCTION]);

    var name = this.getCurrToken().value;
    this.accept([TokenType.IDENTIFIER]);

    var parameters = this._parseParameters();
    var block = this._parseBlock();

    console.log("_parseFunction close");

    return new FunctionNode(name, parameters, block);
};

Parser.prototype._parseParameters = function () {

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

        while (Parser._tokenIsType(this.getCurrToken(), [TokenType.COMMA])) {
            this.accept([TokenType.COMMA]);

            type = this.getCurrToken().type;
            this.accept([TokenType.RESPONSE, TokenType.TEST, TokenType.URL, TokenType.VAR]);

            name = this.getCurrToken().value;
            this.accept([TokenType.IDENTIFIER]);

            param.push(new Parameter(type, name));
        }
    }
    this.accept([TokenType.PARENTHCLOSE]);

    console.log("_parseParameters close", param);

    return param;
};

Parser.prototype._parseBlock = function () {

    console.log("_parseBlock Open");

    if (!Parser._tokenIsType(this.getCurrToken(), [TokenType.BROCKETOPEN]))
        return undefined;

    this.accept(TokenType.BROCKETOPEN);

    var functionNode;
    var blockFunctionsNode = [];

    while ((functionNode = this._parseIfStatement()) !== undefined ||
    (functionNode = this._parseForStatement()) !== undefined ||
    (functionNode = this._parseAssignmentOrFunCall()) !== undefined ||
    (functionNode = this._parseVarDeclaration()) !== undefined ||
    (functionNode = this._parseTestDeclaration()) !== undefined ||
    (functionNode = this._parseBodyDeclaration()) !== undefined ||
    (functionNode = this._parseResponseDeclaration()) !== undefined ||
    (functionNode = this._parseReturnStatement()) !== undefined ||
    (functionNode = this._parseBlock()) !== undefined ||
    (functionNode = this._parseLoopBreak()) !== undefined) {
        blockFunctionsNode.push(functionNode);
    }

    this.accept(TokenType.BROCKETCLOSE);

    console.log("_parseBlock End");

    return new BlockStatementNode(blockFunctionsNode);
};

Parser.prototype._parseIfStatement = function () {

    console.log("_parseIfStatement Open");

    if (!Parser._tokenIsType(this.getCurrToken(), [TokenType.IF]))
        return undefined;

    this.accept([TokenType.IF]);
    this.accept([TokenType.PARENTHOPEN]);

    var condition = this._parseCondition();

    this.accept([TokenType.PARENTHCLOSE]);

    var trueBlock = this._parseBlock();

    var falseBlock;

    if (Parser._tokenIsType(this.getCurrToken(), [TokenType.ELSE])) {
        this.accept(TokenType.ELSE);
        falseBlock = this._parseBlock();
    }

    console.log("_parseIfStatement Close");

    return new IfStatementNode(condition, trueBlock, falseBlock);
};

Parser.prototype._parseCondition = function () {

    console.log("_parseCondition Open");

    var operants = [];
    var operator;

    operants.push(this._parseAndCondition());

    while (Parser._tokenIsType(this.getCurrToken(), [TokenType.OR])) {
        operator = this.getCurrToken().type;
        this.accept([TokenType.OR]);
        operants.push(this._parseAndCondition());
    }

    console.log("_parseCondition Close");

    return new ConditionNode(operants, operator);
};

Parser.prototype._parseAndCondition = function () {

    console.log("_parseAndCondition Open");

    var operants = [];
    var operator;

    operants.push(this._parseEqualityCondition());

    while (Parser._tokenIsType(this.getCurrToken(), [TokenType.AND])) {
        operator = this.getCurrToken().type;
        this.accept([TokenType.AND]);
        operants.push(this._parseEqualityCondition());
    }

    console.log("_parseAndCondition Close");

    return new ConditionNode(operants, operator);
};

Parser.prototype._parseEqualityCondition = function () {

    console.log("_parseEqualityCondition Open");

    var operants = [];
    var operator;

    operants.push(this._parseRelationalCondition());

    while (Parser._tokenIsType(this.getCurrToken(), [TokenType.EQUALITY, TokenType.INEQUALITY])) {
        operator = this.getCurrToken().type;
        this.accept([TokenType.EQUALITY, TokenType.INEQUALITY]);
        operants.push(this._parseRelationalCondition());
    }

    console.log("_parseEqualityCondition Close");

    return new ConditionNode(operants, operator);
};

Parser.prototype._parseRelationalCondition = function () {

    console.log("_parseRelationalCondition Open");

    var operants = [];
    var operator;

    operants.push(this._parsePrimaryCondition());

    while (Parser._tokenIsType(this.getCurrToken(), [TokenType.LESS, TokenType.LESSOREQUAL, TokenType.GREATER, TokenType.GREATEROREQUAL])) {
        operator = this.getCurrToken().type;
        this.accept([TokenType.LESS, TokenType.LESSOREQUAL, TokenType.GREATER, TokenType.GREATEROREQUAL]);
        operants.push(this._parsePrimaryCondition());
    }

    console.log("_parseRelationalCondition Close");

    return new ConditionNode(operants, operator);
};

Parser.prototype._parsePrimaryCondition = function () {

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
        operants.push(this._parseCondition());
        this.accept([TokenType.PARENTHCLOSE]);
    } else {
        if (Parser._tokenIsType(this.getCurrToken(), [TokenType.IDENTIFIER])) {
            var name = this.getCurrToken().value;
            var type = this.getCurrToken().type;
            this.accept([TokenType.IDENTIFIER]);
            operants.push(this._parseVariable(name, type));
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

Parser.prototype._parseForStatement = function () {

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
        start = this._parseVariable(name, type);
    }

    if (Parser._tokenIsType(this.getCurrToken(), [TokenType.NUMBERLITERAL]))
        start = this._parseExpression(this.getCurrToken().value,this.getCurrToken().type);

    this.accept([TokenType.FORTO]);

    if (Parser._tokenIsType(this.getCurrToken(), [TokenType.IDENTIFIER])) {
        name = this.getCurrToken().value;
        type = this.getCurrToken().type;
        this.accept([TokenType.IDENTIFIER]);
        end = this._parseVariable(name, type);
    }
    if (Parser._tokenIsType(this.getCurrToken(), [TokenType.NUMBERLITERAL]))
        end = this._parseExpression(this.getCurrToken().value,this.getCurrToken().type);

    var block = this._parseBlock();

    console.log("_parseForStatement Close");

    return new ForStatementNode(start, end, block);
};

Parser.prototype._parseAssignmentOrFunCall = function () {

    console.log("_parseAssignmentOrFunCall Open");

    if (!Parser._tokenIsType(this.getCurrToken(), [TokenType.IDENTIFIER]))
        return undefined;

    var name = this.getCurrToken().value;
    var type = this.getCurrToken().type;
    this.accept([TokenType.IDENTIFIER]);

    if (Parser._tokenIsType(this.getCurrToken(), [TokenType.PARENTHOPEN])) {
        console.log("_parseAssignmentOrFunCall Close");
        return this._parseFunCall(name);
    } else {
        var variable = this._parseVariable(name, type);
        this.accept([TokenType.ASSIGNEMENT]);
        var value = this._parseAssignable();

        console.log("_parseAssignmentOrFunCall Close");

        this.accept([TokenType.SEMICOLN]);

        return new AssignmentNode(variable, value)
    }
};

Parser.prototype._parseAssignable = function () {

    console.log("_parseAssignable Open");

    var name = this.getCurrToken().value;
    var type = this.getCurrToken().type;

    switch (type) {
        case TokenType.IDENTIFIER:
            this.accept([TokenType.IDENTIFIER]);

            if (Parser._tokenIsType(this.getCurrToken(), [TokenType.PARENTHOPEN])) {

                console.log("_parseAssignable Close");
                return this._parseFunCall(name);
            }
            else {
                console.log("_parseAssignable Close");
                return this._parseExpression(name, type);
            }
        case TokenType.SQUAREBRACKETOPEN:
            console.log("_parseAssignable Close");
            return this._parseTest();
        case TokenType.BROCKETOPEN:
            console.log("_parseAssignable Close");
            return this._parseBody();
        case TokenType.QUOTE:
            this.accept([TokenType.QUOTE]);
            console.log("_parseAssignable Close");
            return new Quote(name);
        default:
            console.log("_parseAssignable Close");
            return this._parseExpression(name, type);
    }
};

Parser.prototype._parseExpression = function (name,type) {

    console.log("_parseExpression Open");

    var operations = [];
    var operants = [];

    operants.push(this._parseMultiplicativeExpression(name,type));

    while (Parser._tokenIsType(this.getCurrToken(), [TokenType.PLUS, TokenType.MINUS])) {
        var operatorType = this.getCurrToken().type;
        this.accept([TokenType.PLUS, TokenType.MINUS]);
        operations.push(operatorType);
        operants.push(this._parseMultiplicativeExpression());
    }

    console.log("_parseExpression Close");

    return new ExpressionNode(operations,operants);
};

Parser.prototype._parseMultiplicativeExpression = function (name,type) {

    console.log("_parseMultiplicativeExpression Open");

    var operations = [];
    var operants = [];

    operants.push(this._parsePrimaryExpression(name,type));

    while (Parser._tokenIsType(this.getCurrToken(), [TokenType.MULTIPLY, TokenType.DIVIDE, TokenType.MODULO])) {
        var operatorType = this.getCurrToken().type;
        this.accept([TokenType.MULTIPLY, TokenType.DIVIDE, TokenType.MODULO]);
        operations.push(operatorType);
        operants.push(this._parsePrimaryExpression());
    }

    console.log("_parseMultiplicativeExpression Close");

    return new ExpressionNode(operations,operants);
};

Parser.prototype._parsePrimaryExpression = function (name,type) {

    console.log("_parsePrimaryExpression Open");

    var expressionNode;

    if (Parser._tokenIsType(this.getCurrToken(), [TokenType.PARENTHOPEN])) {
        this.accept([TokenType.PARENTHOPEN]);
        expressionNode = this._parseExpression();
        this.accept([TokenType.PARENTHCLOSE]);

        console.log("_parsePrimaryExpression Close");
        return expressionNode;
    }

    if (name && type === TokenType.IDENTIFIER) {
        return this._parseVariable(name,type);
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

    var operant = this.getCurrToken().value;
    this.accept([TokenType.NUMBERLITERAL]);

    if (negative)
        operant = (-1)*operant;

    console.log("_parseLiteral Close");

    return new ExpressionNode(undefined,[operant]);
};

Parser.prototype._parseVarDeclaration = function () {
    console.log("_parseVarDeclaration");
    if (!Parser._tokenIsType(this.getCurrToken(), [TokenType.VAR]))
        return undefined;

    this.accept([TokenType.VAR]);

    var name = this.getCurrToken().value;
    this.accept([TokenType.IDENTIFIER]);
    var value;

    if (Parser._tokenIsType(this.getCurrToken(), [TokenType.ASSIGNEMENT])) {
        this.accept([TokenType.ASSIGNEMENT]);
        value = this._parseAssignable();
    }

    this.accept([TokenType.SEMICOLN]);

    console.log("_parseVarDeclaration Close");

    return new VarDeclarationNode(name,value);
};

Parser.prototype._parseTestDeclaration = function () {
    console.log("_parseTestDeclaration");
    if (!Parser._tokenIsType(this.getCurrToken(), [TokenType.TEST]))
        return undefined;

    this.accept([TokenType.TEST]);

    var name = this.getCurrToken().value;
    this.accept([TokenType.IDENTIFIER]);
    var value;

    if (Parser._tokenIsType(this.getCurrToken(), [TokenType.ASSIGNEMENT])) {
        this.accept([TokenType.ASSIGNEMENT]);
        value = this._parseAssignable();
    }

    this.accept([TokenType.SEMICOLN]);

    console.log("_parseTestDeclaration Close");

    return new TestDeclarationNode(name,value);
};

Parser.prototype._parseBodyDeclaration = function () {
    console.log("_parseBodyDeclaration");
    if (!Parser._tokenIsType(this.getCurrToken(), [TokenType.BODY]))
        return undefined;

    this.accept([TokenType.BODY]);

    var name = this.getCurrToken().value;
    this.accept([TokenType.IDENTIFIER]);
    var value;

    if (Parser._tokenIsType(this.getCurrToken(), [TokenType.ASSIGNEMENT])) {
        this.accept([TokenType.ASSIGNEMENT]);
        value = this._parseAssignable();
    }

    this.accept([TokenType.SEMICOLN]);

    console.log("_parseBodyDeclaration Close");

    return new BodyDeclarationNode(name,value);
};

Parser.prototype._parseResponseDeclaration = function () {
    console.log("_parseResponseDeclaration");
    if (!Parser._tokenIsType(this.getCurrToken(), [TokenType.RESPONSE]))
        return undefined;

    this.accept([TokenType.RESPONSE]);

    var name = this.getCurrToken().value;
    this.accept([TokenType.IDENTIFIER]);
    var value;

    if (Parser._tokenIsType(this.getCurrToken(), [TokenType.ASSIGNEMENT])) {
        this.accept([TokenType.ASSIGNEMENT]);
        value = this._parseAssignable();
    }

    this.accept([TokenType.SEMICOLN]);

    console.log("_parseResponseDeclaration Close");

    return new ResponseDeclarationNode(name,value);
};

Parser.prototype._parseBody = function () {
    console.log("_parseBody",this.getCurrToken());

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

Parser.prototype._parseTest = function () {
    console.log("_parseTest");

    this.accept([TokenType.SQUAREBRACKETOPEN]);

    var url = this._parseAssignable().value;

    this.accept([TokenType.SQUAREBRACKETCLOSE]);

    this.accept([TokenType.PARENTHOPEN]);

    var body = this._parseAssignable().value;

    this.accept([TokenType.PARENTHCLOSE]);

    console.log("_parseTest Close");

    return new TestNode(url, body);
};

Parser.prototype._parseFunCall = function (name) {
    console.log("_parseFunCall Open");

    var argument;
    var arguments = [];
    this.accept([TokenType.PARENTHOPEN]);

    while ((argument = this._parseAssignable()) !== undefined) {
        arguments.push(argument);

        if (Parser._tokenIsType(this.getCurrToken(), [TokenType.PARENTHCLOSE])) {
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

    console.log("_parseFunCall Close");
    this.accept([TokenType.SEMICOLN]);

    return new FunctionCallNode(name,arguments);
};

Parser.prototype._parseReturnStatement = function () {

    console.log("_parseReturnStatement Open");
    if (!Parser._tokenIsType(this.getCurrToken(), [TokenType.RETURN]))
        return undefined;

   this.accept([TokenType.RETURN]);

    var value = this._parseAssignable();

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

    if (this.oneTokenBuffor === undefined) {
        this.oneTokenBuffor = this.lexer.token();
        while (this.oneTokenBuffor.type === TokenType.COMMENT)
            this.oneTokenBuffor = this.lexer.token();

    }
    return this.oneTokenBuffor;
};

Parser.prototype.accept = function (tokens) {

    if (tokens.indexOf(this.oneTokenBuffor.type) > -1) {
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