import Link from 'next/link'
import React from 'react'; 

type AuthErrorPageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

const AuthErrorPage: React.FC<AuthErrorPageProps> = ({ searchParams }) => {
  // --- Restoring searchParams usage ---
  // Handle potential array case for searchParams
  const messageParam = searchParams.message;
  let errorMessage = 'An unexpected error occurred during authentication.'; // Default message

  if (typeof messageParam === 'string') {
    errorMessage = messageParam;
  } else if (Array.isArray(messageParam) && messageParam.length > 0) {
    // If it's an array, take the first element (though unlikely for 'message')
    errorMessage = messageParam[0]; 
  }
  // If messageParam is undefined or an empty array, the default message remains

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-4">
      <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
      <p className="text-gray-700 mb-6">{errorMessage}</p>
      <p className="text-gray-600 mb-8">Please try signing in again or contact support if the problem persists.</p>
      <Link href="/auth">
        <span className="px-6 py-2 font-semibold text-sm bg-cyan-500 text-white rounded-full shadow-sm hover:bg-cyan-600 cursor-pointer">
          Go to Login
        </span>
      </Link>
    </div>
  );
};

export default AuthErrorPage;
