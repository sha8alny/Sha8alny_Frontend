import { render, screen , fireEvent} from "@testing-library/react";
import "@testing-library/jest-dom";
import SelectFieldContainer from "@/app/components/modules/company-page-form/container/SelectFieldContainer";

describe("SelectFieldContainer", ()=>{
    let setCompanySizeMock, setCompanyTypeMock;
    
    beforeEach(()=>{
        setCompanySizeMock = jest.fn();
        setCompanyTypeMock = jest.fn();
        setErrorsMock = jest.fn();
    });
    test("renders organization size and type dropdowns", () => {
        render(
          <SelectFieldContainer
            companySize=""
            setCompanySize={setCompanySizeMock}
            companyType=""
            setCompanyType={setCompanyTypeMock}
            setErrors={setErrorsMock}
            errors={{}}
          />
        );
        expect(screen.getByLabelText(/Organization size/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Organization type/i)).toBeInTheDocument();
    });
    test("allows selecting an organization size", () => {
        render(
          <SelectFieldContainer
            companySize=""
            setCompanySize={setCompanySizeMock}
            companyType=""
            setCompanyType={setCompanyTypeMock}
            setErrors={setErrorsMock}
            errors={{}}
          />
        );
    
        const selectSize = screen.getByLabelText(/Organization size/i);
        fireEvent.change(selectSize, { target: { value: "2-10 employees" } });
    
        expect(setCompanySizeMock).toHaveBeenCalledWith("2-10 employees");
    });
    
    test("allows selecting an organization type", () => {
        render(
          <SelectFieldContainer
            companySize=""
            setCompanySize={setCompanySizeMock}
            companyType=""
            setCompanyType={setCompanyTypeMock}
            setErrors={setErrorsMock}
            errors={{}}
          />
        );
    
        const selectType = screen.getByLabelText(/Organization type/i);
        fireEvent.change(selectType, { target: { value: "Public company" } });
    
        expect(setCompanyTypeMock).toHaveBeenCalledWith("Public company");
    });
    
    test("displays error messages when provided", () => {
        render(
          <SelectFieldContainer
            companySize=""
            setCompanySize={setCompanySizeMock}
            companyType=""
            setCompanyType={setCompanyTypeMock}
            setErrors={setErrorsMock}
            errors={{
              companySize: "Size is required",
              companyType: "Type is required",
            }}
          />
        );
        expect(screen.getByText(/Size is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Type is required/i)).toBeInTheDocument();
    });
});