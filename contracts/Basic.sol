pragma solidity ^0.8.9;

contract SimpleWallet {
    address public owner;

    event Deposit(address indexed account, uint256 amount);
    event Withdraw(address indexed account, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner");
        _;
    }

    function getAdress() public view returns (address){
        return owner;
    }

    function deposit() public payable {
        require(msg.sender != owner);
        require(msg.value > 0, "Deposit amount must be greater than zero");
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw() public {
        require(msg.sender == owner);
        payable(owner).transfer(address(this).balance);
        emit Withdraw(owner, address(this).balance);
    }
}