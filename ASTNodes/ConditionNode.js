var ConditionNode = function (operants, operator) {
    this.negated = false;
    this.operator = operator;
    this.operants = operants;
};

ConditionNode.prototype.setNegated = function () {

    this.negated = true;
};

ConditionNode.prototype.execute = function (scope) {

    var toReturn = false;

    if (this.operator === undefined || this.operator.length === 0) {
        switch (typeof this.operants[0]) {
            case 'object' : {
                if (this.operants[0].getType() === "ExpressionNode")
                    toReturn = this.operants[0].execute(scope) !== 0;
                else if (this.operants[0].getType() === "ConditionNode")
                    toReturn = this.operants[0].execute(scope);
                else {
                    var type = "Operator zlego typu ";
                    ErrorHandler.error(new MyError(ErrorType.SEMANTICERROR, type, this.getCurrToken().posLine, this.getCurrToken().numLine));
                }
                break;
            }
            default : {
                var type = "Operator zlego typu ";
                ErrorHandler.error(new MyError(ErrorType.SEMANTICERROR, type, this.getCurrToken().posLine, this.getCurrToken().numLine));
            }
        }
    } else {
        switch(this.operator) {
            case TokenType.AND: {
                this.operants.forEach(function (o) {if(!o.execute) toReturn = false; });
                break;
            }
            case TokenType.OR: {
                this.operants.forEach(function (o) {if(o.execute) toReturn = true; });
                break;
            }
            case TokenType.EQUALITY: {
                var a = ConditionNode._toExpression(scope,this.operants[0]);
                var b = ConditionNode._toExpression(scope,this.operants[1]);

                toReturn = a === b;
                break;
            }
            case TokenType.INEQUALITY: {
                var a = ConditionNode._toExpression(scope,this.operants[0]);
                var b = ConditionNode._toExpression(scope,this.operants[1]);

                toReturn = a !== b;
                break;
            }
            case TokenType.GREATEROREQUAL: {
                var a = ConditionNode._toExpression(scope,this.operants[0]);
                var b = ConditionNode._toExpression(scope,this.operants[1]);

                toReturn = a >= b;
                break;
            }
            case TokenType.GREATER: {
                var a = ConditionNode._toExpression(scope,this.operants[0]);
                var b = ConditionNode._toExpression(scope,this.operants[1]);

                toReturn = a > b;
                break;
            }
            case TokenType.LESSOREQUAL:{
                var a = ConditionNode._toExpression(scope,this.operants[0]);
                var b = ConditionNode._toExpression(scope,this.operants[1]);

                toReturn = a <= b;
                break;
            }
            case TokenType.LESS: {
                var a = ConditionNode._toExpression(scope,this.operants[0]);
                var b = ConditionNode._toExpression(scope,this.operants[1]);

                toReturn = a < b;
                break;
            }
        }
    }

    return this.negated ? !toReturn : toReturn;
};

ConditionNode._toExpression = function (scope,a) {

    while(a !== undefined && a.getType() === "ConditionNode")
        a = a.operants[0];

    if(a.getType() === "ExpressionNode" || a.getType() === "VariableNode" || a.getType() === "LiteralNode"){
        return a.execute(scope);
    }

    var type = "Operator zlego typu ";
    ErrorHandler.error(new MyError(ErrorType.SEMANTICERROR, type,0, 0));
};

ConditionNode.prototype.getType = function () {

    return "ConditionNode";
};
