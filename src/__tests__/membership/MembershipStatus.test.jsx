import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import MembershipStatus from "../../app/components/modules/membership/presentation/MembershipStatus";

describe("MembershipStatus Component", () => {
  const mockLimits = {
    monthlyConnectionRequests: 50,
    dailyMessageRequests: 100,
    dailyJobApplications: 20,
  };

  const mockFreePlanDetails = {
    features: {
      createProfile: true,
      max_connections: 50,
      job_applications: 100,
      daily_messages: 20,
    },
  };

  it("renders correctly for a premium plan", () => {
    render(
      <MembershipStatus
        plan="monthlyPremium"
        limits={mockLimits}
        renewalDate="2023-12-31"
        isMissed={false}
        freePlanDetails={mockFreePlanDetails}
      />
    );

    expect(screen.getByText("Your current plan:")).toBeInTheDocument();
    expect(screen.getAllByText(/Unlimited/i).length).toBeGreaterThan(0);
  });

  it("renders correctly for a basic plan", () => {
    render(
      <MembershipStatus
        plan="basic"
        limits={mockLimits}
        renewalDate="2023-12-31"
        isMissed={false}
        freePlanDetails={mockFreePlanDetails}
      />
    );

    expect(screen.getByText("Your current plan:")).toBeInTheDocument();
    expect(screen.getByText("Basic")).toBeInTheDocument();
  });

  it("displays correct limits for a basic plan", () => {
    render(
      <MembershipStatus
        plan="basic"
        renewalDate="2023-12-31"
        isMissed={false}
        freePlanDetails={mockFreePlanDetails}
        limits={{
          monthlyConnectionRequests: 10,
          dailyMessageRequests: 5,
          dailyJobApplications: 3,
        }}
      />
    );

    expect(screen.getByText("50", { exact: false })).toBeInTheDocument();
    expect(screen.getByText("100", { exact: false })).toBeInTheDocument();
    expect(screen.getByText("20", { exact: false })).toBeInTheDocument();
  });
});
