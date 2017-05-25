var IfStatementNode = function () {
    this.condition = new ConditionNode();
    this.trueBlock = new BlockStatementNode();
    this.falseBlock = new BlockStatementNode();
    this.posLine = 0;
    this.numLine = 0;
};

IfStatementNode.prototype.setPosition = function (p,n) {
    this.posLine = p;
    this.numLine = n;
};

IfStatementNode.prototype.setCondition = function (condition) {

    this.condition = condition;
};

IfStatementNode.prototype.setTrueBlock = function (trueBlock) {

    this.trueBlock = trueBlock;
};

IfStatementNode.prototype.setFalseBlock = function (falseBlock) {

    this.falseBlock = falseBlock;
};

IfStatementNode.prototype.getType = function () {

    return "IfStatementNode";
};
