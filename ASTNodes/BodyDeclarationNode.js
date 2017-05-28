var BodyDeclarationNode = function (name,value) {
    this.name = name;
    this.value = value;
};

BodyDeclarationNode.prototype.execute = function (scope) {

    BodyDeclarationNode._addBodyToScope(scope,this.name,this.value);
};

BodyDeclarationNode._addBodyToScope = function(scope,name,value){
    if (value) {
        if ((typeof value) === 'object' && value.execute().getType() === "BodyValue") {
            scope._setVariable(name, value);
        } else {
            var type = "Zly typ : " + value + " nie jest typu Body";
            ErrorHandler.error(new MyError(ErrorType.PARSERERROR, type, "", ""));
        }
    }
};

BodyDeclarationNode.prototype.getType = function () {

    return "BodyDeclarationNode";
};
