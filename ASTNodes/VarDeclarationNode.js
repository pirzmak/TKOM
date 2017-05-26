var VarDeclarationNode = function (name,value) {
    this.name = name;
    this.value = value;
};

VarDeclarationNode.prototype.getType = function () {

    return "VarDeclarationNode";
};