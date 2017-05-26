var ConditionNode = function (operants,operator) {
    this.negated = false;
    this.operator = operator;
    this.operants = operants;
};

ConditionNode.prototype.setNegated = function () {

    this.negated = true;
};

ConditionNode.prototype.getType = function () {

    return "ConditionNode";
};
