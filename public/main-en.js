document.addEventListener('DOMContentLoaded', () => {
    // 🔗 Replace with your actual Google Apps Script Web App URL
    const API_URL = 'https://script.google.com/macros/s/AKfycbwUXiXmLCZd-Tbg4zZbyLPBTGWqWFBMSjKe99Ljbn8nRGdfzSoLkWBWt3_6Pklr0qYkcw/exec';
    
    // 📄 Path to your thank-you page (relative or absolute)
    const THANK_YOU_PAGE = '/thankyou.html'; 

    async function handleSubmit(form, submitBtn) {
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        try {
            // Send data to Google Sheets
            await fetch(API_URL, {
                method: 'POST',
                body: JSON.stringify(form._data),
                headers: { 'Content-Type': 'text/plain;charset=utf-8' }
            });

            // Redirect to thank-you page on success
            window.location.href = THANK_YOU_PAGE;

        } catch (error) {
            console.error('Submission failed:', error);
            alert('Something went wrong. Please try again later.');
        } finally {
            // Reset button state (hidden if redirect triggers)
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }

    // ✅ Form 1: Popup Form (.pop-form)
    const popForm = document.querySelector('.pop-form');
    if (popForm) {
        popForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = popForm.querySelector('input[type="text"]').value.trim();
            const phone = popForm.querySelector('input[type="tel"]').value.trim();

            if (!name || !phone) {
                alert('Please fill in your full name and phone number.');
                return;
            }

            popForm._data = {
                source: 'Popup Form',
                name,
                phone,
                service: popForm.querySelector('select').value,
                message: popForm.querySelector('textarea').value.trim()
            };

            await handleSubmit(popForm, popForm.querySelector('button'));
        });
    }

    // ✅ Form 2: Contact Form (.cf)
    const cfForm = document.querySelector('.cf');
    if (cfForm) {
        cfForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('cfName').value.trim();
            const phone = document.getElementById('cfPhone').value.trim();

            if (!name || !phone) {
                alert('Please fill in your full name and phone number.');
                return;
            }

            cfForm._data = {
                source: 'Contact Form',
                name,
                phone,
                service: document.getElementById('cfService').value,
                message: document.getElementById('cfMsg').value.trim()
            };

            await handleSubmit(cfForm, cfForm.querySelector('button'));
        });
    }
});