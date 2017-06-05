var ScopeProto = function () {
    this.parentScope = undefined;
    this.variables = {};
    this.functions = {};
};

var VariablesIsType = function (defined,type,value) {
    this.defined = defined;
    this.type = type;
    this.value = value;
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
    var tmp = this;
    while(true){
        if(tmp.parentScope === undefined && tmp.variables[name] === undefined)
            return undefined;
        if(tmp.variables[name] !== undefined){
            return tmp.variables[name];
        }
        tmp = tmp.parentScope;
    }

};

ScopeProto.prototype._setVariable = function (name,literal) {

    if (this.variables[name] !== undefined)
    {
        this.variables[name].value = literal;
        return;
    }

    if (this.parentScope !== undefined)
    {
        this.parentScope._setVariable(name, literal);
    }
};

ScopeProto.prototype._setVariableDefined  = function (name)
{
    var tmp = this;
    while(true){
        if(tmp.parentScope === undefined && tmp.variables[name] === undefined)
            return;
        if(tmp.variables[name] !== undefined){
            tmp.variables[name].defined=true;
            return;
        }
        tmp = tmp.parentScope;
    }
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

