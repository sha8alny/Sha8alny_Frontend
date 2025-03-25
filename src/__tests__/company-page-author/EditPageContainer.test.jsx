import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import EditPageContainer from "@/app/components/modules/company-page-author/container/EditPageContainer";
import { updateCompany } from "@/app/services/companyManagment";

jest.mock("@/app/services/companyManagment", () => ({
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

        expect(updateCompany).toHaveBeenCalledWith(
          "Company-Name",
          expect.objectContaining({
            name: "Siemens",
          })
        );
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

        expect(updateCompany).toHaveBeenCalledWith(
          "Company-Name",
          expect.objectContaining({
            industry: "Technology",
          })
        );
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

        expect(updateCompany).toHaveBeenCalledWith(
          "Company-Name",
          expect.objectContaining({
            location: "Cairo",
          })
        );
    });

    test("updates organization size input and calls updateCompany on save", async () => {
        render(<EditPageContainer username="Company-Name" logoPreview="" />);

        const orgSizeInput = screen.getByLabelText(/Organization size/i);
        const saveButton = screen.getByText("Save");

        fireEvent.change(orgSizeInput, { target: { value: "3-option" } });
    
        expect(orgSizeInput.value).toBe("3-option");
    
        updateCompany.mockResolvedValue({ success: true });

        fireEvent.click(saveButton);

        await waitFor(() =>
          expect(updateCompany).toHaveBeenCalledWith("Company-Name", expect.any(Object))
        );

        expect(updateCompany).toHaveBeenCalledWith(
          "Company-Name",
          expect.objectContaining({
            orgSize: "3-option",
          })
        );
    });

    test("updates organization type input and calls updateCompany on save", async () => {
        render(<EditPageContainer username="Company-Name" logoPreview="" />);

        const orgTypeInput = screen.getByLabelText(/Organization type/i);
        const saveButton = screen.getByText("Save");

        fireEvent.change(orgTypeInput, { target: { value: "2-option" } });
    
        expect(orgTypeInput.value).toBe("2-option");
    
        updateCompany.mockResolvedValue({ success: true });

        fireEvent.click(saveButton);

        await waitFor(() =>
          expect(updateCompany).toHaveBeenCalledWith("Company-Name", expect.any(Object))
        );

        expect(updateCompany).toHaveBeenCalledWith(
          "Company-Name",
          expect.objectContaining({
            orgType: "2-option",
          })
        );
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

        expect(updateCompany).toHaveBeenCalledWith(
          "Company-Name",
          expect.objectContaining({
            URL: "Siemens-09",
          })
        );
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