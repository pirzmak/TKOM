var BlockStatementNode = function (functions) {
    this.scopeProto = new ScopeProto();
    this.functions = functions;
};

BlockStatementNode.prototype.getType = function () {

    return "BlockStatementNode";
};