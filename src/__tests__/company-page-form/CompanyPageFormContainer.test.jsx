import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CompanyPageFormContainer from "@/app/components/modules/company-page-form/container/CompanyPageFormContainer";

jest.mock("@/app/components/modules/company-page-form/container/CreateCompanySectionContainer", () => (props) => (
<div data-testid="create-company-section">
    <input
    data-testid="company-name-input"
    value={props.companyName}
    onChange={(e) => props.setcompanyName(e.target.value)}
    />
    <input
    data-testid="company-industry-input"
    value={props.companyIndustry}
    onChange={(e) => props.setcompanyIndustry(e.target.value)}
    />
    <input
    data-testid="company-tagline-input"
    value={props.companyTagline}
    onChange={(e) => props.setcompanyTagline(e.target.value)}
    />
    <input
    type="file"
    data-testid="file-upload"
    onChange={(e) => props.setFile(e.target.files[0])}
    />
</div>
));

jest.mock("@/app/components/modules/company-page-form/container/CompanyPreviewSectionContainer", () => (props) => (
<div data-testid="company-preview">
    <p>{props.companyName}</p>
    <p>{props.companyIndustry}</p>
    <p>{props.companyTagline}</p>
    {props.file && <span data-testid="file-preview">{props.file.name}</span>}
</div>
));
describe("CompanyPageFormContainer",()=>{
    test("renders correctly", () => {
        render(<CompanyPageFormContainer />);
        
        expect(screen.getByTestId("create-company-section")).toBeInTheDocument();
        expect(screen.getByTestId("company-preview")).toBeInTheDocument();
    });
    
    test("updates preview when company details change", () => {
        render(<CompanyPageFormContainer />);
    
        const nameInput = screen.getByTestId("company-name-input");
        const industryInput = screen.getByTestId("company-industry-input");
        const taglineInput = screen.getByTestId("company-tagline-input");
    
        fireEvent.change(nameInput, { target: { value: "Siemens" } });
        fireEvent.change(industryInput, { target: { value: "Technology" } });
        fireEvent.change(taglineInput, { target: { value: "Innovate the Future" } });
    
        expect(screen.getByText("Siemens")).toBeInTheDocument();
        expect(screen.getByText("Technology")).toBeInTheDocument();
        expect(screen.getByText("Innovate the Future")).toBeInTheDocument();
    });
    
    test("updates preview when a file is uploaded", () => {
        render(<CompanyPageFormContainer />);
        const fileInput = screen.getByTestId("file-upload");
        const mockFile = new File(["logo"], "logo.png", { type: "image/png" });
        fireEvent.change(fileInput, { target: { files: [mockFile] } });
        expect(screen.getByTestId("file-preview")).toHaveTextContent("logo.png");
    });
});