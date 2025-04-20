"use client";

import { CreditCard } from "@mui/icons-material";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  PaymentElement,
} from "@stripe/react-stripe-js";
import countries from "../../../../../../public/data/countries";
import { Input } from "@/app/components/ui/Input";
import { Label } from "@/app/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/Select";
import { Button } from "@/app/components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/Card";
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
  oneTimeCost,
  monthlyCostIfPaidAnnually,
  savingsPercentage,
  textColor,
  monthlyCurrency,
  oneTimeCurrency,
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <h1 className="flex items-center justify-center font-bold text-3xl mb-4 w-full">
        <span className="text-primary font-sans">SHA</span>
        <span className="text-secondary">غ</span>
        <span className="text-primary font-sans">LNY </span>
        <span className="text-secondary ml-2"> Premium</span>
      </h1>

      <Card className="w-full max-w-lg mx-auto bg-background font-sans">
        <CardHeader>
          <CardTitle className="text-center">Payment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label>Choose your plan</Label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <div
                  data-testid="monthly-premium-plan"
                  className={`flex-1 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    premiumType === "monthlyPremium"
                      ? "border-primary bg-primary/10"
                      : "border-muted"
                  }`}
                  onClick={() => setPremiumType("monthlyPremium")}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold">Monthly</div>
                      <div className="text-sm text-muted-foreground">
                        Billed monthly
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{monthlyCurrency == "USD"? "$" : monthlyCurrency}{monthlyCost}</div>
                      <div className="text-sm text-muted-foreground">
                        per month
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  datatype="onetime-premium-plan"
                  className={`flex-1 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    premiumType === "oneTimePremium"
                      ? "border-primary bg-primary/10"
                      : "border-muted"
                  }`}
                  onClick={() => setPremiumType("oneTimePremium")}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold">One time Payment</div>
                      <div className="text-sm text-muted-foreground">
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
                        {oneTimeCurrency == "USD"? "$" : oneTimeCurrency}{oneTimeCost}
                      </div>
                      <div
                        className={`text-sm text-gray-400 ${
                          premiumType === "oneTimePremium"
                            ? "dark:text-gray-500 text-white"
                            : ""
                        }`}
                      >
                        ${monthlyCostIfPaidAnnually.toFixed(2)}/mo
                      </div>
                    </div>
                  </div>
          
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Cardholder Name</Label>
              <Input
                id="name"
                value={name}
                data-testid="cardholder-name-input"
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Credit Card Number</Label>
              <div className="">
                <div className="border-1 border-solid border-text w-full bg-input/30 flex items-center rounded-lg px-1 py-[0.16rem] ">
                  <CreditCard className="text-muted-foreground text-2xl" />
                  <CardNumberElement
                    data-testid="card-number-element"
                    className="w-full px-3 py-2 focus:outline-none bg-transparent"
                    options={{ style: stripeStyle }}
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Expiration Date</Label>
                <div className="p-2 border-1 border-solid border-text w-full bg-input/30 flex items-center rounded-lg ">
                  <CardExpiryElement
                    data-testid="card-expiry-element"
                    className="w-full focus:outline-none bg-transparent"
                    options={{ style: stripeStyle }}
                  />
                </div>
              </div>

              <div className="space-y-2 ">
                <Label>CVC</Label>
                <div className="p-2 border-1 border-solid border-text w-full bg-input/30 flex items-center rounded-lg  text-text">
                  <CardCvcElement
                    data-testid="card-cvc-element"
                    className="w-full focus:outline-none bg-transparent"
                    options={{ style: stripeStyle }}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 w-full">
              <Label htmlFor="country">Country</Label>
              <Select
                value={country}
                data-testid="country-select"
                onValueChange={setCountry}
                className="w-full"
              >
                <SelectTrigger
                  className={
                    errors.country ? "border-destructive w-full" : "w-full"
                  }
                >
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map(({ code, name }) => (
                    <SelectItem key={code} value={code}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.country && (
                <p className="text-sm text-destructive">{errors.country}</p>
              )}
            </div>

            <Button
              type="submit"
              data-testid="payment-submit-button"
              className="w-full bg-secondary cursor-pointer hover:bg-secondary/80 text-white"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="inline-block h-4 w-4 border-2  border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  Processing...
                </>
              ) : (
                `Pay ${
                  premiumType === "monthlyPremium"
                    ? `$${monthlyCost}/month`
                    : `$${oneTimeCost}`
                }`
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Your payment is secure and encrypted
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentFormPresentation;
