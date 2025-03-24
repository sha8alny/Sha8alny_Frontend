"use client";

/**
 * LoadingScreenPayment component renders a full-screen loading indicator
 * with a spinning animation and messages to inform the user that their
 * payment is being processed.
 *
 * @component
 */

const LoadingScreenPayment = () => {
  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 flex flex-col items-center justify-center z-50">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-secondary"></div>
    <p className="mt-4 text-lg font-medium text-text">
      Processing your payment...
    </p>
    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
      Please don't close this window
    </p>
  </div>
  )
}

export default LoadingScreenPayment