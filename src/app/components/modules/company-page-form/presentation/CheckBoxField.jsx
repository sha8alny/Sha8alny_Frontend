/**
 * @namespace FormComponents
 */

/**
 * A checkbox input component used for verifying if the user is an authorized representative of the organization.
 * It contains a checkbox with a label and handles the checked state via the `checked` prop. 
 * The `onChange` function is triggered when the user interacts with the checkbox.
 * @component
 * @param {Object} props - The component's props.
 * @param {boolean} props.checked - The checked state of the checkbox.
 * @param {function} props.onChange - The function to handle the change event when the checkbox is toggled.
 * 
 * @returns {JSX.Element} The rendered checkbox input field with a label.
 */
export default function checkBoxField({onChange, checked}) {
  return (
    <div>
        <div className="flex text-text items-start gap-2">
            <input className="w-5 h-5 accent-blue-500" type="checkbox" id="company-terms" checked={checked} onChange={onChange} data-testid="company-checkbox-input" />
            <label htmlFor="company-terms" data-testid="company-checkbox-label">I verify that I am an authorized representative of this organization and have the right to act on its behalf in the creation and management of this page. The organization and I agree to the additional terms for Pages.</label>
            <br/>
        </div>
    </div>
  );
}
