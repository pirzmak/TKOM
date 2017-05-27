var BlockStatementNode = function (functions,scope) {
    this.scopeProto = scope;
    this.functions = functions;
};

BlockStatementNode.prototype.getType = function () {

    return "BlockStatementNode";
};