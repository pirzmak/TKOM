var BodyDeclarationNode = function (name,value) {
    this.name = name;
    this.value = value;
};

BodyDeclarationNode.prototype.execute = function (scope) {

    if (this.value) {
        var value = this.value.execute();
        if (typeof value !== 'object' || value.getType() !== "BodyValue") {
            var type = "Zly typ " + value + " nie jest typu Body";
            ErrorHandler.error(new MyError(ErrorType.PARSERERROR, type, "", ""));
        }
    }
    scope._setVariable(this.name, this.value.execute());
};

BodyDeclarationNode.prototype.getType = function () {

    return "BodyDeclarationNode";
};
