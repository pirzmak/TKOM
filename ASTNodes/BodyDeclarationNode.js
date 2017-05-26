var BodyDeclarationNode = function (name,value) {
    this.name = name;
    this.value = value;
};

BodyDeclarationNode.prototype.getType = function () {

    return "BodyDeclarationNode";
};
