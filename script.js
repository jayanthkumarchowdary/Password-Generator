document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('password');
    const lengthInput = document.getElementById('length');
    const uppercaseCheckbox = document.getElementById('uppercase');
    const lowercaseCheckbox = document.getElementById('lowercase');
    const numbersCheckbox = document.getElementById('numbers');
    const symbolsCheckbox = document.getElementById('symbols');
    const generateBtn = document.getElementById('generateBtn');
    const copyBtn = document.getElementById('copyBtn');
    const requirementsList = document.getElementById('requirementsList');
    const meterBar = document.querySelector('.meter-bar');
    const strengthText = document.querySelector('.strength-text');

    const characters = {
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };

    function generatePassword() {
        let charset = '';
        let password = '';
        
        if (uppercaseCheckbox.checked) charset += characters.uppercase;
        if (lowercaseCheckbox.checked) charset += characters.lowercase;
        if (numbersCheckbox.checked) charset += characters.numbers;
        if (symbolsCheckbox.checked) charset += characters.symbols;

        if (!charset) {
            alert('Please select at least one character type!');
            return;
        }

        const length = parseInt(lengthInput.value);
        
        // Ensure minimum requirements are met first
        if (uppercaseCheckbox.checked) {
            password += characters.uppercase[Math.floor(Math.random() * characters.uppercase.length)];
        }
        if (lowercaseCheckbox.checked) {
            password += characters.lowercase[Math.floor(Math.random() * characters.lowercase.length)];
        }
        if (numbersCheckbox.checked) {
            password += characters.numbers[Math.floor(Math.random() * characters.numbers.length)];
        }
        if (symbolsCheckbox.checked) {
            password += characters.symbols[Math.floor(Math.random() * characters.symbols.length)];
        }

        // Fill the rest randomly
        while (password.length < length) {
            password += charset[Math.floor(Math.random() * charset.length)];
        }

        // Shuffle the password
        password = password.split('').sort(() => Math.random() - 0.5).join('');
        
        passwordInput.value = password;
        analyzePassword(password);
    }

    function analyzePassword(password) {
        const criteria = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*()_+-=[\]{}|;:,.<>?]/.test(password)
        };

        // Update requirement list
        Object.entries(criteria).forEach(([requirement, isMet]) => {
            const li = requirementsList.querySelector(`[data-requirement="${requirement}"]`);
            if (li) {
                li.className = isMet ? 'met' : '';
            }
        });

        // Calculate strength
        const strengthScore = Object.values(criteria).filter(Boolean).length;
        let strengthPercentage = (strengthScore / 5) * 100;
        let strengthColor = '#ff4444'; // red
        let strengthLabel = 'Weak';

        if (strengthScore > 2) {
            strengthColor = '#ffa700'; // orange
            strengthLabel = 'Moderate';
        }
        if (strengthScore > 4) {
            strengthColor = '#4CAF50'; // green
            strengthLabel = 'Strong';
        }

        meterBar.style.width = `${strengthPercentage}%`;
        meterBar.style.background = strengthColor;
        strengthText.textContent = strengthLabel;
    }

    function copyPassword() {
        if (!passwordInput.value) return;
        
        navigator.clipboard.writeText(passwordInput.value)
            .then(() => {
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = 'Copy';
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy:', err);
            });
    }

    generateBtn.addEventListener('click', generatePassword);
    copyBtn.addEventListener('click', copyPassword);
    passwordInput.addEventListener('input', (e) => analyzePassword(e.target.value));

    // Generate initial password
    generatePassword();
});