/**
 * @namespace company-page-form
 * @module company-page-form
 */
function checkBoxField({onChange, checked}) {
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

export default checkBoxField;