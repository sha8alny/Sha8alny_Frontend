import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import TagLineContainer from "@/app/components/modules/company-page-form/container/TagLineContainer";

describe("TagLineContainer", () => {
    let mockSetCompanyTagline , mockSetCompanyDescription; 

    beforeEach(()=>{
        mockSetCompanyTagline = jest.fn();
        mockSetCompanyDescription = jest.fn();
    });
    test("renders TagLine component with initial tagline", () => {
      render(
        <TagLineContainer 
          companyTagline="Initial Tagline" 
          setCompanyTagline={mockSetCompanyTagline} 
          companyDescription=""
          setCompanyDescription={mockSetCompanyDescription}
          isEditing={false}
        />
      );
  
      const taglineInput = screen.getByDisplayValue("Initial Tagline");
      expect(taglineInput).toBeInTheDocument();
    });
  
    test("calls setCompanyTagline when tagline input changes", async () => {
      render(
        <TagLineContainer 
          companyTagline="" 
          setCompanyTagline={mockSetCompanyTagline} 
          companyDescription=""
          setCompanyDescription={mockSetCompanyDescription}
          isEditing={false}
        />
      );
  
      const taglineInput = screen.getByRole("textbox", { name: /tagline/i });
      await userEvent.type(taglineInput, "New Tagline");
      expect(mockSetCompanyTagline).toHaveBeenCalledTimes("New Tagline".length);
    });
  
    test("renders overview input when isEditing is true", () => {
      render(
        <TagLineContainer 
          companyTagline="Tagline" 
          setCompanyTagline={mockSetCompanyTagline} 
          companyDescription="Overview content"
          setCompanyDescription={mockSetCompanyDescription}
          isEditing={true}
        />
      );
  
      // Should render both tagline and overview inputs
      expect(screen.getByLabelText(/tagline/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/overview/i)).toBeInTheDocument();
    });
  
    test("calls setCompanyDescription when overview input changes", async () => {
      render(
        <TagLineContainer 
          companyTagline="" 
          setCompanyTagline={mockSetCompanyTagline} 
          companyDescription=""
          setCompanyDescription={mockSetCompanyDescription}
          isEditing={true}
        />
      );
  
      const overviewInput = screen.getByRole("textbox", { name: /overview/i });
      await userEvent.type(overviewInput, "Company Overview");
      expect(mockSetCompanyDescription).toHaveBeenCalledTimes("Company Overview".length);
    });
});