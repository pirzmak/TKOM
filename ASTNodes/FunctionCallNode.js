var FunctionCallNode = function (name,arguments) {
    console.log(name,arguments);
    this.name = name;
    this.arguments = arguments;
};


FunctionCallNode.prototype.getType = function () {

    return "FunctionCallNode";
};
