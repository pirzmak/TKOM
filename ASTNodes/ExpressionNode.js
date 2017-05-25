var ExpressionNode = function () {
    this.operations = [];
    this.operants = [];
    this.posLine = 0;
    this.numLine = 0;
};

ExpressionNode.prototype.setPosition = function (p,n) {
    this.posLine = p;
    this.numLine = n;
};

ExpressionNode.prototype.addOperand = function (operand) {

    if (this.operants !== undefined) {
        this.operants.push(operand);
    } else {
        this.operants = [operand]
    }

};

ExpressionNode.prototype.addOperator = function (operator) {


    if (this.operations !== undefined) {
        this.operations.push(operator);
    } else {
        this.operations = [operator]
    }
};

ExpressionNode.prototype.getType = function () {

    return "ExpressionNode";
};