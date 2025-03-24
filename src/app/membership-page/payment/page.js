'use client';
import PaymentFormContainer from "@/app/components/modules/membership/container/PaymentFormContainer";
import MembershipPageLayout from "@/app/components/modules/membership/presentation/MembershipPageLayout";

export default function PaymentPage() {
  return (
    <div>
      <MembershipPageLayout>
        <div className="p-6">
          <PaymentFormContainer/>
        </div>
      </MembershipPageLayout>
    </div>
  );
}
