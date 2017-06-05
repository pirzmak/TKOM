var VariableNode = function () {
    this.name = "";
    this.type = "";
    this.posLine = 0;
    this.numLine = 0;
};

VariableNode.prototype.execute = function (scope) {
    var toReturn = scope._getVariable(this.name);
    if(toReturn === undefined){
        var type = "Zmienna nie zdefinowana " + this.name;
        ErrorHandler.error(new MyError(ErrorType.SEMANTICERROR, type,0, 0));
    }

    return toReturn.value;


};

VariableNode.prototype.setName = function (name) {
    this.name = name;
};

VariableNode.prototype.setType = function (type) {
    this.type = type;
};

VariableNode.prototype.getType = function () {

    return "VariableNode";
};

