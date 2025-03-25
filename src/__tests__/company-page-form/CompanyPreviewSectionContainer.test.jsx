import { render, screen , act } from "@testing-library/react";
import "@testing-library/jest-dom";
import CompanyPreviewSectionContainer from "@/app/components/modules/company-page-form/container/CompanyPreviewSectionContainer";


jest.mock("@/app/components/modules/company-page-form/presentation/CompanyPreviewSection",() => (props) => (
    <div data-testid="company-preview">
      <p>{props.companyName}</p>
      <p>{props.companyTagline}</p>
      <p>{props.companyIndustry}</p>
      {props.preview && <img src={props.preview} alt="Company Logo" />}
    </div>
  )
);

describe("CompanyPreviewSectionContainer", () => {
    beforeEach(()=>{
        global.URL.createObjectURL = jest.fn(() => "mocked-url");
        global.URL.revokeObjectURL = jest.fn();
    });
    test("renders correctly with given props", () => {
        render(
        <CompanyPreviewSectionContainer
            companyName="Test Company"
            companyTagline="We build software"
            companyIndustry="Tech"
            file={null}
        />
        );

        expect(screen.getByText("Test Company")).toBeInTheDocument();
        expect(screen.getByText("We build software")).toBeInTheDocument();
        expect(screen.getByText("Tech")).toBeInTheDocument();
    });

  test("generates a preview URL when a file is provided", async () => {
    const mockFile = new File(["logo"], "logo.png", { type: "image/png" });

    await act(async () => {
      render(
        <CompanyPreviewSectionContainer
          companyName="Test Company"
          companyTagline="We build software"
          companyIndustry="Tech"
          file={mockFile}
        />
      );
    });

    const previewImage = screen.getByRole("img", { name: "Company Logo" });
    expect(previewImage).toBeInTheDocument();
    expect(previewImage.src).toContain("http://localhost/mocked-url");
  });

  test("removes preview when file is null", async () => {
    await act(async () => {
      render(
        <CompanyPreviewSectionContainer
          companyName="Test Company"
          companyTagline="We build software"
          companyIndustry="Tech"
          file={null}
        />
      );
    });

    const previewImage = screen.queryByRole("img", { name: "Company Logo" });
    expect(previewImage).not.toBeInTheDocument();
  });
});