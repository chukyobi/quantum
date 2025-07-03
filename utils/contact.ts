import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

/**
 * Sends a contact email using SendGrid.
 * 
 * @param {string} from - The sender's email address (provided by the user).
 * @param {string} name - The sender's name (provided by the user).
 * @param {string} to - The recipient's email address.
 * @param {string} message - The message from the sender.
 * @returns {Promise<boolean>} - Returns true if email sent successfully.
 */
async function sendContactEmail(from: string, name: string, to: string, message: string): Promise<boolean> {
    const msg = {
        to, 
        from, 
        subject: `New Contact Message from ${name} (${from})`, // Include the sender's name in the subject
        html: `
            <div>
                <h2>New Contact Message</h2>
                <p><strong>Name:</strong> ${name}</p> <!-- Display sender's name -->
                <p><strong>Email:</strong> ${from}</p> <!-- Display sender's email -->
                <p><strong>Message:</strong> ${message}</p> <!-- Display the messages -->
            </div>
        `,
    };

    try {
        await sgMail.send(msg);
        console.log('Contact message sent from:', from);
        return true;
    } catch (error) {
        console.error('Error sending contact email:', error);
        throw new Error('Failed to send contact email');
    }
}

export default sendContactEmail;
