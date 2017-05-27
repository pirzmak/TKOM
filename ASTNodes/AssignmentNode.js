var AssignmentNode = function (variable,value) {
    this.variable = variable;
    this.value = value;
};

AssignmentNode.prototype.execute = function (scope) {

    scope._setVariable(this.variable.name,this.value.execute());
};


AssignmentNode.prototype.getType = function () {

    return "AssignmentNode";
};