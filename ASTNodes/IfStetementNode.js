var IfStatementNode = function (condition,trueBlock,falseBlock) {
    this.condition = condition;
    this.trueBlock = trueBlock;
    this.falseBlock = falseBlock;
};

IfStatementNode.prototype.execute = function (scope,arguments) {

    //js zmiana this w nowym bloku
    if(this.condition.execute(scope)){
        return this.trueBlock.execute(scope);
    } else if(this.falseBlock !== undefined) {
        return this.falseBlock.execute(scope);
    }

    return undefined;
};

IfStatementNode.prototype.getType = function () {

    return "IfStatementNode";
};
