// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {
    uint256 private _value;

    event ValueChanged(uint256 newValue);

    // Fonction pour initialiser le contrat
    function initialize(uint256 initialValue) public {
        _value = initialValue;
        emit ValueChanged(initialValue);
    }

    // Fonction pour mettre à jour la valeur
    function setValue(uint256 newValue) public {
        _value = newValue;
        emit ValueChanged(newValue);
    }

    // Fonction pour lire la valeur
    function getValue() public view returns (uint256) {
        return _value;
    }
    function my_getAddress() public view returns (address)
    {
        return address(this);
    }
}