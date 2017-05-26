var ExpressionNode = function (operations,operants) {
    this.operations = operations;
    this.operants = operants;
};

ExpressionNode.prototype.getType = function () {

    return "ExpressionNode";
};