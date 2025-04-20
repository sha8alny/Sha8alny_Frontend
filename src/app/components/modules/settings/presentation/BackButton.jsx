import { ArrowBack } from "@mui/icons-material";
/**
 * @namespace settings
 * @module settings
 */
/**
 * BackButton component renders a button that triggers a handler function when clicked.
 * @param {Object} props - The component props.
 * @param {function} props.handler - Function to handle the button click event.
 * @returns {JSX.Element} The rendered component.
 */

const BackButton = ({ handler }) => {
  return (
    <button
      onClick={handler}
      data-testid = "backButton-settings"
      className="flex flex-row gap-2 text-gray-500 text-sm items-center cursor-pointer"
    >
      <ArrowBack className="text-text" />
      Back
    </button>
  );
};

export default BackButton;
