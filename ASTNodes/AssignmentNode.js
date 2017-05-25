var AssignmentNode = function () {
    this.variable = new VariableNode();
    this.value = "";
    this.posLine = 0;
    this.numLine = 0;
};

AssignmentNode.prototype.setPosition = function (p,n) {
    this.posLine = p;
    this.numLine = n;
};

AssignmentNode.prototype.setVariable = function (variable) {
    this.variable = variable;
};

AssignmentNode.prototype.setValue = function (value) {
    this.value = value;
};

AssignmentNode.prototype.getType = function () {

    return "AssignmentNode";
};