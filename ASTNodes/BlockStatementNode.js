var BlockStatementNode = function (functions) {
    this.functions = functions;
};

BlockStatementNode.prototype.getType = function () {

    return "BlockStatementNode";
};