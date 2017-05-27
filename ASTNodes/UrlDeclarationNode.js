var UrlDeclarationNode = function (name, value) {
    this.name = name;
    this.value = value;
};

UrlDeclarationNode.prototype.execute = function (scope) {

    if (this.value) {
        var value = this.value.execute();
        if ((typeof value) !== 'string') {
            var type = "Zly typ " + value + " nie jest typu Url";
            ErrorHandler.error(new MyError(ErrorType.PARSERERROR, type, "", ""));
        }
    }
    scope._setVariable(this.name, this.value.execute());
};

UrlDeclarationNode.prototype.getType = function () {

    return "UrlDeclarationNode";
};
