import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import CloseIcon from '@mui/icons-material/Close';

function FileUpload({onChange, preview, file, onRemove}){
    return(
        <div>
            <label className="mb-2">
              Logo 
            </label>
            {preview ? 
            (<div className="flex items-center w-full border border-[(var--foreground)] rounded-lg mt-2 gap-2">
                <img src={preview} alt="Preview" className="w-20 h-15 rounded-tl-lg rounded-bl-lg object-cover"/>
                <div className="flex flex-col text-white text-sm">
                    <span>{file.name}</span>
                </div>
                <button className="ml-auto mr-2 cursor-pointer" onClick={onRemove}><CloseIcon fontSize='small'/></button>
            </div>) :
            (<label htmlFor="upload-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-500 rounded-lg cursor-pointer bg-gray-800 hover:border-blue-400 transition duration-300 mt-2">
              <div>
                <p className="flex items-center gap-2"><FileUploadOutlinedIcon/> Choose file</p>
                <p>Upload to see preview</p>
              </div>
              <input id="upload-file" type="file" className="hidden" accept="image/png, image/jpg, image/jpeg" onChange={onChange}/>
            </label>)}
            <p className="text-gray-500 text-sm">300 x 300px recommended. JPGs, JPEGs, and PNGs supported.</p>
        </div>
    );
}

export default FileUpload;