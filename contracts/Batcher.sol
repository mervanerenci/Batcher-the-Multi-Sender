// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Batcher {
    function sendToMultipleRecipients(
        address _token,
        address[] memory _recipients,
        uint256[] memory _amounts
    ) external {
        require(_recipients.length == _amounts.length, "Recipients and amounts arrays must have the same length");
        
        IERC20 token = IERC20(_token);

        for (uint256 i = 0; i < _recipients.length; i++) {
            token.transferFrom(msg.sender, _recipients[i], _amounts[i]);
        }
    }
}
