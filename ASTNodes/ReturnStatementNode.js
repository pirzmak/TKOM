var ReturnStatementNode = function (value) {
    this.value = value;
};

ReturnStatementNode.prototype.getType = function () {

    return "ReturnStatementNode";
};
