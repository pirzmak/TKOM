var FunctionNode = function () {
    this.name = "";
    this.parameters = [];
    this.blockStatement = new BlockStatementNode();
    this.posLine = 0;
    this.numLine = 0;
};

FunctionNode.prototype.setPosition = function (p,n) {
    this.posLine = p;
    this.numLine = n;
};

FunctionNode.prototype.setName = function (name) {

    this.name = name;
};

FunctionNode.prototype.setParameters = function (parameters) {

    this.parameters = parameters;
};

FunctionNode.prototype.setBlock = function (blockStatement) {

    this.blockStatement = blockStatement;
};

FunctionNode.prototype.getType = function () {

    return "FunctionNode";
};

