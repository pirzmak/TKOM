var AssignmentNode = function (variable,value) {
    this.variable = variable;
    this.value = value;
};

AssignmentNode.prototype.execute = function (scope) {

    var variableType = scope._getVariable(this.variable.name).type;

    switch (variableType) {
        case TokenType.URL :
            UrlDeclarationNode._addUrlToScope(scope,this.variable.name,this.value.execute(scope));
            break;
        case TokenType.TEST :
            TestDeclarationNode._addTestToScope(scope,this.variable.name,this.value.execute(scope));
            break;
        case TokenType.VAR :
            VarDeclarationNode._addVarToScope(scope,this.variable.name,this.value.execute(scope));
            break;
        case TokenType.BODY :
            BodyDeclarationNode._addBodyToScope(scope,this.variable.name,this.value.execute(scope));
            break;
        default :
            var type = "Nieobsługiwany typ zmiennej : " + variableType;
            ErrorHandler.error(new MyError(ErrorType.PARSERERROR, type, "", ""));
    }
};

AssignmentNode.prototype.getType = function () {

    return "AssignmentNode";
};