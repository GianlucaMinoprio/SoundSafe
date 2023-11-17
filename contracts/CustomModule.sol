pragma solidity ^0.8.9;

contract Enum {
    enum Operation {
        Call,
        DelegateCall,
        Create
        // Add more operations as needed
    }
}

contract CustomModule is Module{

    address public target;

    function customModule(
        address to,
        uint256 value,
        bytes memory data
    ) public returns (bool success) {
        require(msg.sender == address(this), "Only this contract can call this function");

        (success, ) = to.call.value(value)(data);
        if (success) {
            emit ExecutionFromModuleSuccess(msg.sender);
        } else {
            emit ExecutionFailure(msg.sender);
        }
    }

    function execTransactionFromModule(
        address to,
        uint256 value,
        bytes memory data,
        Enum.Operation operation
    ) public virtual returns (bool success) {
        // Implement the logic for executing transactions from the module
        // You can use the provided Enum.Operation to determine the type of operation

        // Example: Execute a transaction using delegatecall
        if (operation == Enum.Operation.DelegateCall) {
            (success, ) = to.delegatecall(data);
        } else {
            // Implement logic for other operations (Call, Create) if needed
            revert("Unsupported operation");
        }

        if (success) {
            emit ExecutionFromModuleSuccess(msg.sender);
        } else {
            emit ExecutionFailure(msg.sender);
        }
    }
}

contract Module{
    event ExecutionFromModuleSuccess(address module);
    event ExecutionFailure(address module);

    function execTransactionFromModule(
        address to,
        uint256 value,
        bytes memory data,
        Enum.Operation operation)

    public virtual returns(bool success);
    function enableModule(address module) public;
    function disableModule(address module) public;
    function setupModules(address to, address[] memory modules) public;
    function checkModuleEnable(address module) public view returns(bool);
    function getEnabledModules() public view returns(address[] memory);

    function execTransactionFromModule(
        address to,
        uint256 value,
        bytes memory data,
        Enum.Operation operation)

    public virtual returns(bool success);
}