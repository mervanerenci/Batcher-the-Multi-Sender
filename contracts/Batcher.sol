// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Batcher {

    event BatchTransfer(
        address indexed token,
        address indexed sender,
        address[] recipients,
        uint256[] amounts
    );

    function sendToMultipleRecipients(
        address _token,
        address[] memory _recipients,
        uint256[] memory _amounts
    ) external {
        require(_recipients.length == _amounts.length, "Recipients and amounts arrays must have the same length");
        
        IERC20 token = IERC20(_token);
        uint256 totalAmount = 0;

        for (uint256 i = 0; i < _recipients.length; i++) {
            totalAmount += _amounts[i];
        }

        require(token.allowance(msg.sender, address(this)) >= totalAmount, "Batcher contract not approved to spend tokens");

        for (uint256 i = 0; i < _recipients.length; i++) {
            token.transferFrom(msg.sender, _recipients[i], _amounts[i]);
        }

        emit BatchTransfer(_token, msg.sender, _recipients, _amounts);
    }

    function batchTransferFrom(
        address _token,
        address[] memory _senders,
        address[] memory _recipients,
        uint256[] memory _amounts
    ) external {
        require(
            _senders.length == _recipients.length && _recipients.length == _amounts.length,
            "Senders, recipients, and amounts arrays must have the same length"
        );
        
        IERC20 token = IERC20(_token);

        for (uint256 i = 0; i < _recipients.length; i++) {
            token.transferFrom(_senders[i], _recipients[i], _amounts[i]);
        }

        emit BatchTransfer(_token, address(this), _recipients, _amounts);
    }

}
