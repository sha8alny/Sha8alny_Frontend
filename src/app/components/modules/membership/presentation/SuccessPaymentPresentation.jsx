"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DoneIcon from "@mui/icons-material/Done";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

/**
 * @namespace membership
 * @module membership
 */
/**
 * SuccessPaymentPresentation component displays a success message after a payment is made.
 * It shows a confirmation message and redirects the user to the membership page after 5 seconds.
 *
 * @component
 */

const SuccessPaymentPresentation = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/membership-page");
    }, );

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className=" flex items-center justify-center ">
      <div className="bg-foreground p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
        <div className="bg-background w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircleIcon className="text-secondary" sx={{ fontSize: 60 }} />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Thank you for your purchase. Your premium subscription has been
          activated.
        </p>

        <button
          onClick={() => router.push("/membership-page")}
          className="bg-secondary text-background font-medium py-2 px-6 rounded-lg hover:bg-opacity-90 transition-all cursor-pointer"
        >
          Return to Dashboard
        </button>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
          You will be redirected automatically in 5 seconds...
        </p>
      </div>
    </div>
  );
};

export default SuccessPaymentPresentation;
