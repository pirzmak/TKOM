var VarDeclarationNode = function () {
    this.name = "";
    this.value = "";
    this.posLine = 0;
    this.numLine = 0;
};

VarDeclarationNode.prototype.setPosition = function (p,n) {
    this.posLine = p;
    this.numLine = n;
};
VarDeclarationNode.prototype.setName = function (name) {

    this.name = name;
};

VarDeclarationNode.prototype.setValue = function (value) {

    this.value = value;
};

VarDeclarationNode.prototype.getType = function () {

    return "VarDeclarationNode";
};