var ProgramNode = function (functions,scope) {
    this.functions = functions;
    this.scopeProto = scope;
};

ProgramNode.prototype.execute = function (scope) {

    scope.functions["main"].execute(scope);
};


ProgramNode.prototype.getType = function () {

    return "ProgramNode";
};
