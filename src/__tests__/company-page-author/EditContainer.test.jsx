import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import EditContainer from "../../app/components/modules/company-page-author/container/EditContainer";

jest.mock("../../app/components/modules/company-page-author/container/SideBarContainer", () => () => 
    <div data-testid="sidebar-container" />);
jest.mock("../../app/components/modules/company-page-author/container/EditPageContainer", () => () => 
    <div data-testid="edit-page-container" />);
jest.mock("../../app/components/modules/company-page-author/presentation/Analytics", () => () => 
    <div data-testid="analytics" />);


describe("EditContainer",()=>{
    beforeEach(()=>{
        global.URL.createObjectURL = jest.fn(() => "mocked-url");
    });

    test("renders components correctly", () => {
        render(<EditContainer username="Siemens" logo="https://example.com/logo.png" />);
        
        expect(screen.getByTestId("edit-page-container")).toBeInTheDocument();

    });

    test("uses provided logo as initial state", () => {
        render(<EditContainer username="Siemens" logo="https://example.com/logo.png" />);
        
        expect(screen.getByTestId("edit-page-container")).toBeInTheDocument();
    });

});