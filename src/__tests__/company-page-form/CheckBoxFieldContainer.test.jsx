import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CheckBoxFieldContainer from "../../app/components/modules/company-page-form/container/CheckBoxFieldContainer";


jest.mock("../../app/components/modules/company-page-form/presentation/CheckBoxField",()=>(props)=>(
    <input type="checkbox" id="company-terms" checked={props.checked} onChange={props.onChange}/>
));
describe("CheckBoxFieldContainer",()=>{
    test("renders the checkbox correctly", () => {
        render(<CheckBoxFieldContainer isChecked={false} onChange={() => {}} errors={{}} setErrors={false} />);
    
        const checkbox = screen.getByRole("checkbox");
        expect(checkbox).toBeInTheDocument();
        expect(checkbox).not.toBeChecked();
    });
    
    test("toggles checkbox state when clicked", () => {
        const handleChange = jest.fn();
        render(<CheckBoxFieldContainer isChecked={false} onChange={handleChange} errors={{}} setErrors={false} />);
    
        const checkbox = screen.getByRole("checkbox");
        fireEvent.click(checkbox);
    
        expect(handleChange).toHaveBeenCalledTimes(1);
    });
    
    test("displays error message when errors.terms is provided", () => {
        render(
          <CheckBoxFieldContainer
            isChecked={false}
            onChange={() => {}}
            errors={{ terms: "You must accept the terms" }}
            setErrors={true}
          />
        );
    
        expect(screen.getByText("You must accept the terms")).toBeInTheDocument();
    });
    
    test("does not display error message when setErrors is false", () => {
        render(
          <CheckBoxFieldContainer
            isChecked={false}
            onChange={() => {}}
            errors={{ terms: "You must accept the terms" }}
            setErrors={false}
          />
        );
    
        expect(screen.queryByText("You must accept the terms")).not.toBeInTheDocument();
    });
    

});
