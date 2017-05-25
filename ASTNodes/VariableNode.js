var VariableNode = function () {
    this.name = "";
    this.type = "";
    this.posLine = 0;
    this.numLine = 0;
};

VariableNode.prototype.setPosition = function (p,n) {
    this.posLine = p;
    this.numLine = n;
};

VariableNode.prototype.setName = function (name) {
    this.name = name;
};

VariableNode.prototype.setType = function (type) {
    this.type = type;
};

VariableNode.prototype.getType = function () {

    return "VariableNode";
};

