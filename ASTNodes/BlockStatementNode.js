var BlockStatementNode = function (functions,scope) {
    this.scopeProto = scope;
    this.functions = functions;
};

BlockStatementNode.prototype.execute = function (scope) {

    //js zmiana this w nowym bloku
    var tmpScope = this.scopeProto;
    this.functions.forEach(function (func) {
        func.execute(tmpScope);
    });
};

BlockStatementNode.prototype.getType = function () {

    return "BlockStatementNode";
};