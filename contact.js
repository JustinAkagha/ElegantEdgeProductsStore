document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector('form');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        // Displaying an alert with the message
        alert(`Dear ${name}, your message has been sent. Thank you!`);
        
        // Resetting the form fields after submission
        form.reset();
    });
});
