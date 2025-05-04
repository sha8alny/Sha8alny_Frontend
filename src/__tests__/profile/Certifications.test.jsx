import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CertificationsContainer from "@/app/components/modules/profile/container/CertificationsContainer";
import Certifications from "@/app/components/modules/profile/presentation/Certifications";
import { useIsMyProfile } from "@/app/context/IsMyProfileContext";

// Mock the dependencies
jest.mock(
  "../../app/components/modules/profile/presentation/Certifications",
  () => {
    return jest.fn((props) => (
      <div data-testid="certifications-component">
        <button
          data-testid="toggle-button"
          onClick={props.toggleAllCertificates}
        >
          Toggle
        </button>
        <div data-testid="certifications-prop">
          {JSON.stringify(props.certifications)}
        </div>
        <div data-testid="allCertificates-prop">
          {String(props.allCertificates)}
        </div>
        <div data-testid="isMyProfile-prop">{String(props.isMyProfile)}</div>
      </div>
    ));
  }
);

jest.mock("../../app/context/IsMyProfileContext", () => ({
  useIsMyProfile: jest.fn(),
}));

describe("CertificationsContainer", () => {
  const mockCertifications = [
    { id: "1", name: "Certification 1", issuer: "Issuer 1" },
    { id: "2", name: "Certification 2", issuer: "Issuer 2" },
  ];

  beforeEach(() => {
    Certifications.mockClear();
    useIsMyProfile.mockClear();
  });

  it("renders the Certifications component", () => {
    useIsMyProfile.mockReturnValue({ isMyProfile: true });
    render(<CertificationsContainer certifications={mockCertifications} />);

    expect(screen.getByTestId("certifications-component")).toBeInTheDocument();
  });

  it("passes isMyProfile from context to the Certifications component", () => {
    useIsMyProfile.mockReturnValue({ isMyProfile: false });
    render(<CertificationsContainer certifications={mockCertifications} />);

    expect(Certifications).toHaveBeenCalledWith(
      {
        certifications: mockCertifications,
        allCertificates: false,
        toggleAllCertificates: expect.any(Function),
        isMyProfile: false,
      },
      undefined
    );
    expect(screen.getByTestId("isMyProfile-prop").textContent).toBe("false");
  });

  it("toggles allCertificates state when toggleAllCertificates is called", () => {
    useIsMyProfile.mockReturnValue({ isMyProfile: true });
    render(<CertificationsContainer certifications={mockCertifications} />);

    // Initial state
    expect(screen.getByTestId("allCertificates-prop").textContent).toBe(
      "false"
    );

    // Toggle state
    fireEvent.click(screen.getByTestId("toggle-button"));
    expect(screen.getByTestId("allCertificates-prop").textContent).toBe("true");

    // Toggle again
    fireEvent.click(screen.getByTestId("toggle-button"));
    expect(screen.getByTestId("allCertificates-prop").textContent).toBe(
      "false"
    );
  });

  it("handles empty certifications array", () => {
    useIsMyProfile.mockReturnValue({ isMyProfile: true });
    render(<CertificationsContainer certifications={[]} />);

    expect(Certifications).toHaveBeenCalledWith(
      {
        certifications: [],
        allCertificates: false,
        toggleAllCertificates: expect.any(Function),
        isMyProfile: true,
      },
      undefined
    );
    expect(screen.getByTestId("certifications-prop").textContent).toBe("[]");
  });

  it("handles undefined certifications prop", () => {
    useIsMyProfile.mockReturnValue({ isMyProfile: true });
    render(<CertificationsContainer />);

    expect(Certifications).toHaveBeenCalledWith(
      {
        certifications: undefined,
        allCertificates: false,
        toggleAllCertificates: expect.any(Function),
        isMyProfile: true,
      },
      undefined
    );
    expect(screen.getByTestId("certifications-prop").textContent).toBe("");
  });
});
