
/**
 * RadioBtn component renders a custom styled radio button with a label.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.label - The label text for the radio button.
 * @param {string} props.name - The name attribute for the radio button input.
 * @param {string} props.value - The value attribute for the radio button input.
 * @param {boolean} props.checked - The checked state of the radio button.
 * @param {function} props.onChange - The function to call when the radio button state changes.
 *
 * @returns {JSX.Element} The rendered RadioBtn component.
 */
const RadioBtn = ({ label, name, value, checked, onChange }) => {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="hidden"
      />

      <div
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300
            ${
              checked
                ? "border-secondary scale-110"
                : "border-gray-400 scale-100"
            }`}
      >
        <div
          className={`w-3 h-3 bg-secondary rounded-full transition-all duration-300
              ${checked ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
        />
      </div>

      <span className="text-sm text-text transition-colors duration-300">
        {label}
      </span>
    </label>
  );
};

export default RadioBtn;
