// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Storage {
    float public storedData;

    event CalculationPerformed(
        float num1,
        float num2,
        string operation,
        float result
    );

    constructor() {
        storedData = 0; // Explicit initialization
    }

    function set(float x) public {
        storedData = x;
    }

    function get() public view returns (float) {
        return storedData;
    }

    function add(float num1, float num2) public {
        storedData = num1 + num2;
        emit CalculationPerformed(num1, num2, "addition", storedData);
    }

    function subtract(float num1, float num2) public {
        require(num1 >= num2, "Result would be negative");
        storedData = num1 - num2;
        emit CalculationPerformed(num1, num2, "subtraction", storedData);
    }

    function multiply(float num1, float num2) public {
        storedData = num1 * num2;
        emit CalculationPerformed(num1, num2, "multiplication", storedData);
    }

    function divide(float num1, float num2) public {
        require(num2 > 0, "Division by zero");
        storedData = num1 / num2;
        emit CalculationPerformed(num1, num2, "division", storedData);
    }

    function reset() public {
        storedData = 0;
    }
}