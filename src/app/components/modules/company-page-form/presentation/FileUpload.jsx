/**
 * @namespace company-page-form
 * @module company-page-form
 */
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import CloseIcon from '@mui/icons-material/Close';

function FileUpload({onChange, preview, file, onRemove}){
    return(
        <div>
            <label className="text-text mb-2">
              Logo 
            </label>
            {preview ? 
            (<div className="text-text flex items-center w-full border border-[(var--foreground)] rounded-lg mt-2 gap-2">
                <img src={preview} alt="Preview" className="w-20 h-15 rounded-tl-lg rounded-bl-lg object-cover"/>
                <div className="flex flex-col text-[var(--text)] text-sm">
                    <span>{file.name}</span>
                </div>
                <button className="ml-auto mr-2 cursor-pointer" onClick={onRemove} aria-label="remove"
                role="button"><CloseIcon fontSize='small'/></button>
            </div>) :
            (<label htmlFor="upload-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-500 rounded-lg cursor-pointer bg-[var(--background)] hover:border-blue-400 transition duration-300 mt-2">
              <div>
                <p className="text-text flex items-center gap-2"><FileUploadOutlinedIcon/> Choose file</p>
                <p className="text-text">Upload to see preview</p>
              </div>
              <input id="upload-file" type="file" name="file" aria-label="file" className="hidden" accept="image/png, image/jpg, image/jpeg" onChange={onChange}/>
            </label>)}
            <p className="text-gray-500 text-sm">300 x 300px recommended. JPGs, JPEGs, and PNGs supported.</p>
        </div>
    );
}

export default FileUpload;