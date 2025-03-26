import EmergencyRoundedIcon from '@mui/icons-material/EmergencyRounded';

function InputField({label, name , placeholder, required, selectedname,maxLength, onChange}) {
    return (
        <div className="flex flex-col">
            <label htmlFor={name} className="flex text-text items-center mb-2">
                {label} {required && <EmergencyRoundedIcon style={{fontSize:"10px"}}/>}
            </label>
            <input className="border text-text px-[8px] py-[6px] rounded-[4px]" type="text" id={name} name={name} placeholder={placeholder} maxLength={maxLength} value={selectedname} onChange={onChange}/>
        </div>
    )
}

export default InputField;