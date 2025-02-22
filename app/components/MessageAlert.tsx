import React from 'react';

// Define types for the props
interface MessageAlertProps {
  message: string;
  type: 'info' | 'danger' | 'success' | 'warning'; // Allow only these values for the type
}

const MessageAlert: React.FC<MessageAlertProps> = ({ message, type }) => {
  return (
    <>
      {message && (
        <div className={`alert alert-${type}`} role="alert">
          {message}
        </div>
      )}
    </>
  );
};

export default MessageAlert;
