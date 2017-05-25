var ProgramNode = function () {
    this.functions = [];
    this.posLine = 0;
    this.numLine = 0;
};

BlockStatementNode.prototype.setPosition = function (p,n) {
    this.posLine = p;
    this.numLine = n;
};

ProgramNode.prototype.addFunction = function (functionDefinition) {

    if (this.functions !== undefined) {
        this.functions.push(functionDefinition);
    } else {
        this.functions = [functionDefinition]
    }
};

ProgramNode.prototype.getType = function () {

    return "ProgramNode";
};
