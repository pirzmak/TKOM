var ScopeInst = function () {
    this.parentScope = new ScopeInst();
    this.variables = {};
};

ScopeInst.prototype._getVariable = function (name) {
    auto it = this->variables.find(name);
    if (it != this->variables.end())
    {
        return it->second;
    }

    if (this->upperScope != nullptr)
    {
        return this->upperScope->getVariable(name);
    }

    return nullptr;
}

void setVariable(const std::string& name, std::shared_ptr<Literal> literal)
{
    auto it = this->variables.find(name);
    if (it != this->variables.end())
    {
        it->second = literal;
        return;
    }

    if (this->upperScope != nullptr)
    {
        this->upperScope->setVariable(name, literal);
        return;
    }

    ErrorHandler::error(
        std::string("Setting undefined variable")
    );
    return ;
}
};
