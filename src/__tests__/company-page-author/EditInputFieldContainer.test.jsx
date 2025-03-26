import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import EditInputFieldContainer from "@/app/components/modules/company-page-author/container/EditInputFieldContainer";

describe("EditInputFieldContainer",()=>{
    let setCompanyName, setCompanyIndustry, setCompanyLocation, setCompanyWebsite, setCompanyURL, setErrors;

    beforeEach(() => {
      setCompanyName = jest.fn();
      setCompanyIndustry = jest.fn();
      setCompanyLocation = jest.fn();
      setCompanyWebsite = jest.fn();
      setCompanyURL = jest.fn();
      setErrors = jest.fn();
    });
  
    test('should render all input fields', () => {
      render(
        <EditInputFieldContainer
          companyName=""
          setCompanyName={setCompanyName}
          companyIndustry=""
          setCompanyIndustry={setCompanyIndustry}
          companyLocation=""
          setCompanyLocation={setCompanyLocation}
          companyWebsite=""
          setCompanyWebsite={setCompanyWebsite}
          companyURL=""
          setCompanyURL={setCompanyURL}
          errors={{}}
          setErrors={setErrors}
        />
      );
      expect(screen.getByLabelText("Name")).toBeInTheDocument();
      expect(screen.getByLabelText("shaغalny.com/company/")).toBeInTheDocument();
      expect(screen.getByLabelText("Website")).toBeInTheDocument();
      expect(screen.getByLabelText("Location")).toBeInTheDocument();
      expect(screen.getByLabelText("Industry")).toBeInTheDocument();
    });
  
    test("should call setCompanyName on name input change", () => {
      render(
        <EditInputFieldContainer
          companyName=""
          setCompanyName={setCompanyName}
          companyIndustry=""
          setCompanyIndustry={setCompanyIndustry}
          companyLocation=""
          setCompanyLocation={setCompanyLocation}
          companyWebsite=""
          setCompanyWebsite={setCompanyWebsite}
          companyURL=""
          setCompanyURL={setCompanyURL}
          errors={{}}
          setErrors={setErrors}
        />
      );
  
      const nameInput = screen.getByLabelText("Name");
      fireEvent.change(nameInput, { target: { value: "Test Company" } });
  
      expect(setCompanyName).toHaveBeenCalledWith("Test Company");
    });
  
    test('should validate company name input', () => {
      render(
        <EditInputFieldContainer
          companyName=""
          setCompanyName={setCompanyName}
          companyIndustry=""
          setCompanyIndustry={setCompanyIndustry}
          companyLocation=""
          setCompanyLocation={setCompanyLocation}
          companyWebsite=""
          setCompanyWebsite={setCompanyWebsite}
          companyURL=""
          setCompanyURL={setCompanyURL}
          errors={{}}
          setErrors={setErrors}
        />
      );
  
      const nameInput = screen.getByLabelText("Name");
      fireEvent.change(nameInput, { target: { value: "123" } });
      expect(setErrors).toHaveBeenCalledWith(
        expect.any(Function)
      );
      const updateErrorsFunction = setErrors.mock.calls[0][0];
      expect(updateErrorsFunction({})).toEqual({
        companyName: "Only letters are allowed."
      });
    });
  
    test('should validate URL input', () => {
      render(
        <EditInputFieldContainer
          companyName=""
          setCompanyName={setCompanyName}
          companyIndustry=""
          setCompanyIndustry={setCompanyIndustry}
          companyLocation=""
          setCompanyLocation={setCompanyLocation}
          companyWebsite=""
          setCompanyWebsite={setCompanyWebsite}
          companyURL=""
          setCompanyURL={setCompanyURL}
          errors={{}}
          setErrors={setErrors}
        />
      );
  
      const urlInput = screen.getByLabelText("shaغalny.com/company/");
      fireEvent.change(urlInput, { target: { value: "invalid_url@" } });
      expect(setErrors).toHaveBeenCalledWith(
        expect.any(Function)
      );
      const updateErrorsFunction = setErrors.mock.calls[0][0];
      expect(updateErrorsFunction({})).toEqual({
        companyURL: "Only letters, numbers and hyphens are allowed."
      });
    });

    test('should validate website input', () => {
      render(
        <EditInputFieldContainer
          companyName=""
          setCompanyName={setCompanyName}
          companyIndustry=""
          setCompanyIndustry={setCompanyIndustry}
          companyLocation=""
          setCompanyLocation={setCompanyLocation}
          companyWebsite=""
          setCompanyWebsite={setCompanyWebsite}
          companyURL=""
          setCompanyURL={setCompanyURL}
          errors={{}}
          setErrors={setErrors}
        />
      );
  
      const websiteInput = screen.getByLabelText("Website");
      fireEvent.change(websiteInput, { target: { value: "invalidwebsite" } });
      expect(setErrors).toHaveBeenCalledWith(
        expect.any(Function)
      );
      const updateErrorsFunction = setErrors.mock.calls[0][0];
      expect(updateErrorsFunction({})).toEqual({
        companyWebsite: "Please enter a valid website" 
      });
    });

    test("should call setCompanyIndustry on industry input change",()=>{
        render(
            <EditInputFieldContainer
              companyName=""
              setCompanyName={setCompanyName}
              companyIndustry=""
              setCompanyIndustry={setCompanyIndustry}
              companyLocation=""
              setCompanyLocation={setCompanyLocation}
              companyWebsite=""
              setCompanyWebsite={setCompanyWebsite}
              companyURL=""
              setCompanyURL={setCompanyURL}
              errors={{}}
              setErrors={setErrors}
            />
        );
        const insudtryInput= screen.getByLabelText("Industry");
        fireEvent.change(insudtryInput, { target: { value: "Information Service" } });
  
        expect(setCompanyIndustry).toHaveBeenCalledWith("Information Service");
    });

    test("should call setCompanyLocation on location input change",()=>{
        render(
            <EditInputFieldContainer
              companyName=""
              setCompanyName={setCompanyName}
              companyIndustry=""
              setCompanyIndustry={setCompanyIndustry}
              companyLocation=""
              setCompanyLocation={setCompanyLocation}
              companyWebsite=""
              setCompanyWebsite={setCompanyWebsite}
              companyURL=""
              setCompanyURL={setCompanyURL}
              errors={{}}
              setErrors={setErrors}
            />
        );
        const locationInput= screen.getByLabelText("Location");
        fireEvent.change(locationInput, { target: { value: "Cairo" } });

        expect(setCompanyLocation).toHaveBeenCalledWith("Cairo");
    });

    test("clears website error for a valid website input", () => {
        render(
            <EditInputFieldContainer
                companyName=""
                setCompanyName={setCompanyName}
                companyIndustry=""
                setCompanyIndustry={setCompanyIndustry}
                companyLocation=""
                setCompanyLocation={setCompanyLocation}
                companyWebsite=""
                setCompanyWebsite={setCompanyWebsite}
                companyURL=""
                setCompanyURL={setCompanyURL}
                errors={{}}
                setErrors={setErrors}
            />
        );
        const websiteInput = screen.getByLabelText("Website");
        fireEvent.change(websiteInput, { target: { value: "http://example.com" } });
    
        expect(setErrors).toHaveBeenCalledWith(expect.any(Function));
        const updateErrorsFunction = setErrors.mock.calls[0][0];
    
        expect(updateErrorsFunction({})).toEqual({ companyWebsite: "",});
    });

    test("clears url error for a valid url input", () => {
        render(
            <EditInputFieldContainer
                companyName=""
                setCompanyName={setCompanyName}
                companyIndustry=""
                setCompanyIndustry={setCompanyIndustry}
                companyLocation=""
                setCompanyLocation={setCompanyLocation}
                companyWebsite=""
                setCompanyWebsite={setCompanyWebsite}
                companyURL=""
                setCompanyURL={setCompanyURL}
                errors={{}}
                setErrors={setErrors}
            />
        );
        const urlInput = screen.getByLabelText("shaغalny.com/company/");
        fireEvent.change(urlInput, { target: { value: "Siemens-09" } });
    
        expect(setErrors).toHaveBeenCalledWith(expect.any(Function));
        const updateErrorsFunction = setErrors.mock.calls[0][0];
    
        expect(updateErrorsFunction({})).toEqual({ companyURL: "",});
    });
});