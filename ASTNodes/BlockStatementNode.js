var BlockStatementNode = function (functions, scope) {
    this.scopeProto = scope;
    this.functions = functions;
};

BlockStatementNode.prototype.execute = function (scope, arguments, forStatementName) {

    //js zmiana this w nowym bloku

    var tmpScope = this.scopeProto;
    tmpScope.parentScope = scope;

    if (forStatementName !== undefined) {
        tmpScope._addVariable(forStatementName, TokenType.VAR);
        tmpScope._setVariableDefined(forStatementName);
        tmpScope._setVariable(forStatementName, arguments[0])
    } else if (arguments !== undefined) {
        arguments.forEach(function (arg) {
            tmpScope._addVariable(arg.name, TokenType.VAR);
            tmpScope._setVariableDefined(arg.name);
            tmpScope._setVariable(arg.name, arg.value)
        })
    }

    var toReturn;
    this.functions.forEach(function (func) {

        if (func.getType() === "ReturnStatementNode" && toReturn === undefined) {
            toReturn = func.execute(tmpScope);
        }
        if(toReturn === undefined)
            toReturn = func.execute(tmpScope);
    });

    return toReturn;
};

BlockStatementNode.prototype.getType = function () {

    return "BlockStatementNode";
};