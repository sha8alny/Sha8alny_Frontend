import EmergencyRoundedIcon from '@mui/icons-material/EmergencyRounded';

/**
 * @namespace InputField
 */

/**
 * A reusable input field component that renders an input field with a label, a required indicator, 
 * and a custom `onChange` handler. It supports different input types, max length, and placeholder text.
 * @component
 * @param {Object} props - The component's props.
 * @param {string} props.label - The label text to display for the input field.
 * @param {string} props.name - The name attribute for the input field, used for form submission.
 * @param {string} props.type - The type of input (e.g., "text", "password", "email").
 * @param {string} props.placeholder - Placeholder text displayed when the input is empty.
 * @param {boolean} props.required - If true, a required indicator (emergency icon) will be shown next to the label.
 * @param {string} props.selectedname - The current value of the input field.
 * @param {number} props.maxLength - The maximum number of characters allowed in the input field.
 * @param {function} props.onChange - The function to handle changes to the input field value.
 *
 * @returns {JSX.Element} The rendered input field component.
 */

export default function InputField({label, name , type, placeholder, required, selectedname,maxLength, onChange}) {
    return (
        <div className="flex flex-col">
            <label htmlFor={name} className="flex text-text items-center mb-2" data-testid={`${name}-label`}>
                {label} {required && <EmergencyRoundedIcon style={{fontSize:"10px"}} data-testid="EmergencyRoundedIcon" />}
            </label>
            <input className="border text-text px-[8px] py-[6px] rounded-[4px]" type={type} id={name} name={name} placeholder={placeholder} required={required} maxLength={maxLength} value={selectedname} onChange={onChange}
            data-testid={`${name}-input`}/>
        </div>
    )
}