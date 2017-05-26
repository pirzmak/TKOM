var ForStatementNode = function (start,end,block) {
    this.start = start;
    this.end = end;
    this.block = block;
};

ForStatementNode.prototype.getType = function () {

    return "ForStatementNode";
};
