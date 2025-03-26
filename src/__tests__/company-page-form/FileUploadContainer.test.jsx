import { render, screen , fireEvent, waitFor} from "@testing-library/react";
import "@testing-library/jest-dom";
import FileUploadContainer from "../../app/components/modules/company-page-form/container/FileUploadContainer";


jest.mock("../../app/components/modules/company-page-form/presentation/FileUpload", () => 
    function MockFileUpload(props) {
      return (
        <div>
          <input type="file" data-testid="file-input" onChange={props.onChange} />
          {props.file && <p>{props.file.name}</p>}
          {props.preview && <img src={props.preview} alt="preview" />}
          {props.file && <button onClick={props.onRemove}>Remove</button>}
        </div>
      );
    }
);
  
describe("FileUploadContainer", () => {
    beforeEach(() => {
        global.URL.createObjectURL = jest.fn(() => "mocked-url");
    });
    test("uploads a file and updates state", () => {
        const setFileMock = jest.fn();
        render(<FileUploadContainer file={null} setFile={setFileMock} />);

        const fileInput = screen.getByTestId("file-input");
        const testFile = new File(["test content"], "testFile.png", { type: "image/png" });

        fireEvent.change(fileInput, { target: { files: [testFile] } });

        expect(setFileMock).toHaveBeenCalledWith(testFile);
    });

    test("removes the file when remove button is clicked", () => {
        const setFileMock = jest.fn();
        render(<FileUploadContainer file={"testFile.png"} setFile={setFileMock} />);

        const removeButton = screen.getByRole("button", { name: /remove/i });
        fireEvent.click(removeButton);

        expect(setFileMock).toHaveBeenCalledWith(null);
    });
});