var FunctionCallNode = function (name,arguments) {
    this.name = name;
    this.arguments = arguments;
};

FunctionCallNode.prototype.execute = function (scope) {
    var executerArguments = this.arguments.map(function (arg) {
        var c = arg.execute(scope);
    return c});

    var tmpScope = scope;
    while(tmpScope.parentScope)
        tmpScope = tmpScope.parentScope;

    var a = tmpScope.functions[this.name].execute(tmpScope, executerArguments);
    return tmpScope.functions[this.name].execute(tmpScope, executerArguments);
};


FunctionCallNode.prototype.getType = function () {

    return "FunctionCallNode";
};
