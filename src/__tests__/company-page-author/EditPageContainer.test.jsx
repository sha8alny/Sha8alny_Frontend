import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import EditPageContainer from "../../app/components/modules/company-page-author/container/EditPageContainer";
import { updateCompany } from "../../app/services/companyManagement";

jest.mock("../../app/services/companyManagement", () => ({
    updateCompany: jest.fn()
}));

jest.mock("next/navigation", () => ({
    useRouter: () => ({
      push: jest.fn(),
    }),
}));

describe("EditPageContainer",()=>{
    test("updates company name input and calls updateCompany on save", async () => {
        render(<EditPageContainer username="Company-Name" logoPreview="" />);

        const nameInput = screen.getByLabelText("Name");
        const saveButton = screen.getByText("Save");

        fireEvent.change(nameInput, { target: { value: "Siemens" } });
    
        expect(nameInput.value).toBe("Siemens");
    
        updateCompany.mockResolvedValue({ success: true });

        fireEvent.click(saveButton);

        await waitFor(() =>
          expect(updateCompany).toHaveBeenCalledWith("Company-Name", expect.any(Object))
        );

        await waitFor(() => {expect(updateCompany).toHaveBeenCalledWith( "Company-Name",expect.any(FormData));});
        
    });

    test("updates company industry input and calls updateCompany on save", async () => {
        render(<EditPageContainer username="Company-Name" logoPreview="" />);

        const industryInput = screen.getByLabelText("Industry");
        const saveButton = screen.getByText("Save");

        fireEvent.change(industryInput, { target: { value: "Technology" } });
    
        expect(industryInput.value).toBe("Technology");
    
        updateCompany.mockResolvedValue({ success: true });

        fireEvent.click(saveButton);

        await waitFor(() =>
          expect(updateCompany).toHaveBeenCalledWith("Company-Name", expect.any(Object))
        );

        await waitFor(() => {expect(updateCompany).toHaveBeenCalledWith( "Company-Name",expect.any(FormData));});
        
    });

    test("updates company location input and calls updateCompany on save", async () => {
        render(<EditPageContainer username="Company-Name" logoPreview="" />);

        const locationInput = screen.getByLabelText("Location");
        const saveButton = screen.getByText("Save");

        fireEvent.change(locationInput, { target: { value: "Cairo" } });
    
        expect(locationInput.value).toBe("Cairo");
    
        updateCompany.mockResolvedValue({ success: true });

        fireEvent.click(saveButton);

        await waitFor(() =>
          expect(updateCompany).toHaveBeenCalledWith("Company-Name", expect.any(Object))
        );

        await waitFor(() => {expect(updateCompany).toHaveBeenCalledWith( "Company-Name",expect.any(FormData));});        
    });

    test("updates organization size input and calls updateCompany on save", async () => {
        render(<EditPageContainer username="Company-Name" logoPreview="" />);

        const orgSizeInput = screen.getByLabelText(/Organization size/i);
        const saveButton = screen.getByText("Save");

        fireEvent.change(orgSizeInput, { target: { value: "2-10 employees" } });
    
        expect(orgSizeInput.value).toBe("2-10 employees");
    
        updateCompany.mockResolvedValue({ success: true });

        fireEvent.click(saveButton);

        await waitFor(() =>
          expect(updateCompany).toHaveBeenCalledWith("Company-Name", expect.any(Object))
        );

        await waitFor(() => {expect(updateCompany).toHaveBeenCalledWith( "Company-Name",expect.any(FormData));});
        
    });

    test("updates organization type input and calls updateCompany on save", async () => {
        render(<EditPageContainer username="Company-Name" logoPreview="" />);

        const orgTypeInput = screen.getByLabelText(/Organization type/i);
        const saveButton = screen.getByText("Save");

        fireEvent.change(orgTypeInput, { target: { value: "Public company" } });
    
        expect(orgTypeInput.value).toBe("Public company");
    
        updateCompany.mockResolvedValue({ success: true });

        fireEvent.click(saveButton);

        await waitFor(() =>
          expect(updateCompany).toHaveBeenCalledWith("Company-Name", expect.any(Object))
        );

        await waitFor(() => {expect(updateCompany).toHaveBeenCalledWith( "Company-Name",expect.any(FormData));});       
    });

    test("updates company url input and calls updateCompany on save", async () => {
        render(<EditPageContainer username="Company-Name" logoPreview="" />);

        const urlInput = screen.getByLabelText("shaغalny.com/company/");
        const saveButton = screen.getByText("Save");

        fireEvent.change(urlInput, { target: { value: "Siemens-09" } });
    
        expect(urlInput.value).toBe("Siemens-09");
    
        updateCompany.mockResolvedValue({ success: true });

        fireEvent.click(saveButton);

        await waitFor(() =>
          expect(updateCompany).toHaveBeenCalledWith("Company-Name", expect.any(Object))
        );

        await waitFor(() => {expect(updateCompany).toHaveBeenCalledWith( "Company-Name",expect.any(FormData));});
        
    });

    test("updates company founding date input and calls updateCompany on save", async () => {
      render(<EditPageContainer username="Company-Name" logoPreview="" />);

      const foundingDateInput = screen.getByLabelText("Founding Date");
      const saveButton = screen.getByText("Save");

      fireEvent.change(foundingDateInput, { target: { value: "2025-04-01" } });
  
      expect(foundingDateInput.value).toBe("2025-04-01");
  
      updateCompany.mockResolvedValue({ success: true });

      fireEvent.click(saveButton);

      await waitFor(() =>
        expect(updateCompany).toHaveBeenCalledWith("Company-Name", expect.any(Object))
      );
      
      await waitFor(() => {expect(updateCompany).toHaveBeenCalledWith( "Company-Name",expect.any(FormData));});
      
    });

    test("updates company phone number input and calls updateCompany on save", async () => {
      render(<EditPageContainer username="Company-Name" logoPreview="" />);

      const phoneNumberInput = screen.getByLabelText("Phone Number");
      const saveButton = screen.getByText("Save");

      fireEvent.change(phoneNumberInput, { target: { value: "12345678" } });

      expect(phoneNumberInput.value).toBe("12345678");

      updateCompany.mockResolvedValue({ success: true });

      fireEvent.click(saveButton);

      await waitFor(() =>
        expect(updateCompany).toHaveBeenCalledWith("Company-Name", expect.any(Object))
      );
      
      await waitFor(() => {expect(updateCompany).toHaveBeenCalledWith( "Company-Name",expect.any(FormData));});
        
    });

    test("resets input fields when discard button is clicked", () => {
        render(<EditPageContainer username="Company-Name" logoPreview="" />);

        const nameInput = screen.getByLabelText("Name");
        const discardButton = screen.getByText("Discard edits");
    
        fireEvent.change(nameInput, { target: { value: "Discard Test" } });
        expect(nameInput.value).toBe("Discard Test");

        fireEvent.click(discardButton);

        expect(nameInput.value).toBe("");
    });
});