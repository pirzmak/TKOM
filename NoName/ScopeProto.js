var ScopeProto = function () {
    this.parentScope = undefined;
    this.variables = {};
};

var VariablesIsType = function (defined,type,literal) {
    this.defined = defined;
    this.type = type;
    this.literal = literal;
};

ScopeProto.prototype._addVariable = function (name,type)
{
    if (this.variables[name])
    {
        return false;
    }
    this.variables[name] = new VariablesIsType(false,type,undefined);
    return true;
};

ScopeProto.prototype._getVariable  = function (name)
{
    if (this.variables[name] !== undefined)
    {
        return this.variables[name];
    }

    return undefined;
};

ScopeProto.prototype._setVariable = function (name,literal) {

    if (this.variables[name] !== undefined)
    {
        this.variables[name].literal = literal;
        return;
    }

    if (this.parentScope !== undefined)
    {
        this.parentScope.setVariable(name, literal);
    }
};

ScopeProto.prototype._setVariableDefined  = function (name)
{
    if (this.variables[name] === undefined)
    {
        return;
    }

    this.variables[name].defined=true;
};

ScopeProto.prototype._hasVariable  = function (name)
{
    var tmp = this;
    while(true){
        if(tmp.parentScope === undefined && tmp.variables[name] === undefined)
            return false;
        if(tmp.variables[name] !== undefined)
            return true;
        tmp = tmp.parentScope;
    }
};

ScopeProto.prototype._isVariableDefined  = function (name)
{
    var tmp = this;
    while(true){
        if(tmp.parentScope === undefined && tmp.variables[name] === undefined)
            return false;
        if(tmp.variables[name] && tmp.variables[name].defined)
            return true;
        tmp = tmp.parentScope;
    }
};

ScopeProto.prototype._instantiate = function (parentScope){

    var instance = new ScopeProto();
    instance.parentScope = parentScope;

    instance.variables = this.variables.map(function (variable) {
        new Object(variable.name,new ExeLiteral())
    });

    return instance;
};

