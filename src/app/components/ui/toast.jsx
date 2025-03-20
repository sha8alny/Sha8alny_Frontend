import { useEffect, useState } from "react";
/**
 * Toast component to display a temporary notification message.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {string} props.message - The message to display in the toast.
 * @param {function} props.onClose - Callback function to call when the toast closes.
 * @param {boolean} props.success - Determines the background color of the toast (green for success, red for error).
 * @returns {JSX.Element} The rendered Toast component.
 */

const Toast = ({ message, onClose, success }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-white font-semibold transition-all duration-300
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"}
        ${success ? "bg-green-500" : "bg-red-500"}`}
    >
      {message}
    </div>
  );
};

export default Toast;