var ForStatementNode = function (start,end,block) {
    this.start = start;
    this.end = end;
    this.block = block;
};

ForStatementNode.prototype.execute = function (scope) {

    var s = this.start.execute(scope);
    var e = this.end.execute(scope);

    if(this.start.getType() === "VariableNode") {
        for (s; s < e; s++) {
            this.block.execute(scope, [s], this.start.name);
        }
    } else {
        for (s; s < e; s++) {
            this.block.execute(scope, [s], undefined);
        }
    }
};

ForStatementNode.prototype.getType = function () {

    return "ForStatementNode";
};
