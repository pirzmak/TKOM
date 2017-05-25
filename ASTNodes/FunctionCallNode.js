var FunctionCallNode = function () {
    this.name = "";
    this.arguments = [];
    this.posLine = 0;
    this.numLine = 0;
};

FunctionCallNode.prototype.setPosition = function (p,n) {
    this.posLine = p;
    this.numLine = n;
};

FunctionCallNode.prototype.setName = function (name) {

    this.name = name;
};

FunctionCallNode.prototype.addArgument = function (argument) {

    if (this.arguments !== undefined) {
        this.arguments.push(argument);
    } else {
        this.arguments = [argument]
    }
};

FunctionCallNode.prototype.getType = function () {

    return "FunctionCallNode";
};
