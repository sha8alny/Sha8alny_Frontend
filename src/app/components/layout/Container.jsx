
/**
 * A wrapper component that applies background color, text color, and rounded corners styling.
 *
 * @component
 * @param {object} props - Component properties
 * @param {string} [props.className] - Additional CSS class names to apply to the container
 * @param {React.ReactNode} props.children - The content to be rendered inside the container
 * @returns {JSX.Element} A styled div container with the provided children
 */
export default function Container({ className, children }) {
  return (
    <div className={`bg-background text-primary rounded-2xl ${className}`}>
      {children}
    </div>
  );
}
