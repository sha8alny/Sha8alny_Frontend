import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import SideBarContainer from "../../app/components/modules/company-page-author/container/SideBarContainer";
import { deleteCompany, updateCompany, deleteCompanyMedia } from "../../app/services/companyManagement";
import { useRouter } from "next/navigation";


jest.mock("../../app/services/companyManagement", () => ({
    deleteCompany: jest.fn(),
    updateCompany: jest.fn(),
    deleteCompanyMedia: jest.fn(),
}));

jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: jest.fn(),
        prefetch: jest.fn(),
        replace: jest.fn(),
        refresh: jest.fn(),
    }),
    usePathname: () => "/company/testcompany/admin/dashboard",
}));

jest.mock("../../app/components/modules/company-page-author/presentation/SideBar", () => ({ menuItems }) => (
    <nav>
        {menuItems.map((item) => (
            <button key={item.name} onClick={item.action} data-testid={item.name}>
                {item.name}
            </button>
        ))}
    </nav>
));

describe("SideBarContainer", () => {
    const mockProps = {
        username: "testcompany",
        company: { logo: "testlogo.png", cover: "testcover.png" },
        setCompany: jest.fn(),
        setLogo: jest.fn(),
    };

    test("renders sidebar menu items", () => {
        render(<SideBarContainer {...mockProps} />);
        expect(screen.getByTestId("Dashboard")).toBeInTheDocument();
        expect(screen.getByTestId("Page Posts")).toBeInTheDocument();
        expect(screen.getByTestId("Deactivate Page")).toBeInTheDocument();
    });

    test("opens modal when 'Deactivate Page' is clicked", () => {
        render(<SideBarContainer {...mockProps} />);
        fireEvent.click(screen.getByTestId("Deactivate Page"));
        expect(screen.getByTestId("deactivate-modal")).toBeInTheDocument();
        expect(screen.getByText("We're sorry to see you go")).toBeInTheDocument();
    });

    test("closes modal when 'Cancel' button is clicked", async () => {
        render(<SideBarContainer {...mockProps} />);
        fireEvent.click(screen.getByTestId("Deactivate Page"));

        const cancelButton = screen.getByRole("button", { name: /Cancel/i });
        fireEvent.click(cancelButton);

        await waitFor(() => expect(screen.queryByTestId("deactivate-modal")).not.toBeInTheDocument());
    });

    test("calls deleteCompany when 'Deactivate' is clicked", async () => {
        deleteCompany.mockResolvedValueOnce();
        render(<SideBarContainer {...mockProps} />);
        fireEvent.click(screen.getByTestId("Deactivate Page"));
        const deactivateButton = screen.getByRole("button", { name: /Deactivate/i });
        fireEvent.click(deactivateButton);

        await waitFor(() => expect(deleteCompany).toHaveBeenCalledWith(mockProps.username));
    });
});
