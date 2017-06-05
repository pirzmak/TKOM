var ExpressionNode = function (operations,operants) {
    this.operations = operations;
    this.operants = operants;
};

ExpressionNode.prototype.execute = function (scope) {

    var result;

    if (!isNaN(parseFloat(this.operants[0])) && isFinite(this.operants[0]))
        result =  this.operants[0];
    else
        result = this.operants[0].execute(scope);

    if(!this.operations || this.operations.length === 0){
        return result;
    }

    var tmpThis = this;
    var i = 0;
    for(var operation in this.operations){

        var x = tmpThis.operants[i+1];
        i++;

        switch (this.operations[operation]) {
            case TokenType.PLUS:
                result += x.execute(scope);
                break;
            case TokenType.MINUS:
                result -= x.execute(scope);
                break;
            case TokenType.MULTIPLY:
                result *= x.execute(scope);
                break;
            case TokenType.DIVIDE:
                result /= x.execute(scope);
                break;
            case TokenType.MODULO:
                result %= x.execute(scope);
            default:
                var type = "Unexpexted operation";
                ErrorHandler.error(new MyError(ErrorType.SEMANTICERROR, type, "", ""));

        }
    }

    return result;
};

ExpressionNode.prototype.getType = function () {

    return "ExpressionNode";
};