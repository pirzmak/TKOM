var ExeFunction = function (name) {
    this.scopeProto = new ScopeProto();
    this.name = name;
    this.instructions = [];
};

