var ReturnStatementNode = function (value) {
    this.value = value;
};

ReturnStatementNode.prototype.execute = function (scope) {
    var a =this.value.execute(scope);
    return this.value.execute(scope);
};

ReturnStatementNode.prototype.getType = function () {

    return "ReturnStatementNode";
};
