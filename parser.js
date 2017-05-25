var Parser = function () {
    this.lexer = new Lexer();

    this.previousToken = undefined;
};

var Parameter = function (typeParameter, nameParameter) {
    this.typeParameter = typeParameter;
    this.nameParameter = nameParameter;
};

Parser.prototype.parse = function () {

    var syntaxTree = new ProgramNode();
    var func;

    while ((func = this._parseFunction() ) !== undefined) {
        syntaxTree.addFunction(func);

        this.previousToken = undefined;
    }

    return syntaxTree;
};

Parser.prototype._parseVariable = function (variableToken) {

    console.log("_parseVariable open");

    var variableNode = new VariableNode();

    variableNode.setName(variableToken.value);
    variableNode.setType(variableToken.type);
    variableNode.setPosition(variableToken.posLine,variableToken.numLine);

    console.log("_parseVariable close", variableNode);

    return variableNode;
};

Parser.prototype._parseFunction = function () {

    console.log("_parseFunction open");

    var func = new FunctionNode();

    var token = this.accept([TokenType.ENDOFFILE, TokenType.FUNCTION]);
    func.setPosition(token.posLine,token.numLine);

    if (Parser._tokenIsType(token, [TokenType.ENDOFFILE])) {
        return undefined;
    }

    token = this.accept([TokenType.IDENTIFIER]);

    func.setName(token.value);
    func.setParameters(this._parseParameters());
    func.setBlock(this._parseBlock());

    console.log("_parseFunction close", func);

    return func;
};

Parser.prototype._parseParameters = function () {

    console.log("_parseParameters open");

    var param = [];

    var tokenType;
    var tokenName;

    this.accept([TokenType.PARENTHOPEN]);

    if (!Parser._tokenIsType(this.getCurrToken(), [TokenType.PARENTHCLOSE])) {

        tokenType = this.accept([TokenType.RESPONSE, TokenType.TEST, TokenType.URL, TokenType.VAR]);
        tokenName = this.accept([TokenType.IDENTIFIER]);

        param.push(new Parameter(tokenType.type, tokenName.value));

        while(!Parser._tokenIsType(this.getCurrToken(), [TokenType.COMMA])) {
            tokenType = this.accept([TokenType.COMMA]);

            tokenType = this.accept([TokenType.RESPONSE, TokenType.TEST, TokenType.URL, TokenType.VAR]);
            tokenName = this.accept([TokenType.IDENTIFIER]);

            param.push(new Parameter(tokenType.type, tokenName.value));
        }
    }
        this.accept([TokenType.PARENTHCLOSE]);


    console.log("_parseParameters close", param);

    return param;

};

Parser.prototype._parseBlock = function () {

    console.log("_parseBlock Open");

    var blockNode = new BlockStatementNode();

    this.accept(TokenType.BROCKETOPEN);

    var token;

    while (true) {
        token = this.getCurrToken();
        blockNode.setPosition(token.posLine,token.numLine);

        if (!Parser._tokenIsType(token, [TokenType.IF,
                TokenType.FOR,
                TokenType.IDENTIFIER,
                TokenType.VAR, TokenType.TEST, TokenType.BODY, TokenType.RESPONSE,
                TokenType.RETURN, TokenType.BROCKETOPEN, TokenType.BREAK]))
            break;

        switch (token.type) {
            case TokenType.IF : {
                blockNode.addFunction(this._parseIfStatement());
                break;
            }
            case TokenType.FOR : {
                blockNode.addFunction(this._parseForStatement());
                break;
            }
            case TokenType.IDENTIFIER : {
                blockNode.addFunction(this._parseAssignmentOrFunCall());
                break;
            }
            case TokenType.VAR : {
                blockNode.addFunction(this._parseVarDeclaration());
                break;
            }
            case TokenType.TEST : {
                blockNode.addFunction(this._parseTestDeclaration());
                break;
            }
            case TokenType.BODY : {
                blockNode.addFunction(this._parseBodyDeclaration());
                break;
            }
            case TokenType.RESPONSE : {
                blockNode.addFunction(this._parseResponseDeclaration());
                break;
            }
            case TokenType.RETURN : {
                blockNode.addFunction(this._parseReturnStatement());
                break;
            }
            case TokenType.BROCKETOPEN : {
                blockNode.addFunction(this._parseBlock());
                break;
            }
            case TokenType.BREAK : {
                blockNode.addFunction(this._parseLoopBreak());
                break;
            }
            default : {
                break;
            }
        }

        if (token.type === TokenType.BROCKETCLOSE) {
            break;
        }

    }

    this.accept(TokenType.BROCKETCLOSE);

    console.log("_parseBlock End", blockNode);

    return blockNode;

};

Parser.prototype._parseIfStatement = function () {

    console.log("_parseIfStatement Open");

    var ifNode = new IfStatementNode();

    this.accept([TokenType.IF]);
    this.accept([TokenType.PARENTHOPEN]);

    ifNode.setCondition(this._parseCondition());

    this.accept([TokenType.PARENTHCLOSE]);

    ifNode.setTrueBlock(this._parseBlock());

    var token = this.getCurrToken();

    if (Parser._tokenIsType(token, [TokenType.ELSE])) {
        this.accept(TokenType.ELSE);
        ifNode.setFalseBlock(this._parseBlock());
    } else {
        this.previousToken = token;
    }

    console.log("_parseIfStatement Close", ifNode);

    return ifNode;
};

Parser.prototype._parseCondition = function () {

    console.log("_parseCondition Open");

    var conditionNode = new ConditionNode();

    conditionNode.addOperand(this._parseAndCondition());

    var tokenTmp = this.getCurrToken();

    while (Parser._tokenIsType(tokenTmp, [TokenType.OR])) {
        var token = this.accept([TokenType.OR]);

        conditionNode.setOperator(token.type);

        conditionNode.addOperand(this._parseAndCondition());
    }

    console.log("_parseCondition Close", conditionNode);

    return conditionNode;
};

Parser.prototype._parseAndCondition = function () {

    console.log("_parseAndCondition Open");

    var conditionNode = new ConditionNode();

    conditionNode.addOperand(this._parseEqualityCondition());

    var tokenTmp = this.getCurrToken();

    while (Parser._tokenIsType(tokenTmp, [TokenType.AND])) {
        var token = this.accept([TokenType.AND]);

        conditionNode.setOperator(token.type);

        conditionNode.addOperand(this._parseEqualityCondition());
    }


    console.log("_parseAndCondition Close", conditionNode);

    return conditionNode;
};

Parser.prototype._parseEqualityCondition = function () {

    console.log("_parseEqualityCondition Open");

    var conditionNode = new ConditionNode();

    conditionNode.addOperand(this._parseRelationalCondition());

    var token = this.getCurrToken();

    if (Parser._tokenIsType(token, [TokenType.EQUALITY, TokenType.INEQUALITY])) {
        var operatorToken = this.accept([TokenType.EQUALITY, TokenType.INEQUALITY]);

        conditionNode.setOperator(operatorToken.value);

        conditionNode.addOperand(this._parseRelationalCondition());
    }

    console.log("_parseEqualityCondition Close", conditionNode);

    return conditionNode;
};

Parser.prototype._parseRelationalCondition = function () {

    console.log("_parseRelationalCondition Open");

    var conditionNode = new ConditionNode();

    conditionNode.addOperand(this._parsePrimaryCondition());

    var token = this.getCurrToken();

    if (Parser._tokenIsType(token, [TokenType.LESS, TokenType.LESSOREQUAL, TokenType.GREATER, TokenType.GREATEROREQUAL])) {
        var tokenValue = this.accept([TokenType.LESS, TokenType.LESSOREQUAL, TokenType.GREATER, TokenType.GREATEROREQUAL]);

        conditionNode.setOperator(tokenValue.value);

        conditionNode.addOperand(this._parsePrimaryCondition());
    }

    console.log("_parseRelationalCondition Close", conditionNode);

    return conditionNode;
};

Parser.prototype._parsePrimaryCondition = function () {

    console.log("_parsePrimaryCondition Open");

    var conditionNode = new ConditionNode();

    var token = this.getCurrToken();

    if (Parser._tokenIsType(token, [TokenType.NEGATION])) {
        this.accept([TokenType.NEGATION]);

        conditionNode.setNegated();
    }

    if (Parser._tokenIsType(token, [TokenType.PARENTHOPEN])) {
        this.accept([TokenType.PARENTHOPEN]);

        conditionNode.addOperand(this._parseCondition());

        this.accept([TokenType.PARENTHCLOSE]);
    } else {

        if (Parser._tokenIsType(token, [TokenType.IDENTIFIER])) {
            conditionNode.addOperand(this._parseVariable(this.accept([TokenType.IDENTIFIER])));
        } else {
            conditionNode.addOperand(this._parseLiteral());
        }
    }

    console.log("_parsePrimaryCondition Close", conditionNode);


    return conditionNode;
};

Parser.prototype._parseForStatement = function () {

    console.log("_parseForStatement Open");

    var forNode = new ForStatementNode();

    this.accept(TokenType.FOR);

    var startToken;
    var endToken;

    if (Parser._tokenIsType(this.getCurrToken(), [TokenType.IDENTIFIER]))
        startToken = this._parseVariable(this.accept([TokenType.IDENTIFIER]));

    if (Parser._tokenIsType(this.getCurrToken(), [TokenType.NUMBERLITERAL]))
        startToken = this._parseLiteral();

    this.accept([TokenType.FORTO]);

    if (Parser._tokenIsType(this.getCurrToken(), [TokenType.IDENTIFIER]))
        endToken = this._parseVariable(this.accept([TokenType.IDENTIFIER]));

    if (Parser._tokenIsType(this.getCurrToken(), [TokenType.NUMBERLITERAL]))
        endToken = this._parseLiteral();

    forNode.setStart(startToken);
    forNode.setEnd(endToken);
    forNode.setBlock(this._parseBlock());

    console.log("_parseForStatement Close", forNode);

    return forNode;
};

Parser.prototype._parseAssignmentOrFunCall = function () {

    console.log("_parseAssignmentOrFunCall Open");

    var assignementNode;

    var token = this.accept([TokenType.IDENTIFIER]);

    assignementNode = this._parseFunCall(token.value);

    if (assignementNode === undefined) {
        var assignment = new AssignmentNode();

        assignment.setVariable(this._parseVariable(token));

        this.accept([TokenType.ASSIGNEMENT]);

        assignment.setValue(this._parseAssignable());

        assignementNode = assignment;
    }

    this.accept([TokenType.SEMICOLN]);


    console.log("_parseAssignmentOrFunCall Close", assignementNode);

    return assignementNode;
};

Parser.prototype._parseAssignable = function () {

    console.log("_parseAssignable Open");

    var assignableNode;
    var token;

    if (this.getCurrToken().type === TokenType.IDENTIFIER) {

        token = this.accept([TokenType.IDENTIFIER]);

        assignableNode = this._parseFunCall(token.value);
        if (assignableNode === undefined) {
            assignableNode = this._parseExpression(token);
        }
    } else if (this.getCurrToken().type === TokenType.SQUAREBRACKETOPEN) {
        assignableNode = this._parseTest();
    } else if (this.getCurrToken().type === TokenType.BROCKETOPEN) {
        assignableNode = this._parseBody();
    } else if (this.getCurrToken().type === TokenType.QUOTE) {
        assignableNode = this.accept([TokenType.QUOTE]).value;
    } else {
        assignableNode = this._parseExpression(token);
    }

    console.log("_parseAssignable Close", assignableNode);

    return assignableNode;
};

Parser.prototype._parseExpression = function (token) {

    console.log("_parseExpression Open");

    var expressionNode = new ExpressionNode();

    expressionNode.addOperand(this._parseMultiplicativeExpression(token));
    expressionNode.setPosition(this.getCurrToken().posLine,this.getCurrToken().numLine);

    while (Parser._tokenIsType(this.getCurrToken(), [TokenType.PLUS, TokenType.MINUS])) {
        var tempToken = this.accept([TokenType.PLUS, TokenType.MINUS]);
        expressionNode.addOperator(tempToken.type);

        expressionNode.addOperand(this._parseMultiplicativeExpression());
    }

    console.log("_parseExpression Close", expressionNode);

    return expressionNode;
};

Parser.prototype._parseMultiplicativeExpression = function (token) {

    console.log("_parseMultiplicativeExpression Open");

    var expressionNode = new ExpressionNode(token);

    expressionNode.addOperand(this._parsePrimaryExpression(token));
    expressionNode.setPosition(this.getCurrToken().posLine,this.getCurrToken().numLine);

    while (Parser._tokenIsType(this.getCurrToken(), [TokenType.MULTIPLY, TokenType.DIVIDE, TokenType.MODULO])) {
        var tempToken = this.accept([TokenType.MULTIPLY, TokenType.DIVIDE, TokenType.MODULO]);
        expressionNode.addOperator(tempToken.type);

        expressionNode.addOperand(this._parsePrimaryExpression());
    }


    console.log("_parseMultiplicativeExpression Close", expressionNode);

    return expressionNode;
};

Parser.prototype._parsePrimaryExpression = function (token) {

    console.log("_parsePrimaryExpression Open");

    var expressionNode = new ExpressionNode();
    expressionNode.setPosition(this.getCurrToken().posLine,this.getCurrToken().numLine);

    if (Parser._tokenIsType(this.getCurrToken(), [TokenType.PARENTHOPEN])) {
        this.accept([TokenType.PARENTHOPEN]);
        expressionNode = this._parseExpression();
        this.accept([TokenType.PARENTHCLOSE]);

        console.log("_parsePrimaryExpression Close", expressionNode);
        return expressionNode;
    }

    if (token && Parser._tokenIsType(token, [TokenType.IDENTIFIER])) {
        expressionNode = this._parseVariable(token);
        console.log("_parsePrimaryExpression Close", expressionNode);
        return expressionNode;
    }

    expressionNode = this._parseLiteral();
    console.log("_parsePrimaryExpression Close", expressionNode);

    return expressionNode;
};

Parser.prototype._parseLiteral = function () {
    var expressionNode = new ExpressionNode();
    var negative = false;

    console.log("_parseLiteral Open");

    if (Parser._tokenIsType(this.getCurrToken(), [TokenType.MINUS])) {
        this.accept([TokenType.MINUS]);

        negative = true;
    }

    var tempToken = this.accept([TokenType.NUMBERLITERAL]);
    expressionNode.setPosition(tempToken.posLine,tempToken.numLine);

    if (negative)
        expressionNode.addOperand(-1 * tempToken.value);
    else
        expressionNode.addOperand(tempToken.value);

    console.log("_parseLiteral Close");

    return expressionNode;
};

Parser.prototype._parseVarDeclaration = function () {
    var declarationNode = new VarDeclarationNode();

    console.log("_parseVarDeclaration");

    var tempToken = this.accept([TokenType.VAR]);
    declarationNode.setPosition(tempToken.posLine,tempToken.numLine);

    var nameToken = this.accept([TokenType.IDENTIFIER]);
    declarationNode.setName(nameToken.value);

    if (Parser._tokenIsType(this.getCurrToken(), [TokenType.ASSIGNEMENT])) {
        this.accept([TokenType.ASSIGNEMENT]);

        declarationNode.setValue(this._parseAssignable());
    }

    this.accept([TokenType.SEMICOLN]);

    console.log("_parseVarDeclaration Close");

    return declarationNode;
};

Parser.prototype._parseTestDeclaration = function () {
    var declarationNode = new TestDeclarationNode();

    console.log("_parseTestDeclaration");

    var tempToken = this.accept([TokenType.TEST]);
    var nameToken = this.accept([TokenType.IDENTIFIER]);
    declarationNode.setName(nameToken.value);
    declarationNode.setPosition(tempToken.posLine,tempToken.numLine);

    if (Parser._tokenIsType(this.getCurrToken(), [TokenType.ASSIGNEMENT])) {
        this.accept([TokenType.ASSIGNEMENT]);

        declarationNode.setValue(this._parseAssignable());

    }

    this.accept([TokenType.SEMICOLN]);

    console.log("_parseTestDeclaration Close");

    return declarationNode;
};

Parser.prototype._parseBodyDeclaration = function () {
    var declarationNode = new BodyDeclarationNode();

    console.log("_parseBodyDeclaration");

    var tempToken = this.accept([TokenType.BODY]);
    var nameToken = this.accept([TokenType.IDENTIFIER]);
    declarationNode.setName(nameToken.value);
    declarationNode.setPosition(tempToken.posLine,tempToken.numLine);

    if (Parser._tokenIsType(this.getCurrToken(), [TokenType.ASSIGNEMENT])) {
        this.accept([TokenType.ASSIGNEMENT]);

        declarationNode.setBody(this._parseAssignable());
    }

    this.accept([TokenType.SEMICOLN]);

    console.log("_parseBodyDeclaration Close");

    return declarationNode;
};

Parser.prototype._parseResponseDeclaration = function () {
    var declarationNode = new ResponseDeclarationNode();

    console.log("_parseResponseDeclaration");

    var tempToken = this.accept([TokenType.RESPONSE]);
    var nameToken = this.accept([TokenType.IDENTIFIER]);
    declarationNode.setName(nameToken.value);
    declarationNode.setPosition(tempToken.posLine,tempToken.numLine);

    if (Parser._tokenIsType(this.getCurrToken(), [TokenType.ASSIGNEMENT])) {
        this.accept([TokenType.ASSIGNEMENT]);

        declarationNode.setBody(this._parseAssignable());
    }

    this.accept([TokenType.SEMICOLN]);

    console.log("_parseResponseDeclaration Close");

    return declarationNode;
};

Parser.prototype._parseBody = function () {
    var body = new BodyNode();

    console.log("_parseBody");

    var tempToken = this.accept([TokenType.BROCKETOPEN]);
    body.setPosition(tempToken.posLine,tempToken.numLine);

    while (Parser._tokenIsType(this.getCurrToken(), [TokenType.QUOTE])) {
        var bodyTokenName = this.accept([TokenType.QUOTE]);
        this.accept([TokenType.COLON]);
        var bodyTokenValue = this.accept([TokenType.QUOTE]);

        body.addValue(new BodyValue(bodyTokenName.value, bodyTokenValue.value))
    }

    this.accept([TokenType.BROCKETCLOSE]);

    console.log("_parseBody Close");

    return body;
};

Parser.prototype._parseTest = function () {
    var test = new TestNode();

    console.log("_parseTest");

    var tempToken = this.accept([TokenType.SQUAREBRACKETOPEN]);
    test.setPosition(tempToken.posLine,tempToken.numLine);

    test.setUrl(this._parseAssignable());

    this.accept([TokenType.SQUAREBRACKETCLOSE]);

    this.accept([TokenType.PARENTHOPEN]);

    test.setBody(this._parseAssignable());


    this.accept([TokenType.PARENTHCLOSE]);

    console.log("_parseTest Close");

    return test;
};

Parser.prototype._parseFunCall = function (id) {

    console.log("_parseFunCall Open");

    var funNode = new FunctionCallNode();

    if (!Parser._tokenIsType(this.getCurrToken(), [TokenType.PARENTHOPEN])) {
        console.log("  not a function call",this.getCurrToken());
        return undefined;
    }

    var tempToken = this.getCurrToken();
    funNode.setPosition(tempToken.posLine,tempToken.numLine);

    funNode.setName(id);

    this.accept([TokenType.PARENTHOPEN]);

    if (Parser._tokenIsType(this.getCurrToken(), [TokenType.PARENTHCLOSE])) {
        this.accept([TokenType.PARENTHCLOSE]);

        console.log("  not a function call");
        return funNode;
    }
    console.log(" function call",this.getCurrToken());
    while (true) {
        funNode.addArgument(this._parseAssignable());

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

    console.log("_parseFunCall Close", funNode);

    return funNode;
};

Parser.prototype._parseReturnStatement = function () {

    console.log("_parseReturnStatement Open");

    var nodeReturn = new ReturnStatementNode();

    var tempToken = this.accept([TokenType.RETURN]);
    nodeReturn.setPosition(tempToken.posLine,tempToken.numLine);

    nodeReturn.setValue(this._parseAssignable());

    this.accept([TokenType.SEMICOLN]);

    console.log("_parseReturnStatement Close", nodeReturn);

    return nodeReturn;
};

Parser.prototype._parseLoopBreak = function () {

    console.log("_parseLoopBreak Open");

    var nodeBreak = new BreakStatementNode();

    var token = this.accept([TokenType.BREAK]);
    nodeBreak.setValue();
    nodeBreak.setPosition(token.posLine,token.numLine);

    this.accept([TokenType.SEMICOLN]);

    console.log("_parseLoopBreak Close", nodeBreak);

    return nodeBreak;
};

Parser._isRelationOp = function (token) {

    return token.type === TokenType.LESS || token.type === TokenType.LESSOREQUAL ||
        token.type === TokenType.GREATER || token.type === TokenType.GREATEROREQUAL;
};

Parser._tokenIsType = function (token, acceptList) {

    return acceptList.indexOf(token.type) > -1;
};

Parser.prototype.getCurrToken = function () {

    if (this.previousToken === undefined) {
        this.previousToken = this.lexer.token();
        while (this.previousToken.type === TokenType.COMMENT)
            this.previousToken = this.lexer.token();

    }
    return this.previousToken;
};

Parser.prototype.accept = function (tokens) {

    var tokenTmp = this.getCurrToken();

    if (tokens.indexOf(tokenTmp.type) > -1) {
        return tokenTmp;
    } else {
        var type = "Token " + tokenTmp.type + " is not valid type";
        ErrorHandler.error(new MyError(ErrorType.SYNTAXERROR, type, tokenTmp.posLine, tokenTmp.numLine));
        return tokenTmp;
    }
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
//     console.log(lexer.parse())
// }