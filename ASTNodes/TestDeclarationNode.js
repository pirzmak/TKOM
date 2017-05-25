var TestDeclarationNode = function () {
    this.name = "";
    this.value = "";
    this.posLine = 0;
    this.numLine = 0;
};

TestDeclarationNode.prototype.setPosition = function (p,n) {
    this.posLine = p;
    this.numLine = n;
};

TestDeclarationNode.prototype.setName = function (name) {

    this.name = name;
};

TestDeclarationNode.prototype.setValue = function (value) {

    this.value = value;
};

TestDeclarationNode.prototype.getType = function () {

    return "TestDeclarationNode";
};

