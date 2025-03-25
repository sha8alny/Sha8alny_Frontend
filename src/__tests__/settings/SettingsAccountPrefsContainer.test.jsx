import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import SettingsAccountPrefsContainer from "../../app/components/modules/settings/container/SettingsAccountPrefsContainer";
import DarkModeForm from "../../app/components/modules/settings/presentation/DarkModeForm";
import DeleteAccountContainer from "../../app/components/modules/settings/container/DeleteAccountContainer";
import ChangeUsernameContainer from "../../app/components/modules/settings/container/ChangeUsernameContainer";
import SettingsAccountPrefsPresentation from "../../app/components/modules/settings/presentation/SettingsAccountPrefsPresentation";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock("../../app/context/ThemeContext", () => ({
  useTheme: () => ({ theme: "light" }),
}));
jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
  }));
jest.mock(
  "../../app/components/modules/settings/presentation/DarkModeForm",
  () => jest.fn(() => <div>DarkModeForm</div>)
);
jest.mock(
  "../../app/components/modules/settings/container/DeleteAccountContainer",
  () => jest.fn(() => <div>DeleteAccountContainer</div>)
);
jest.mock(
  "../../app/components/modules/settings/container/ChangeUsernameContainer",
  () => jest.fn(() => <div>ChangeUsernameContainer</div>)
);

describe("SettingsAccountPrefsContainer", () => {

    let useThemeMock, useRouterMock;

    beforeEach(() => {
  
  
      useRouterMock = useRouter.mockReturnValue({
        push: jest.fn(),
      });
    });

    afterEach(() => {
        jest.clearAllMocks();
      });
    
  test("renders DarkModeForm when activeForm is 'darkMode'", () => {
    render(<SettingsAccountPrefsContainer />);
    fireEvent.click(screen.getByText("Dark mode"));
    expect(screen.getByText("DarkModeForm")).toBeInTheDocument();
  });

  test("renders DeleteAccountContainer when activeForm is 'deleteAccount'", () => {
    render(<SettingsAccountPrefsContainer />);
    fireEvent.click(screen.getByText("Delete Account"));
    expect(screen.getByText("DeleteAccountContainer")).toBeInTheDocument();
  });

  test("renders ChangeUsernameContainer when activeForm is 'changeUsername'", () => {
    render(<SettingsAccountPrefsContainer />);
    fireEvent.click(screen.getByText("Change username"));
    expect(screen.getByText("ChangeUsernameContainer")).toBeInTheDocument();
  });

  test("navigates to /membership-page when Current plan is clicked", () => {
    const pushMock = jest.fn();
    useRouter.mockReturnValue({
      push: pushMock,
    });
  
    render(<SettingsAccountPrefsContainer />);
  
    const currentPlanButton = screen.getByText(/Current plan/i);
    fireEvent.click(currentPlanButton);
  
    expect(pushMock).toHaveBeenCalledWith("/membership-page");
  });
});
