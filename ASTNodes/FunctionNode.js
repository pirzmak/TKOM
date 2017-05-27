var FunctionNode = function (name,parameters,blockStatement) {
    this.name = name;
    this.parameters = parameters;
    this.blockStatement = blockStatement;
};

FunctionNode.prototype.execute = function (scope) {

    this.blockStatement.execute();
};

FunctionNode.prototype.getType = function () {

    return "FunctionNode";
};

