var VarDeclarationNode = function (name,value) {
    this.name = name;
    this.value = value;
};

ResponseDeclarationNode.prototype.execute = function (scope) {

    if (this.value) {
        var value = this.value.execute();
        if (typeof value === 'object') {
            var type = "Zly typ " + value + " nie jest typu Body";
            ErrorHandler.error(new MyError(ErrorType.PARSERERROR, type, "", ""));
        }
    }
    scope._setVariable(this.name, this.value.execute());
};

VarDeclarationNode.prototype.getType = function () {

    return "VarDeclarationNode";
};