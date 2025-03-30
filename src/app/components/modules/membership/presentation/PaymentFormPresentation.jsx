"use client";

import { CreditCard } from "@mui/icons-material";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import countries from "../../../../../../public/data/countries";
import LoadingScreenPayment from "./LoadingScreenPayment";

/**
 * @namespace membership
 * @module membership
 */
/**
 * PaymentFormPresentation component renders a payment form with options for selecting a premium plan,
 * entering card details, and submitting the payment.
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.name - The cardholder's name.
 * @param {Function} props.setName - Function to set the cardholder's name.
 * @param {string} props.country - The selected country.
 * @param {Function} props.setCountry - Function to set the selected country.
 * @param {Object} props.errors - Object containing validation errors.
 * @param {Object} props.stripeStyle - Style object for Stripe elements.
 * @param {Function} props.handleSubmit - Function to handle form submission.
 * @param {boolean} props.loading - Flag indicating if the form is in a loading state.
 * @param {string} props.premiumType - The selected premium plan type.
 * @param {Function} props.setPremiumType - Function to set the selected premium plan type.
 * @param {number} props.monthlyCost - The cost of the monthly premium plan.
 * @param {number} props.annualCost - The cost of the annual premium plan.
 * @param {number} props.monthlyCostIfPaidAnnually - The monthly cost if paid annually.
 * @param {number} props.savingsPercentage - The percentage of savings for the annual plan.
 *
 * @returns {JSX.Element} The rendered payment form component.
 */

const PaymentFormPresentation = ({
  name,
  setName,
  country,
  setCountry,
  errors,
  stripeStyle,
  handleSubmit,
  loading,
  premiumType,
  setPremiumType,
  monthlyCost,
  annualCost,
  monthlyCostIfPaidAnnually,
  savingsPercentage
}) => {
 

  // if (loading) {
  //   return <LoadingScreenPayment />;
  // }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-foreground p-6 rounded-2xl shadow-lg max-w-lg mx-auto space-y-6 transition-all font-sans"
    >
      <h2 className="text-xl font-semibold text-text text-center">
        Payment Details
      </h2>

      <div className="bg-background rounded-xl p-4 mb-4">
        <h3 className="text-md font-medium text-text mb-3">Choose your plan</h3>

        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4 text-text">
          <div
            className={`flex-1 p-4 rounded-lg border-2 cursor-pointer transition-all ${
              premiumType === "monthlyPremium"
                ? "border-secondary bg-secondary bg-opacity-10"
                : "border-gray-400"
            }`}
            onClick={() => setPremiumType("monthlyPremium")}
          >
            <div className="flex justify-between items-start">
              <div>
                <div
                  className={`font-bold text-text ${
                    premiumType === "monthlyPremium"
                      ? "dark:text-text text-white"
                      : ""
                  }`}
                >
                  Monthly
                </div>
                <div
                  className={`text-sm text-gray-400 ${
                    premiumType === "monthlyPremium"
                      ? "dark:text-gray-500 text-white "
                      : ""
                  }`}
                >
                  Billed monthly
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`font-bold text-text ${
                    premiumType === "monthlyPremium"
                      ? "dark:text-text text-white"
                      : ""
                  }`}
                >
                  ${monthlyCost}
                </div>
                <div
                  className={`text-sm text-gray-400 ${
                    premiumType === "monthlyPremium"
                      ? "dark:text-gray-500 text-white "
                      : ""
                  }`}
                >
                  per month
                </div>
              </div>
            </div>
          </div>

          <div
            className={`flex-1 p-4 rounded-lg border-2 cursor-pointer transition-all ${
              premiumType === "oneTimePremium"
                ? "border-secondary bg-secondary bg-opacity-10"
                : "border-gray-400"
            }`}
            onClick={() => setPremiumType("oneTimePremium")}
          >
            <div className="flex justify-between items-start">
              <div>
                <div
                  className={`font-bold text-text ${
                    premiumType === "oneTimePremium"
                      ? "dark:text-text text-white"
                      : ""
                  }`}
                >
                  One time Payment
                </div>
                <div
                  className={`text-sm text-gray-400 ${
                    premiumType === "oneTimePremium"
                      ? "dark:text-gray-500 text-white"
                      : ""
                  }`}
                >
                  Billed Once
                </div>
              </div>
              <div className="text-right">
                <div
                   className={`font-bold text-text ${
                    premiumType === "oneTimePremium"
                      ? "dark:text-text text-white"
                      : ""
                  }`}
                >
                  ${monthlyCost}
                </div>
                {/* <div
                  className={`text-sm text-gray-400 ${
                    premiumType === "oneTimePremium"
                      ? "dark:text-gray-500 text-white"
                      : ""
                  }`}
                >
                  ${monthlyCostIfPaidAnnually.toFixed(2)}/mo
                </div> */}
              </div>
            </div>
            {/* {savingsPercentage > 0 && (
              <div className="mt-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium px-2 py-1 rounded inline-block">
                Save {savingsPercentage}%
              </div>
            )} */}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm font-medium text-text">
          Cardholder Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`w-full px-4 py-2 border ${
            errors.name ? "border-red-500" : "border-gray-600"
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary transition placeholder:text-[#a0a0a0]`}
          placeholder="John Doe"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-text">
          Credit Card Number
        </label>
        <div className="flex items-center border-gray-600 border rounded-lg px-3 py-2">
          <CreditCard className="text-gray-500 dark:text-gray-400 text-2xl" />
          <CardNumberElement
            className="w-full px-3 py-2 focus:outline-none bg-transparent"
            options={{ style: stripeStyle }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-text">
            Expiration Date
          </label>
          <div className="border-gray-600 border rounded-lg px-3 py-2">
            <CardExpiryElement
              className="w-full focus:outline-none bg-transparent"
              options={{ style: stripeStyle }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-text">CVC</label>
          <div className="border-gray-600 border rounded-lg px-3 py-2">
            <CardCvcElement
              className="w-full focus:outline-none bg-transparent"
              options={{ style: stripeStyle }}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="country" className="text-sm font-medium text-text">
          Country
        </label>
        <select
          id="country"
          name="country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className={`w-full px-4 py-2 border bg-foreground ${
            errors.country ? "border-red-500" : "border-gray-600"
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary transition`}
        >
          <option value="">Select Country</option>
          {countries.map(({ code, name }) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>
        {errors.country && (
          <p className="text-red-500 text-sm">{errors.country}</p>
        )}
      </div>

      <div className="pt-2">
        <button
          type="submit"
          className="w-full bg-secondary cursor-pointer text-white font-semibold py-3 rounded-lg shadow-md hover:bg-opacity-90 transition-all disabled:opacity-50 flex items-center justify-center"
          disabled={loading }
        >
          {loading  ? (
            <>
              <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              Processing...
            </>
          ) : (
            `Pay ${
              premiumType === "monthlyPremium"
                ? `$${monthlyCost}/month`
                : `$${monthlyCost}`
            }`
          )}
        </button>
      </div>

      <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
        Your payment is secure and encrypted
      </div>
    </form>
  );
};

export default PaymentFormPresentation;
