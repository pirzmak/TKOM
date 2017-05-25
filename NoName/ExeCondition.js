var ExeCondition = function () {
    this.negated = false;
    this.operator = TokenType.INVALID;
    this.operants = [];
};

ExeCondition.prototype._execute = function (scope, functions) {
    var result;
    switch (this.operator) {
        case TokenType.INVALID: {
            if (!this.negated) {
                return this.operants[0]._execute(scope, functions);
            }
            else {
                result = new ExeLiteral();
                result.castedToBool = true;
                result.data = this.operants[0]._execute(scope, functions)._isTruthy() ? 0 : 1;
                return result;
            }
        }
        case TokenType.OR: {
            //result = new ExeLiteral();
            result.castedToBool = true;
            this.operants.forEach(function (o) {
                if (o._execute(scope, functions)._isTruthy()) {
                    result.data = 1;
                    return result;
                }
            });
            result.data = 0;
            return result;
        }
        case TokenType.AND: {
            result = new ExeLiteral();
            result.castedToBool = true;
            this.operants.forEach(function (o) {
                if (!o._execute(scope, functions)._isTruthy()) {
                    result.data = 0;
                    return result;
                }
            });
            result.data = 1;
            return result;
        }
        case TokenType.EQUALITY: {
            result = new ExeLiteral();
            result.castedToBool = true;

            var left = this.operants[0]._execute();
            var right = this.operants[1]._execute();

            result.data = left._isTruthy() === right._isTruthy();
            return result;
        }
    }
};