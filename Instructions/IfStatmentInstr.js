var IfStatementInstr = function () {
    this.condition = new ExeCondition();
    this.trueBlock = new Block();
    this.falseBlock = undefined;
};

IfStatementInstr.prototype._execute = function (scope, functions) {
    if(this.condition._execute()._isTruthy()){
        return this.trueBlock._execute(scope, functions);
    } else if(this.falseBlock !== undefined){
        return this.falseBlock._execute(scope, functions);
    }

    return undefined;
};

IfStatementInstr.prototype._canDoReturn = function () {
    return true;
};
