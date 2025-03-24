import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
function checkBoxField({onChange, checked, showerror}) {
  return (
    <div>
        <div className="flex items-start gap-2">
            <input className="w-5 h-5 accent-blue-500" type="checkbox" id="company-terms"  checked={checked} onChange={onChange} />
            <label htmlFor="company-terms">I verify that I am an authorized representative of this organization and have the right to act on its behalf in the creation and management of this page. The organization and I agree to the additional terms for Pages.</label>
            <br/>
        </div>
        {showerror && (<p className="flex items-center gap-2 text-red-500 text-sm"><RemoveCircleOutlineIcon className="w-4 h-4"/>Please select the terms and conditions.</p>)}
    </div>
  );
}

export default checkBoxField;