/**
 * @namespace layout
 * @module layout
 */
/**
 * A wrapper component that applies background color, text color, and rounded corners styling.
 *
 * @component
 * @param {object} props - Component properties
 * @param {string} [props.className] - Additional CSS class names to apply to the container
 * @param {React.ReactNode} props.children - The content to be rendered inside the container
 * @returns {JSX.Element} A styled div container with the provided children
 */
function Container({ className, testId,  children, onClick }) {
  return (
    <div
      data-testid={testId}
      onClick={onClick}
      className={`bg-foreground text-primary rounded-2xl ${className}`}
    >
      {children}
    </div>
  );
}
export default Container;
