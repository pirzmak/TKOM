var TestDeclarationNode = function (name, value) {
    this.name = name;
    this.value = value;
};

TestDeclarationNode.prototype.execute = function (scope) {

    if (this.value) {
        var value = this.value.execute();
        if (typeof value !== 'object' || value.getType() !== "TestNode") {
            var type = "Zly typ " + value + " nie jest typu Test";
            ErrorHandler.error(new MyError(ErrorType.PARSERERROR, type, "", ""));
        }
    }
    scope._setVariable(this.name, this.value.execute());
};


TestDeclarationNode.prototype.getType = function () {

    return "TestDeclarationNode";
};

