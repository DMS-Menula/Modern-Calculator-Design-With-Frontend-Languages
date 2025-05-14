document.addEventListener('DOMContentLoaded', function() {
    // Calculator functionality
    class Calculator {
        constructor(previousOperandTextElement, currentOperandTextElement) {
            this.previousOperandTextElement = previousOperandTextElement;
            this.currentOperandTextElement = currentOperandTextElement;
            this.clear();
        }

        clear() {
            this.currentOperand = '0';
            this.previousOperand = '';
            this.operation = undefined;
            this.updateDisplay();
        }

        delete() {
            this.currentOperand = this.currentOperand.toString().slice(0, -1);
            if (this.currentOperand === '') {
                this.currentOperand = '0';
            }
            this.updateDisplay();
        }

        appendNumber(number) {
            if (number === '.' && this.currentOperand.includes('.')) return;
            if (this.currentOperand === '0' && number !== '.') {
                this.currentOperand = number.toString();
            } else {
                this.currentOperand = this.currentOperand.toString() + number.toString();
            }
            this.updateDisplay();
        }

        chooseOperation(operation) {
            if (this.currentOperand === '0') return;
            if (this.previousOperand !== '') {
                this.compute();
            }
            this.operation = operation;
            this.previousOperand = this.currentOperand;
            this.currentOperand = '0';
            this.updateDisplay();
        }

        compute() {
            let computation;
            const prev = parseFloat(this.previousOperand);
            const current = parseFloat(this.currentOperand);
            if (isNaN(prev) return;

            switch (this.operation) {
                case '+':
                    computation = prev + current;
                    break;
                case '-':
                    computation = prev - current;
                    break;
                case '*':
                    computation = prev * current;
                    break;
                case '/':
                    computation = prev / current;
                    break;
                case '%':
                    computation = prev % current;
                    break;
                default:
                    return;
            }

            // Animation effect
            const display = document.querySelector('.display');
            display.classList.add('compute-animation');
            setTimeout(() => {
                display.classList.remove('compute-animation');
            }, 300);

            this.currentOperand = computation.toString();
            this.operation = undefined;
            this.previousOperand = '';
            this.updateDisplay();
        }

        updateDisplay() {
            this.currentOperandTextElement.innerText = this.formatNumber(this.currentOperand);
            if (this.operation != null) {
                this.previousOperandTextElement.innerText = 
                    `${this.formatNumber(this.previousOperand)} ${this.operation}`;
            } else {
                this.previousOperandTextElement.innerText = '';
            }
        }

        formatNumber(number) {
            const stringNumber = number.toString();
            const integerDigits = parseFloat(stringNumber.split('.')[0]);
            const decimalDigits = stringNumber.split('.')[1];
            let integerDisplay;
            
            if (isNaN(integerDigits)) {
                integerDisplay = '';
            } else {
                integerDisplay = integerDigits.toLocaleString('en', {
                    maximumFractionDigits: 0
                });
            }
            
            if (decimalDigits != null) {
                return `${integerDisplay}.${decimalDigits}`;
            } else {
                return integerDisplay;
            }
        }
    }

    // DOM Elements
    const numberButtons = document.querySelectorAll('[data-number]');
    const operationButtons = document.querySelectorAll('[data-operation]');
    const equalsButton = document.querySelector('[data-operation="="]');
    const deleteButton = document.querySelector('[data-operation="del"]');
    const allClearButton = document.querySelector('[data-operation="ac"]');
    const previousOperandTextElement = document.getElementById('previous-operand');
    const currentOperandTextElement = document.getElementById('current-operand');
    const themeToggle = document.getElementById('theme-toggle');

    // Initialize calculator
    const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

    // Event Listeners
    numberButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Add ripple effect
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            button.appendChild(ripple);
            
            // Get click position
            const rect = button.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            
            // Position ripple
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            // Remove ripple after animation
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            calculator.appendNumber(button.dataset.number);
        });
    });

    operationButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.dataset.operation !== '=' && 
                button.dataset.operation !== 'del' && 
                button.dataset.operation !== 'ac') {
                
                // Add pulse effect to operation buttons
                button.classList.add('pulse');
                setTimeout(() => {
                    button.classList.remove('pulse');
                }, 300);
                
                calculator.chooseOperation(button.dataset.operation);
            }
        });
    });

    equalsButton.addEventListener('click', () => {
        // Add bounce effect to equals button
        equalsButton.classList.add('bounce');
        setTimeout(() => {
            equalsButton.classList.remove('bounce');
        }, 300);
        
        calculator.compute();
    });

    allClearButton.addEventListener('click', () => {
        // Add shake effect to AC button
        allClearButton.classList.add('shake');
        setTimeout(() => {
            allClearButton.classList.remove('shake');
        }, 300);
        
        calculator.clear();
    });

    deleteButton.addEventListener('click', () => {
        // Add shrink effect to DEL button
        deleteButton.classList.add('shrink');
        setTimeout(() => {
            deleteButton.classList.remove('shrink');
        }, 300);
        
        calculator.delete();
    });

    // Theme toggle functionality
    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    });

    // Check for saved theme preference
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'light') {
            themeToggle.checked = true;
        }
    }

    // Keyboard support
    document.addEventListener('keydown', function(event) {
        if (/[0-9.]/.test(event.key)) {
            event.preventDefault();
            const button = document.querySelector(`[data-number="${event.key}"]`);
            if (button) button.click();
        } else if (/[\+\-\*\/%]/.test(event.key)) {
            event.preventDefault();
            const button = document.querySelector(`[data-operation="${event.key}"]`);
            if (button) button.click();
        } else if (event.key === 'Enter' || event.key === '=') {
            event.preventDefault();
            equalsButton.click();
        } else if (event.key === 'Backspace') {
            event.preventDefault();
            deleteButton.click();
        } else if (event.key === 'Escape') {
            event.preventDefault();
            allClearButton.click();
        }
    });

    // Particles.js configuration
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: getComputedStyle(document.documentElement).getPropertyValue('--primary-color')
                },
                shape: {
                    type: "circle",
                    stroke: {
                        width: 0,
                        color: "#000000"
                    },
                    polygon: {
                        nb_sides: 5
                    }
                },
                opacity: {
                    value: 0.5,
                    random: false,
                    anim: {
                        enable: false,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: false,
                        speed: 40,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: getComputedStyle(document.documentElement).getPropertyValue('--primary-color'),
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: "none",
                    random: false,
                    straight: false,
                    out_mode: "out",
                    bounce: false,
                    attract: {
                        enable: false,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: {
                        enable: true,
                        mode: "grab"
                    },
                    onclick: {
                        enable: true,
                        mode: "push"
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 140,
                        line_linked: {
                            opacity: 1
                        }
                    },
                    bubble: {
                        distance: 400,
                        size: 40,
                        duration: 2,
                        opacity: 8,
                        speed: 3
                    },
                    repulse: {
                        distance: 200,
                        duration: 0.4
                    },
                    push: {
                        particles_nb: 4
                    },
                    remove: {
                        particles_nb: 2
                    }
                }
            },
            retina_detect: true
        });
    }
});
