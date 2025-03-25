
import { render, screen, fireEvent} from "@testing-library/react";
import "@testing-library/jest-dom";
import InputFieldContainer from "@/app/components/modules/company-page-form/container/InputFieldContainer";

jest.mock("@/app/components/modules/company-page-form/presentation/InputField", () => ({ label, name, onChange, selectedname }) => (
    <input aria-label={label} name={name} value={selectedname} onChange={onChange} />
));

describe("InputFieldContainer",()=>{
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
        <InputFieldContainer
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
  
    test('should call setCompanyName on name input change', () => {
      render(
        <InputFieldContainer
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
        <InputFieldContainer
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
  
    test('should validate URL input', async () => {
      render(
        <InputFieldContainer
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

    test('should check that Name input is not empty', async () => {
        render(
          <InputFieldContainer
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
          fireEvent.change(nameInput, { target: { value: "Siemens" } });
          fireEvent.change(nameInput, { target: { value: "" } });
          await new Promise((resolve) => setTimeout(resolve, 100));
          expect(setErrors).toHaveBeenCalled();
          const updateErrorsFunction = setErrors.mock.calls[0][0];
          expect(updateErrorsFunction({})).toEqual({
            companyName: expect.anything()
        });
    });

    test('should chech that industry input is not empty', async() => {
      render(
        <InputFieldContainer
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
  
        const industryInput = screen.getByLabelText("Industry");
        fireEvent.change(industryInput, { target: { value: "Tech" } });
        fireEvent.change(industryInput, { target: { value: "" } });
        await new Promise((resolve) => setTimeout(resolve, 100));
        expect(setErrors).toHaveBeenCalled();
        const updateErrorsFunction = setErrors.mock.calls[0][0];
        expect(updateErrorsFunction({})).toEqual({
            companyIndustry: expect.anything()
        });
    });
        
    test('should check that location input is not empty', async () => {
      render(
        <InputFieldContainer
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
  
        const locationInput = screen.getByLabelText("Location");
        fireEvent.change(locationInput, { target: { value: "Giza" } });
        fireEvent.change(locationInput, { target: { value: "" } });
        await new Promise((resolve) => setTimeout(resolve, 100));
        expect(setErrors).toHaveBeenCalled();
        const updateErrorsFunction = setErrors.mock.calls[0][0];
        expect(updateErrorsFunction({})).toEqual({
            companyLocation: expect.anything()
        });
    });
  
    test('should validate website input', () => {
      render(
        <InputFieldContainer
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

    test("clears website error for a valid website input", () => {
        render(
            <InputFieldContainer
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
            <InputFieldContainer
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

    test("check for name error for an empty name input", () => {
        render(
            <InputFieldContainer
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
                errors={{companyName: <span>Please enter the Company name</span>}}
                setErrors={setErrors}
            />
        );
        const nameInput = screen.getByLabelText("Name");
        fireEvent.change(nameInput, { target: { value: "" } });
    
        expect(screen.getByText(/Please enter the Company name/i)).toBeInTheDocument();
    });

    test("check for location error for an empty location input", () => {
        render(
            <InputFieldContainer
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
                errors={{companyName: <span>Please enter the Company Location</span>}}
                setErrors={setErrors}
            />
        );
        const locationInput = screen.getByLabelText("Location");
        fireEvent.change(locationInput, { target: { value: "" } });
    
        expect(screen.getByText(/Please enter the Company Location/i)).toBeInTheDocument();
    });

    test("check for industry error for an empty industry input", () => {
        render(
            <InputFieldContainer
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
                errors={{companyName: <span>Please enter the Company Industry</span>}}
                setErrors={setErrors}
            />
        );
        const industryInput = screen.getByLabelText("Industry");
        fireEvent.change(industryInput, { target: { value: "" } });
    
        expect(screen.getByText(/Please enter the Company Industry/i)).toBeInTheDocument();
    });
 
});