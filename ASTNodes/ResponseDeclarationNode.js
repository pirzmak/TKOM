var ResponseDeclarationNode = function (name,value) {
    this.name = name;
    this.value = value;
};

ResponseDeclarationNode.prototype.execute = function (scope) {

    if(this.value)
        scope._setVariable(this.name,this.value.execute());
};

ResponseDeclarationNode.prototype.getType = function () {

    return "ResponseDeclarationNode";
};
