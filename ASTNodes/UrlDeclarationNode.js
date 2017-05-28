var UrlDeclarationNode = function (name, value) {
    this.name = name;
    this.value = value;
};

UrlDeclarationNode.prototype.execute = function (scope) {

    UrlDeclarationNode._addUrlToScope(scope,this.name,this.value);
};

UrlDeclarationNode._addUrlToScope = function(scope,name,value){
    if (value) {
        if ((typeof value) === 'string') {
            scope._setVariable(name, value);
        } else {
            var type = "Zly typ : " + value + " nie jest typu Url";
            ErrorHandler.error(new MyError(ErrorType.PARSERERROR, type, "", ""));
        }
    }
};

UrlDeclarationNode.prototype.getType = function () {

    return "UrlDeclarationNode";
};
