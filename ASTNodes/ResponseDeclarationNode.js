var ResponseDeclarationNode = function () {
    this.name = "";
    this.value = "";
    this.posLine = 0;
    this.numLine = 0;
};

ResponseDeclarationNode.prototype.setPosition = function (p,n) {
    this.posLine = p;
    this.numLine = n;
};

ResponseDeclarationNode.prototype.setName = function (name) {

    this.name = name;
};

ResponseDeclarationNode.prototype.setBody = function (value) {

    this.value = value;
};

ResponseDeclarationNode.prototype.getType = function () {

    return "ResponseDeclarationNode";
};
