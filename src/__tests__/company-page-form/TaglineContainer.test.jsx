import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import TagLineContainer from "@/app/components/modules/company-page-form/container/TagLineContainer";

describe("TaglineContainer", ()=>{
    test("renders TagLine component with initial props", () => {
        const mockSetCompanyTagline = jest.fn(); 
        render(<TagLineContainer companyTagline="Initial Tagline" setCompanyTagline={mockSetCompanyTagline} />);
        const inputElement = screen.getByDisplayValue("Initial Tagline");
        expect(inputElement).toBeInTheDocument();
    });
    test("calls setCompanyTagline when input value changes", async () => {
        const mockSetCompanyTagline = jest.fn();
        render(<TagLineContainer companyTagline="" setCompanyTagline={mockSetCompanyTagline} />);
        const inputElement = screen.getByRole("textbox");
        await userEvent.type(inputElement, "New Tagline");
        expect(mockSetCompanyTagline).toHaveBeenCalledTimes("New Tagline".length);
    });
});
