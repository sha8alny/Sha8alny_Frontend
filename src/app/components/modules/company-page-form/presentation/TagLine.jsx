"use client";
function TagLine({companyTagline, setCompanyTagline}){
    return (
      <div className="flex flex-col">
          <label className="mb-2"> 
            Tagline 
          </label>
          <textarea className="border px-[8px] py-[6px] rounded-[4px]" name="company-tagline" placeholder="ex:An information services firm helping small businesses succeed" maxLength={120} value={companyTagline || ""} onChange={(e)=> setCompanyTagline(e.target.value)} />
          <div className="flex justify-between text-gray-500 text-sm mt-1 gap-1">
            <span className="break-words"> Use your tagline to briefly describe what your organization does. This can be changed later </span>
            <span>{companyTagline?.length??0}/120</span>
          </div>
        </div>
    );

}

export default TagLine;