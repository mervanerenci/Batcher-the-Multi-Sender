// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

// recipent : ["0xf2da34Cd62c013768C996e339A3ED6d7D060Ad87"]
// usdc . "0xe9DcE89B076BA6107Bb64EF30678efec11939234"
// ["0xf2da34Cd62c013768C996e339A3ED6d7D060Ad87"," 0xd384d97b2FE81A16d498c6A2f0a9580493635383"]

contract Batcher {
    using SafeMath for uint256;
    address private _owner;

    event BatchTransfer(
        address indexed token,
        address indexed sender,
        address[] recipients,
        uint256[] amounts
    );

    event FeeTransfer(
        address indexed token,
        address indexed sender,
        uint256 amount
    );

     constructor() {
        _owner = msg.sender;
    }


     modifier onlyOwner() {
        require(msg.sender == _owner, "Not a valid user");
        _;
    }

    uint256 public  FEE_PERCENT = 5;

    function sendToMultipleRecipients(
        address _token,
        address[] memory _recipients,
        uint256[] memory _amounts
    ) external {
        require(_recipients.length == _amounts.length, "Mismatched input arrays");
        
        uint256 totalAmount = 0;

        // Cast token into an IERC20Metadata interface to access decimals()
        // This way we will get the right number of tokens regardless of their decimal precision
        IERC20Metadata token = IERC20Metadata(_token);
        uint256 decimals = token.decimals();

        require(decimals > 5, "unsupported token");

        // Calculate the total amount of tokens to be transferred, considering fees
        for (uint256 i = 0; i < _amounts.length; i++) {
            totalAmount = totalAmount.add(_amounts[i]);
        }


        uint256 feeAmount = calculateFee(totalAmount, decimals);

        require(
            token.allowance(msg.sender, address(this)) >= totalAmount.add(feeAmount),
            "Insufficient allowance"
        );

        for (uint256 i = 0; i < _recipients.length; i++) {
            uint256 adjustedAmount = adjustAmount(_amounts[i], decimals);
            token.transferFrom(msg.sender, _recipients[i], adjustedAmount);
        }

        emit BatchTransfer(_token, msg.sender, _recipients, _amounts);

        token.transferFrom(
            msg.sender,
            address(0x4FA1be46b166b03A36F165A16636AC0f2a2AD883),
            feeAmount
        );

        emit FeeTransfer(_token, msg.sender, feeAmount);
        
    }

    function calculateFee(
        uint256 _amount,
        uint256 _decimals
    ) public pure returns (uint256) {
        uint256 ust = _amount.mul(10 ** _decimals).mul(5);
        return ust.div(10000);
        
    }

    function adjustAmount(uint256 _amount, uint256 _decimals) internal pure returns (uint256) {
        return _amount.mul(10**_decimals);
    }

    function setFee(uint256 _fee) external onlyOwner {
        FEE_PERCENT = _fee;
    }

    
}
