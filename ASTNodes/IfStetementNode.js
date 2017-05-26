var IfStatementNode = function (condition,trueBlock,falseBlock) {
    this.condition = condition;
    this.trueBlock = trueBlock;
    this.falseBlock = falseBlock;
};

IfStatementNode.prototype.getType = function () {

    return "IfStatementNode";
};
