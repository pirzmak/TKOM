var AssignmentNode = function (variable,value) {
    this.variable = variable;
    this.value = value;
};

AssignmentNode.prototype.getType = function () {

    return "AssignmentNode";
};