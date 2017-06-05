var ResponseDeclarationNode = function (name, value) {
    this.name = name;
    this.value = value;
};

ResponseDeclarationNode.prototype.execute = function (scope) {

    ResponseDeclarationNode._addResponseToScope(scope, this.name, this.value);
};

ResponseDeclarationNode._addResponseToScope = function (scope, name, value) {
    if (value) {
        if ((typeof value) === 'object') {
            scope._setVariable(name, value.execute(scope));
        } else {
            var type = "Zly typ : " + value + " nie jest typu Response";
            ErrorHandler.error(new MyError(ErrorType.PARSERERROR, type, "", ""));
        }
    }
};

ResponseDeclarationNode.prototype.getType = function () {

    return "ResponseDeclarationNode";
};
