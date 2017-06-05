var FunctionNode = function (name,parameters,blockStatement) {
    this.name = name;
    this.parameters = parameters;
    this.blockStatement = blockStatement;
};

var NameValue = function (name, value) {
    this.name = name;
    this.value = value;
};

FunctionNode.prototype.execute = function (scope, arguments) {
    var arguments1 = [];

    if(arguments !== undefined)
    for(var i = 0; i < arguments.length; i++){
        arguments1.push(new NameValue(this.parameters[i].nameParameter,arguments[i]));
    }

    return this.blockStatement.execute(scope, arguments1);
};

FunctionNode.prototype.getType = function () {

    return "FunctionNode";
};

