var TestDeclarationNode = function (name, value) {
    this.name = name;
    this.value = value;
};

TestDeclarationNode.prototype.execute = function (scope) {

    TestDeclarationNode._addTestToScope(scope,this.name,this.value);
};

TestDeclarationNode._addTestToScope = function(scope,name,value){
    if (value) {

        console.log((typeof value),value.execute().getType(),value.execute().getType() === "TestNode" && (typeof value) === 'object');
        if ((typeof value) === 'object' && value.execute().getType() === "TestNode") {
            scope._setVariable(name, value);
        } else {
            var type = "Zly typ : " + value + " nie jest typu Test";
            ErrorHandler.error(new MyError(ErrorType.PARSERERROR, type, "", ""));
        }
    }
};



TestDeclarationNode.prototype.getType = function () {

    return "TestDeclarationNode";
};

