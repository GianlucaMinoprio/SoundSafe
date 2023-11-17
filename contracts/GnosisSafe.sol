pragma solidity ^0.8.9;

//this is a Templtate for the GnosisSafe contract and to enable a Safe contract


contract Enum {
    enum Operation {
        Call,
        DelegateCall,
        Create
        // Add more operations as needed
    }
}


contract ModuleManager{


    address internal constant SENTINEL_MODULES = address(0x1);
    mapping(address => address) internal modules;

    event EnabledModule(address module);
    event DisabledModule(address module);
    event ExecutionFromModuleSuccess(address module);
    event ExecutionFailure(address module);

    function setupModules(address to, address[] memory modules) public{
        require(modules.length > 0, "No modules provided");
        require(to != address(0), "Invalid to address provided");
        require(modules[0] != address(0), "Invalid first module address provided");
        require(modules[0] != SENTINEL_MODULES, "Invalid first module address provided");
        require(modules.length == 1, "Only one module supported");
        require(this.modules(to) == address(0), "Modules have already been initialized");
        this.setModules(to, modules[0]);
    }

    function checkModuleEnable(address module) public view returns(bool){
        return modules[module] != address(0) && SENTINEL_MODULES != modules[module];
    }

    function getEnableModules() public view returns(address[] memory){
        address[] memory result = new address[](getModulesCount());
        uint index = 0;
        address currentModule = modules[SENTINEL_MODULES];
        while(currentModule != SENTINEL_MODULES){
            result[index] = currentModule;
            currentModule = modules[currentModule];
            index++;
        }
        return result;
    }


    function execTransactionFromModule(
        address to,
        uint256 value,
        bytes memory data,
        Enum.Operation operation)
    public virtual returns(bool success){
        require(msg.sender != SENTINEL_MODULES && checkModuleEnable(msg.sender) && modules[msg.sender] != address (0), "Invalid module called");

        //execute tx whithout further confirmations


        success = execute(to, value, data, operation);
        if(success) emit ExecutionFromModuleSuccess(msg.sender);
        else emit ExecutionFailure(msg.sender);

    }

    function enableModule(address module) public{
        require(module != address(0), "Invalid module address provided");
        require(module != SENTINEL_MODULES, "Invalid module address provided");

        require(modules[module] == modules[SENTINEL_MODULES]);
        modules[SENTINEL_MODULES] = module;

        emit EnabledModule(module);
        //this.setModules(msg.sender, module);
    }

    function disableModule(address prevModule, address module) public authorized{
        require(module != address(0) && modules[prevModule] != SENTINEL_MODULES, "Invalid module provided");
        require(modules[prevModule] == module, "Invalid module address provided");
        modules[prevModule] = modules[module];
        modules[module] = address(0);
        emit DisabledModule(module);
    }
}

contract GnosisSafe is ModuleManager{
    //add
    function setup() external{

        //add
        setupModules(msg.sender, new address[](0));
        //add
    }

}

