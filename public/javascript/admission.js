// Handle form submission
document.getElementById('admission-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Get form values
    const studentName = document.getElementById('student-name').value;
    const age = document.getElementById('age').value;
    const grade = document.getElementById('grade').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;

    // Display the data in the console (You can replace this with actual form submission to server)
    console.log('Admission Form Submitted');
    console.log('Student Name:', studentName);
    console.log('Age:', age);
    console.log('Grade:', grade);
    console.log('Parent Email:', email);
    console.log('Phone:', phone);
    console.log('Address:', address);

    // Optionally, show a confirmation message to the user
    alert('Your admission form has been submitted successfully!');
    
    // Reset form after submission
    document.getElementById('admission-form').reset();
});