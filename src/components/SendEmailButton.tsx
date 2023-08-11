import React, { useState } from 'react';
import axios from 'axios';

interface EmailProps {
  recipient: string;
  subject: string;
  text: string;
}

const SendEmailButton: React.FC<EmailProps> = ({
  recipient,
  subject,
  text,
}) => {
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendEmail = async () => {
    try {
      setIsSending(true);
      setError(null);

      const response = await axios.post(
        'http://localhost:3000/api/mail/send-email',
        {
          recipient,
          subject,
          text,
        }
      );

      console.log(response.data.message);
      setIsSending(false);
      setIsSent(true);
    } catch (error) {
      console.log('Error sending email:', error);
      setError('Failed to send email. Please try again.');
      setIsSending(false);
    }
  };

  return (
    <div>
      <button onClick={handleSendEmail} disabled={isSending || isSent}>
        {isSending ? 'Sending...' : 'Send Email'}
      </button>
      {isSent && <p>Email sent successfully!</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default SendEmailButton;
