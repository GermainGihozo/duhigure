// Form Validation Functions for DUHIGURE System

// Family Form Validation
function validateFamilyForm() {
    let isValid = true;
    const errors = [];

    // Family Name Validation
    const familyName = document.getElementById('familyName').value.trim();
    if (!familyName || familyName.length < 2) {
        showError('familyName', 'Please enter a valid family name (minimum 2 characters)');
        isValid = false;
    } else {
        clearError('familyName');
    }

    // Head of Family Validation
    const headName = document.getElementById('headName').value.trim();
    if (!headName || headName.length < 3) {
        showError('headName', 'Please enter the head of family name');
        isValid = false;
    } else {
        clearError('headName');
    }

    // National ID Validation (Rwandan ID format)
    const nid = document.getElementById('nid').value.trim();
    const nidPattern = /^(1|2)\d{15}$/; // Rwandan ID pattern
    if (!nid || !nidPattern.test(nid)) {
        showError('nid', 'Please enter a valid Rwandan National ID (16 digits starting with 1 or 2)');
        isValid = false;
    } else {
        clearError('nid');
    }

    // Phone Number Validation (Rwandan format)
    const phone = document.getElementById('phone').value.trim();
    const phonePattern = /^(07[2-8]|078|073)\d{7}$/;
    if (!phone || !phonePattern.test(phone)) {
        showError('phone', 'Please enter a valid Rwandan phone number (e.g., 078XXXXXXX)');
        isValid = false;
    } else {
        clearError('phone');
    }

    // Sector Selection Validation
    const sector = document.getElementById('sector').value;
    if (!sector) {
        showError('sector', 'Please select your sector');
        isValid = false;
    } else {
        clearError('sector');
    }

    if (isValid) {
        showSuccess('Family registration successful!');
        // In production, you would submit to server here
        setTimeout(() => {
            window.location.href = 'members.html?family=' + encodeURIComponent(familyName);
        }, 1500);
    }

    return false; // Prevent actual form submission for demo
}

// Member Form Validation
function validateMemberForm() {
    let isValid = true;

    // Member Name Validation
    const memberName = document.getElementById('memberName').value.trim();
    if (!memberName || memberName.length < 3) {
        showError('memberName', 'Please enter member name (minimum 3 characters)');
        isValid = false;
    } else {
        clearError('memberName');
    }

    // Relationship Validation
    const relation = document.getElementById('relation').value;
    if (!relation) {
        showError('relation', 'Please select relationship');
        isValid = false;
    } else {
        clearError('relation');
    }

    // Age Validation
    const age = document.getElementById('age').value;
    if (!age || age < 0 || age > 120) {
        showError('age', 'Please enter a valid age (0-120)');
        isValid = false;
    } else {
        clearError('age');
    }

    // Role Validation
    const role = document.getElementById('role').value.trim();
    if (!role || role.length < 2) {
        showError('role', 'Please enter role in family');
        isValid = false;
    } else {
        clearError('role');
    }

    if (isValid) {
        showSuccess('Family member added successfully!');
        // Reset form after successful submission
        setTimeout(() => {
            document.getElementById('memberName').value = '';
            document.getElementById('relation').value = '';
            document.getElementById('age').value = '';
            document.getElementById('role').value = '';
        }, 2000);
    }

    return false;
}

// Helper Functions
function showError(elementId, message) {
    const element = document.getElementById(elementId);
    element.classList.add('is-invalid');
    element.classList.remove('is-valid');
    
    // Remove existing error message
    const existingError = element.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    element.parentNode.appendChild(errorDiv);
}

function clearError(elementId) {
    const element = document.getElementById(elementId);
    element.classList.remove('is-invalid');
    element.classList.add('is-valid');
    
    // Remove error message
    const errorDiv = element.parentNode.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function showSuccess(message) {
    // Create success alert
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success alert-dismissible fade show';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Insert at the top of the form
    const form = document.querySelector('form');
    form.insertBefore(alertDiv, form.firstChild);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Phone number formatting
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.startsWith('250')) {
        value = '0' + value.substring(3);
    }
    
    // Format as 078 XXX XXX
    if (value.length >= 3) {
        value = value.substring(0, 9);
        input.value = value.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
    } else {
        input.value = value;
    }
}

// National ID formatting
function formatNationalID(input) {
    let value = input.value.replace(/\D/g, '');
    value = value.substring(0, 16);
    
    // Format as 1 1234 5678 9012 3456
    if (value.length > 4) {
        input.value = value.replace(/(\d{1})(\d{4})(\d{4})(\d{4})(\d{3})/, '$1 $2 $3 $4 $5');
    } else {
        input.value = value;
    }
}

// Initialize form validation on page load
document.addEventListener('DOMContentLoaded', function() {
    // Add input formatting
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', () => formatPhoneNumber(input));
    });
    
    const nidInputs = document.querySelectorAll('input[name="nid"]');
    nidInputs.forEach(input => {
        input.addEventListener('input', () => formatNationalID(input));
    });
});