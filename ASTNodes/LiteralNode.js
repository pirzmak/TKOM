var LiteralNode = function (value) {
    this.value = value;
};

LiteralNode.prototype.execute = function (scope) {

    return this.value;
};

LiteralNode.prototype.getType = function () {

    return "LiteralNode";
};

