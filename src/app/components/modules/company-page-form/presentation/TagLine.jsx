/**
 * @namespace TagLine
 */
/**
 * A reusable component for rendering a tagline input field with a `textarea` element.
 * This component includes a label, character count, and a helper text if it's the first tagline.
 * @component
 * @param {Object} props - The component's props.
 * @param {string} props.label - The label text to display for the tagline field.
 * @param {number} props.maxLength - The maximum length of characters allowed in the tagline.
 * @param {string} props.id - The id attribute for the tagline field, used for linking the label.
 * @param {string} props.name - The name attribute for the tagline field, used for form submission.
 * @param {string} props.placeholder - The placeholder text to display when the field is empty.
 * @param {string} props.value - The current value of the tagline input.
 * @param {function} props.onChange - The function to handle changes to the tagline input value.
 * @param {boolean} props.isFirstTagline - If true, displays a helper text for the first tagline input.
 *
 * @returns {JSX.Element} The rendered tagline input field with associated elements.
 */

export default function TagLine({label, maxLength, id, name, placeholder, value, onChange, isFirstTagline}) {
    return (
      <div className="flex flex-col">
          <label htmlFor={name} className="mb-2 text-text" data-testid={`${name}-label`}> 
            {label} 
          </label>
          <textarea className="text-text border px-[8px] py-[6px] rounded-[4px] resize-none " id={id} name={name} placeholder={placeholder} maxLength={maxLength} value={value || ""} onChange={(e)=> onChange(e.target.value)} data-testid={`${name}-textarea`}/>
          <div className="flex justify-between text-gray-500 text-sm mt-1 gap-1">
            {isFirstTagline && <span className="break-words"> Use your tagline to briefly describe what your organization does. This can be changed later </span>}
            <span>{value?.length??0}/{maxLength}</span>
          </div>
        </div>
    );

}