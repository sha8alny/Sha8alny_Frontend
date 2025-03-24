import EmergencyRoundedIcon from '@mui/icons-material/EmergencyRounded';
function SelectField({label, name, options, required, optionlabel, selectedvalue, onChange}) {
    return (
        <div className="flex flex-col mb-1">
            <label htmlFor={name} className="flex text-text items-center mb-2">
            {label} {required && <EmergencyRoundedIcon style={{fontSize:"10px"}}/>}
            </label>
            <select className="border text-text px-[8px] py-[6px] rounded-[4px]" id={name} name={name} value={selectedvalue} onChange={(e) => onChange(e.target.value)}>
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
export default SelectField;