var VarDeclarationNode = function (name,value) {
    this.name = name;
    this.value = value;
};

VarDeclarationNode.prototype.execute = function (scope) {

    VarDeclarationNode._addVarToScope(scope,this.name,this.value);
};

VarDeclarationNode._addVarToScope = function(scope,name,value){
    if (value) {
        if ((typeof this.value) !== 'object') {
            scope._setVariable(name, value);
        } else {
            var type = "Zly typ : " + value + " nie jest typu Var";
            ErrorHandler.error(new MyError(ErrorType.PARSERERROR, type, "", ""));
        }
    }
};

VarDeclarationNode.prototype.getType = function () {

    return "VarDeclarationNode";
};