// 🔗 Replace with your Google Apps Script Web App URL
document.addEventListener('DOMContentLoaded', () => {
    // 🔗 Replace with your actual Google Apps Script Web App URL
    const API_URL = 'https://script.google.com/macros/s/AKfycbwUXiXmLCZd-Tbg4zZbyLPBTGWqWFBMSjKe99Ljbn8nRGdfzSoLkWBWt3_6Pklr0qYkcw/exec';
    const THANK_YOU_PAGE = '/thankyou.html'; 

    async function submitForm(form, btn) {
        const originalText = btn.textContent;
        btn.disabled = true;
        btn.textContent = 'جاري الإرسال...';

        try {
            await fetch(API_URL, {
                method: 'POST',
                body: JSON.stringify(form._data),
                headers: { 'Content-Type': 'text/plain;charset=utf-8' }
            });
            window.location.href = THANK_YOU_PAGE;

        } catch (err) {
            console.error('Submission Error:', err);
            alert('حدث خطأ أثناء الإرسال. يرجى المحاولة لاحقاً.');
        } finally {
            btn.disabled = false;
            btn.textContent = originalText;
        }
    }

    // 🟦 Form 1: Popup (.pop-form)
    const popForm = document.querySelector('.pop-form');
    if (popForm) {
        popForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = popForm.querySelector('input[type="text"]').value.trim();
            const phone = popForm.querySelector('input[type="tel"]').value.trim();

            if (!name || !phone) return alert('يرجى ملء الاسم ورقم الهاتف');

            popForm._data = {
                source: 'Popup Form',
                name,
                phone,
                service: popForm.querySelector('select').value,
                message: popForm.querySelector('textarea').value.trim()
            };

            await submitForm(popForm, popForm.querySelector('button'));
        });
    }

    // 🟨 Form 2: Contact Form (.cf)
    const cfForm = document.querySelector('.cf');
    if (cfForm) {
        cfForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('cfName').value.trim();
            const phone = document.getElementById('cfPhone').value.trim();

            if (!name || !phone) return alert('يرجى ملء الاسم ورقم الهاتف');

            cfForm._data = {
                source: 'Contact Form',
                name,
                phone,
                service: document.getElementById('cfService').value,
                message: document.getElementById('cfMsg').value.trim()
            };

            await submitForm(cfForm, cfForm.querySelector('button'));
        });
    }
});