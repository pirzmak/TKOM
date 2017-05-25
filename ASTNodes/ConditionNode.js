var ConditionNode = function () {
    this.negated = false;
    this.operator = TokenType.INVALID;
    this.operants = [];
    this.posLine = 0;
    this.numLine = 0;
};

ConditionNode.prototype.setPosition = function (p,n) {
    this.posLine = p;
    this.numLine = n;
};

ConditionNode.prototype.addOperand = function (operand) {


    if (this.operants !== undefined) {
        this.operants.push(operand);
    } else {
        this.operants = [operand]
    }
};

ConditionNode.prototype.setOperator = function (operator) {

    this.operator = operator;
};

ConditionNode.prototype.setNegated = function () {

    this.negated = true;
};

ConditionNode.prototype.getType = function () {

    return "ConditionNode";
};
