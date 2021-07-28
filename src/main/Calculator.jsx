import { div } from 'prelude-ls';
import React, { Component } from 'react';
import './Calculator.css';

import Button from '../components/Button';
import Display from '../components/Display';

const initialState = {
    displayValue: '',
    clearDisplay: false,
    operation: null,
    values: [0, 0],
    current: 0
};

const PRECISION = 2; //Number of decimal places

export default class Calculator extends Component {
    state = { ...initialState };

    constructor(props) {
        super(props);

        this.clearMemory = this.clearMemory.bind(this);
        this.setOperation = this.setOperation.bind(this);
        this.setDigit = this.setDigit.bind(this);
    }

    clearMemory() {
        this.setState({ ...initialState });
    }

    setOperation(operation) { 

        if (this.state.current === 0) { //Changing current to save the entry in this.state.value[1]
            this.setState({ operation, current: 1, clearDisplay: true });
        } else { //If !current we can do the math operation.
            const equals = operation === '=';
            const currentOperation = this.state.operation;

            const values = [...this.state.values];

            //Performing mathematical operation
            try {
                switch (currentOperation) {
                    case "+":
                        values[0] += values[1];
                        break;
                    case "-":
                        values[0] -= values[1];
                        break;
                    case "*":
                        values[0] *= values[1].toFixed(PRECISION);
                        break;
                    case "/":
                        values[0] = (values[0] / values[1]).toFixed(PRECISION);
                        break;
                    default:
                        values[0] = this.state.values[0];
                        break;
                }
            } catch (error) {
                values[0] = this.state.values[0];
            }
            values[1] = 0;

            this.setState({
                displayValue: values[0],
                operation: equals ? null: operation,
                current: equals ? 0: 1,
                clearDisplay: !equals,
                values,
            })
        }
    }

    setDigit(n) {
        if (n === '.' && this.state.displayValue.includes('.')) {
            return; //Prevent the user from typing two "."
        }

        const clearDisplay = this.state.displayValue === '0' || this.state.clearDisplay; //  Prevent entries with a leading zero (like 00009 or 045)
        const curretValue = clearDisplay ? '' : this.state.displayValue;
        const displayValue = curretValue + n;
        this.setState({ displayValue, clearDisplay: false });

        if (n !== '.') {
            const i = this.state.current;
            const newValue = parseFloat(displayValue);
            const values = [...this.state.values];
            values[i] = newValue;
            this.setState({ values });
        }
    }

    render() {
        return (
            <div className="calculator">
                <Display value={this.state.displayValue} />
                <Button label="AC" click={this.clearMemory} triple />
                <Button label="/" click={this.setOperation} operation />
                <Button label="7" click={this.setDigit} />
                <Button label="8" click={this.setDigit} />
                <Button label="9" click={this.setDigit} />
                <Button label="*" click={this.setOperation} operation />
                <Button label="4" click={this.setDigit} />
                <Button label="5" click={this.setDigit} />
                <Button label="6" click={this.setDigit} />
                <Button label="-" click={this.setOperation} operation />
                <Button label="1" click={this.setDigit} />
                <Button label="2" click={this.setDigit} />
                <Button label="3" click={this.setDigit} />
                <Button label="+" click={this.setOperation} operation />
                <Button label="0" click={this.setDigit} double />
                <Button label="." click={this.setDigit} />
                <Button label="=" click={this.setOperation} operation />
            </div>
        )
    }
}