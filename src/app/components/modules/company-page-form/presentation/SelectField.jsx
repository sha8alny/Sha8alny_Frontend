import EmergencyRoundedIcon from '@mui/icons-material/EmergencyRounded';

/**
 * @namespace SelectField
 */

/**
 * A reusable select field component that renders a dropdown list with options, a label, and a required indicator.
 * It supports a custom `onChange` handler for when the selected value changes.
 * @component
 * @param {Object} props - The component's props.
 * @param {string} props.label - The label text to display for the select field.
 * @param {string} props.name - The name attribute for the select field, used for form submission.
 * @param {Array} props.options - The options to display in the dropdown, each being an object with `value` and `label`.
 * @param {boolean} props.required - If true, a required indicator (emergency icon) will be shown next to the label.
 * @param {string} props.optionlabel - The label used for the placeholder option in the dropdown (e.g., "option").
 * @param {string} props.selectedvalue - The current selected value of the dropdown.
 * @param {function} props.onChange - The function to handle changes to the selected option.
 *
 * @returns {JSX.Element} The rendered select field component.
 */

export default function SelectField({label, name, options, required, optionlabel, selectedvalue, onChange}) {
    return (
        <div className="flex flex-col mb-1">
            <label htmlFor={name} className="flex text-text items-center mb-2" data-testid={`${name}-label`}>
            {label} {required && <EmergencyRoundedIcon style={{fontSize:"10px"}}/>}
            </label>
            <select className="border text-text px-[8px] py-[6px] rounded-[4px]" id={name} name={name} value={selectedvalue} onChange={onChange} data-testid={`${name}-select`}>
              <option className="text-black" value="">Select {optionlabel}</option>
              {options.map((option) => (
                  <option className="text-black" key={option.value} value={option.value}>
                  {option.label}
                </option>
                ))}
            </select>
        </div>
    )
}