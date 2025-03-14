/**
 * Button component renders a styled button with provided content.
 * @param {Object} props - The component props.
 * @param {string} props.content - The content to be displayed inside the button.
 * @param {Function} props.handler - The function to call when the button is clicked.
 * @param {boolean} props.disabled - Whether the button is disabled.
 * @returns {JSX.Element} The rendered component.
 */
const Button = ({ content, handler, disabled }) => {
  return (
    <button
      onClick={handler}
      disabled={disabled}
      className={`w-max p-2 rounded-full border-2 transition-all 
        ${
          disabled
            ? "bg-gray-300 border-gray-400 text-gray-500 cursor-not-allowed"
            : "bg-transparent border-secondary text-secondary hover:bg-secondary hover:text-background cursor-pointer"
        }`}
    >
      {content}
    </button>
  );
};

export default Button;
