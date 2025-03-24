import EmergencyRoundedIcon from '@mui/icons-material/EmergencyRounded';

function inputField({label, name , placeholder, required, selectedname,maxLength, onChange}) {
    return (
        <div className="flex flex-col">
            <label className="flex items-center mb-2">
                {label} {required && <EmergencyRoundedIcon style={{fontSize:"10px"}}/>}
            </label>
            <input className="border px-[8px] py-[6px] rounded-[4px]" type="text" name={name} placeholder={placeholder} maxLength={maxLength} value={selectedname} onChange={onChange}/>
        </div>
    )
}

export default inputField;