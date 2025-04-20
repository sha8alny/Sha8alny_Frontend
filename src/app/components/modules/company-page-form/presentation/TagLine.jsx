/**
 * @namespace company-page-form
 * @module company-page-form
 */
function TagLine({label, maxLength, id, name, placeholder, value, onChange, isFirstTagline}) {
    return (
      <div className="flex flex-col">
          <label htmlFor={name} className="mb-2 text-text" data-testid={`${name}-label`}> 
            {label} 
          </label>
          <textarea className="text-text border px-[8px] py-[6px] rounded-[4px]" id={id} name={name} placeholder={placeholder} maxLength={maxLength} value={value || ""} onChange={(e)=> onChange(e.target.value)} data-testid={`${name}-textarea`}/>
          <div className="flex justify-between text-gray-500 text-sm mt-1 gap-1">
            {isFirstTagline && <span className="break-words"> Use your tagline to briefly describe what your organization does. This can be changed later </span>}
            <span>{value?.length??0}/{maxLength}</span>
          </div>
        </div>
    );

}

export default TagLine;