var BodyDeclarationNode = function () {
    this.name = "";
    this.body = "";
    this.posLine = 0;
    this.numLine = 0;
};

BodyDeclarationNode.prototype.setPosition = function (p,n) {
    this.posLine = p;
    this.numLine = n;
};

BodyDeclarationNode.prototype.setName = function (name) {

    this.name = name;
};

BodyDeclarationNode.prototype.setBody = function (body) {

    this.body = body;
};

BodyDeclarationNode.prototype.getType = function () {

    return "BodyDeclarationNode";
};
