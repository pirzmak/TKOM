var ReturnStatementNode = function () {
    this.value = "";
    this.posLine = 0;
    this.numLine = 0;
};

ReturnStatementNode.prototype.setPosition = function (p,n) {
    this.posLine = p;
    this.numLine = n;
};

ReturnStatementNode.prototype.setValue = function (value) {
    this.value = value;
};


ReturnStatementNode.prototype.getType = function () {

    return "ReturnStatementNode";
};
