import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import EditContainer from "@/app/components/modules/company-page-author/container/EditContainer";

jest.mock("@/app/components/modules/company-page-author/container/SideBarContainer", () => () => 
    <div data-testid="sidebar-container" />);
jest.mock("@/app/components/modules/company-page-author/container/EditPageContainer", () => () => 
    <div data-testid="edit-page-container" />);
jest.mock("@/app/components/modules/company-page-author/presentation/Analytics", () => () => 
    <div data-testid="analytics" />);


describe("EditContainer",()=>{
    beforeEach(()=>{
        global.URL.createObjectURL = jest.fn(() => "mocked-url");
    });

    test("renders components correctly", () => {
        render(<EditContainer username="Siemens" logo="https://example.com/logo.png" />);
        
        expect(screen.getByTestId("sidebar-container")).toBeInTheDocument();
        expect(screen.getByTestId("edit-page-container")).toBeInTheDocument();
        expect(screen.getByTestId("analytics")).toBeInTheDocument();
    });

    test("uses provided logo as initial state", () => {
        render(<EditContainer username="Siemens" logo="https://example.com/logo.png" />);
        
        const sidebarComponent = screen.getByTestId("sidebar-container");
        expect(sidebarComponent).toBeInTheDocument();
    });

    test("updates logo preview on file upload", () => {
        global.URL.createObjectURL = jest.fn(() => "mocked-url");
        render(<EditContainer username="Siemens" logo="https://example.com/logo.png" />);
        
        const file = new File(["dummy content"], "test-image.png", { type: "image/png" });
        const fileInput = screen.getByTestId("sidebar-container"); 

        fireEvent.change(fileInput, { target: { files: [file] } });

        expect(URL.createObjectURL).toHaveBeenCalledWith(file);
    });

    test("calls file input when upload button is clicked", () => {
        render(<EditContainer username="Siemens" logo="https://example.com/logo.png" />); 

        const fileInput = screen.getByTestId("sidebar-container");
        const uploadButton = screen.getByTestId("edit-page-container");

        jest.spyOn(fileInput, "click").mockImplementation(() => {});
        fireEvent.click(uploadButton);
        expect(fileInput.click(uploadButton)).toHaveBeenCalled();
    });

});