import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import EditSelectFieldContainer from "@/app/components/modules/company-page-author/container/EditSelectFieldContainer";

describe("EditSelectFieldContainer",()=>{
    let setCompanySizeMock, setCompanyTypeMock;
    
    beforeEach(()=>{
        setCompanySizeMock = jest.fn();
        setCompanyTypeMock = jest.fn();
    });

    test("renders organization size and type dropdowns",()=>{
        render(
            <EditSelectFieldContainer 
            companySize=""
            setCompanySize={setCompanySizeMock}
            companyType=""
            setCompanyType={setCompanyTypeMock}
            />
        );
        expect(screen.getByLabelText(/Organization size/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Organization type/i)).toBeInTheDocument();
    });

    test("allows selecting an organization size", () => {
        render(
          <EditSelectFieldContainer
            companySize=""
            setCompanySize={setCompanySizeMock}
            companyType=""
            setCompanyType={setCompanyTypeMock}
          />
        );
    
        const selectSize = screen.getByLabelText(/Organization size/i);
        fireEvent.change(selectSize, { target: { value: "3-option" } });
    
        expect(setCompanySizeMock).toHaveBeenCalledWith("3-option");
    });
    
    test("allows selecting an organization type", () => {
        render(
          <EditSelectFieldContainer
            companySize=""
            setCompanySize={setCompanySizeMock}
            companyType=""
            setCompanyType={setCompanyTypeMock}
          />
        );
    
        const selectType = screen.getByLabelText(/Organization type/i);
        fireEvent.change(selectType, { target: { value: "2-option" } });
    
        expect(setCompanyTypeMock).toHaveBeenCalledWith("2-option");
    });
})