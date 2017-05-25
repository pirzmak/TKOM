var BreakStatementNode = function () {
    this.value = true;
    this.posLine = 0;
    this.numLine = 0;
};

BreakStatementNode.prototype.setPosition = function (p,n) {
    this.posLine = p;
    this.numLine = n;
};

BreakStatementNode.prototype.setValue = function () {
    this.value = true;
};

BreakStatementNode.prototype.getType = function () {

    return "BreakStatementNode";
};


