var ProgramNode = function (functions,scope) {
    this.functions = functions;
    this.scopeProto = scope;
};

ProgramNode.prototype.execute = function (scope) {

    this.functions.forEach(function (func) {
        func.execute(scope);
    });
};


ProgramNode.prototype.getType = function () {

    return "ProgramNode";
};
