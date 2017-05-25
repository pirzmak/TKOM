var BlockStatementNode = function () {
    var functions = [];
    this.posLine = 0;
    this.numLine = 0;
};

BlockStatementNode.prototype.setPosition = function (p,n) {
    this.posLine = p;
    this.numLine = n;
};

BlockStatementNode.prototype.addFunction = function (functionDefinition) {

    if (this.functions !== undefined) {
        this.functions.push(functionDefinition);
    } else {
        this.functions = [functionDefinition]
    }
};

BlockStatementNode.prototype.getType = function () {

    return "BlockStatementNode";
};