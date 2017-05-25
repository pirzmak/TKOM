var Block = function () {
    this.scopeProto = new ScopeProto();
    this.instructions = [];
};

Block.prototype._execute = function (scope, functions) {
    var thisScope = this.scopeProto._instantiate(scope);

    this.instructions.forEach(function (it){
        var result = it._execute(thisScope, functions);

        if (result && ( result.break || it._canDoReturn())) {
            return result;
        }
    });

    return undefined;
};

Block.prototype._canDoReturn = function () {
    return true;
};

