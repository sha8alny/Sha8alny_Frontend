import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MembershipStatus from '../../app/components/modules/membership/presentation/MembershipStatus';


describe("MembershipStatus Component", () => {
  const mockLimits = {
    monthlyConnectionRequests: 10,
    dailyMessageRequests: 5,
    dailyJobApplications: 3,
  };

  const mockFreePlanDetails = {
    features: {
      createProfile: true,
      maxConnections: 50,
      jobApplications: 100,
      dailyMessages: 20,
    },
  };

it("renders correctly for a premium plan", () => {
    render(
        <MembershipStatus
            plan="premium"
            limits={mockLimits}
            renewalDate="2023-12-31"
            isMissed={false}

        />
    );

    expect(screen.getByText("Your current plan:")).toBeInTheDocument();
    expect(screen.getAllByText("Unlimited").length).toBeGreaterThan(2);
    expect(screen.getByText("Plan ends on: 2023-12-31")).toBeInTheDocument();
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
    expect(screen.getByText("Basic"))
   

    expect(screen.getByText(/\s*10\s*\//i)).toBeInTheDocument();
    expect(screen.getByText(/\s*5\s*\//i)).toBeInTheDocument();
    expect(screen.getByText(/\s*3\s*\//i)).toBeInTheDocument();

   
  });

  it("renders correctly for an expired premium plan", () => {
    render(
      <MembershipStatus
        plan="free"
        limits={mockLimits}
        renewalDate="2023-12-31"
        isMissed={true}
        freePlanDetails={mockFreePlanDetails}

      />
    );

    expect(screen.getByText("Your current plan:")).toBeInTheDocument();
    expect(screen.getByText(/Premium (Expired)/i))
    
    expect(screen.getByText(/\s*10\s*\//i)).toBeInTheDocument();
    expect(screen.getByText(/\s*5\s*\//i)).toBeInTheDocument();
    expect(screen.getByText(/\s*3\s*\//i)).toBeInTheDocument();
    expect(screen.getByText("Premium Expired on: 2023-12-31")).toBeInTheDocument();
  });

  it("displays correct limits for a basic plan", () => {
    render(
      <MembershipStatus
        plan="basic"
        limits={mockLimits}
        renewalDate="2023-12-31"
        isMissed={false}
        freePlanDetails={mockFreePlanDetails}

      />
    );

    expect(screen.getByText(/\s*10\s*\//i)).toBeInTheDocument();
    expect(screen.getByText(/\s*5\s*\//i)).toBeInTheDocument();
    expect(screen.getByText(/\s*3\s*\//i)).toBeInTheDocument();
    expect(screen.getByText(/50/i)).toBeInTheDocument();
    expect(screen.getByText(/100/i)).toBeInTheDocument();
    expect(screen.getByText(/20/i)).toBeInTheDocument();
 
  });
});