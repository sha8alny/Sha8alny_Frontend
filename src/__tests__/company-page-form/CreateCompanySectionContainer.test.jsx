import { render, screen , fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import CreateCompanySectionContainer from "../../app/components/modules/company-page-form/container/CreateCompanySectionContainer";
import { createCompany } from "../../app/services/companyManagement";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));

jest.mock("../../app/services/companyManagement", () => ({
    createCompany: jest.fn(),
}));

describe("CreateCompanySectionContainer",()=>{
    let mockRouter;
    let setcompanyName, setcompanyIndustry, setcompanyTagline, setFile;

    beforeEach(() => {
        jest.clearAllMocks();
        createCompany.mockClear();

        setcompanyName = jest.fn();
        setcompanyIndustry = jest.fn();
        setcompanyTagline = jest.fn();
        setFile = jest.fn();
    });

    test("renders correctly", () => {
        render(
            <CreateCompanySectionContainer
                companyName=""
                setcompanyName={setcompanyName}
                companyIndustry=""
                setcompanyIndustry={setcompanyIndustry}
                companyTagline=""
                setcompanyTagline={setcompanyTagline}
                file={null}
                setFile={setFile}
            />
        );

      expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Industry/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Tagline/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Organization Size/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Organization Type/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Location/i)).toBeInTheDocument();   
      expect(screen.getByLabelText(/Website/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Founding Date/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/shaغalny/i)).toBeInTheDocument();
    });

    test("updates input fields correctly", () => {
        render(
            <CreateCompanySectionContainer
                companyName=""
                setcompanyName={setcompanyName}
                companyIndustry=""
                setcompanyIndustry={setcompanyIndustry}
                companyTagline=""
                setcompanyTagline={setcompanyTagline}
                file={null}
                setFile={setFile}
            />
        );

        const nameInput = screen.getByLabelText(/Name/i);
        fireEvent.change(nameInput, { target: { value: "Tech Corp" } });
        expect(setcompanyName).toHaveBeenCalledWith("Tech Corp");

        const industryInput = screen.getByLabelText(/Industry/i);
        fireEvent.change(industryInput, { target: { value: "Software" } });
        expect(setcompanyIndustry).toHaveBeenCalledWith("Software");

        const taglineInput = screen.getByLabelText(/Tagline/i);
        fireEvent.change(taglineInput, { target: { value: "Innovate the Future" } });
        expect(setcompanyTagline).toHaveBeenCalledWith("Innovate the Future");
    });

    test("should show validation errors when the form is submitted with missing fields", async () => {
        render(
          <CreateCompanySectionContainer 
            companyName=""
            setcompanyName={setcompanyName}
            companyIndustry=""
            setcompanyIndustry={setcompanyIndustry}
            companyTagline=""
            setcompanyTagline={setcompanyTagline}
            file={null}
            setFile={setFile}
          />
        );
    
        const submitButton = screen.getByText(/Create Page/i);
        fireEvent.click(submitButton);
    
        await waitFor(() => {
          expect(screen.findByText(/Company name is required/i)).resolves.toBeInTheDocument();
          expect(screen.findByText(/Industry is required/i)).resolves.toBeInTheDocument();
          expect(screen.findByText(/Company size is required/i)).resolves.toBeInTheDocument();
          expect(screen.findByText(/Company type is required/i)).resolves.toBeInTheDocument();
          expect(screen.findByText(/Location is required/i)).resolves.toBeInTheDocument();
          expect(screen.findByText(/URL is required/i)).resolves.toBeInTheDocument();
          expect(screen.findByText(/Founding Date is required/i)).resolves.toBeInTheDocument();
          expect(screen.findByText(/You must agree to the terms./i)).resolves.toBeInTheDocument();
        });
    });

    // test("submits form when valid", async () => {
    //     createCompany.mockResolvedValueOnce({ success: true });
    
    //     render(<CreateCompanySectionContainer
    //         companyName=""
    //         setcompanyName={setcompanyName}
    //         companyIndustry=""
    //         setcompanyIndustry={setcompanyIndustry}
    //         companyTagline=""
    //         setcompanyTagline={setcompanyTagline}
    //         file={null}
    //         setFile={setFile} />);
    
    //     fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: "Tech Corp" } });
    //     fireEvent.change(screen.getByLabelText(/Industry/i), { target: { value: "Software" } });
    //     fireEvent.change(screen.getByLabelText(/Organization Size/i), { target: { value: "100-500" } });
    //     fireEvent.change(screen.getByLabelText(/Organization Type/i), { target: { value: "Private" } });
    //     fireEvent.change(screen.getByLabelText(/Location/i), { target: { value: "San Francisco" } });
    //     fireEvent.change(screen.getByLabelText(/Website/i), { target: { value: "https://techcorp.com" } });
    //     fireEvent.change(screen.getByLabelText(/shaغalny/i), { target: { value: "techcorp" } });
    //     fireEvent.change(screen.getByLabelText(/Founding Date/i), { target: { value: "2020-01-01" } });
    //     fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: "1234567890" } });
    
    //     const checkbox = screen.getByRole("checkbox", { name: /I verify that I am an authorized representative/i });
    //     fireEvent.click(checkbox);
    //     expect(checkbox.checked).toBe(true);
    
    //     const submitButton = screen.getByText(/Create Page/i);
    //     fireEvent.click(submitButton);
    
    //     await waitFor(() => {
    //       expect(createCompany).toHaveBeenCalledTimes(1);
    //       expect(mockPush).toHaveBeenCalledWith("/company/techcorp/admin/dashboard");
    //     });
    // });

    test("should show error message if company creation fails", async () => {
        createCompany.mockRejectedValueOnce(new Error("Failed to create company"));
    
        render(
          <CreateCompanySectionContainer 
            companyName="Test Company"
            setcompanyName={setcompanyName}
            companyIndustry="Tech"
            setcompanyIndustry={setcompanyIndustry}
            companyTagline="We are a tech company"
            setcompanyTagline={setcompanyTagline}
            file={null}
            setFile={setFile}
          />
        );
    
        const submitButton = screen.getByText(/Create Page/i);
        fireEvent.click(submitButton);
    
        await waitFor(() => {
          expect(screen.findByText(/Failed to create company/i)).resolves.toBeInTheDocument();
        });
    });

    test("handles checkbox correctly", () => {
        render(
            <CreateCompanySectionContainer
                companyName="Test Corp"
                setcompanyName={setcompanyName}
                companyIndustry="Tech"
                setcompanyIndustry={setcompanyIndustry}
                companyTagline="Leading Innovation"
                setcompanyTagline={setcompanyTagline}
                file={null}
                setFile={setFile}
            />
        );

        const checkbox = screen.getByRole("checkbox", { name: /I verify that I am an authorized representative/i });
        expect(checkbox.checked).toBe(false);
        fireEvent.click(checkbox);
        expect(checkbox.checked).toBe(true);
    });
    
});