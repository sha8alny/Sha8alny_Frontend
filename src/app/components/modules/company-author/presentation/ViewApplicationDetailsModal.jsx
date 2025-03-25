"use client";
import Dialog from '@mui/material/Dialog';
import { Close, CloudUpload } from '@mui/icons-material';
import { TextField,Button,Typography } from '@mui/material';
/**
 * ViewApplicationDetailsModal component
 * 
 * This component renders a modal dialog to display the details of a job application.
 * It shows the applicant's name, email, phone number, cover letter, and a link to download the resume/CV.
 * 
 * @component
 * @param {Object} props - The properties object.
 * @param {Object} props.application - The application details to display.
 * @param {boolean} props.isLoading - The loading state indicating if the application details are being fetched.
 * @param {Function} props.onClose - The function to call when the modal is closed.
 * @param {boolean} props.open - The state indicating if the modal is open.
 * 
 * @example
 * return (
 *   <ViewApplicationDetailsModal
 *     application={application}
 *     isLoading={isLoading}
 *     onClose={handleClose}
 *     open={isOpen}
 *   />
 * )
 */
const ViewApplicationDetailsModal = ({application,isLoading, onClose, open}) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            slotProps={{
                backdrop:
                {style: {backgroundColor: 'rgba(0, 0, 0, 0.35)'}}}}
        >
            <div className='w-full max-w-lg rounded-lg bg-foreground shadow-lg relative p-4'>
                <div className="items-center p-2">
                <Typography variant="h5" className='text-text' component="h2" gutterBottom>Application for {application.jobTitle}</Typography>
                </div>
            <hr className="p-4 space-y-4"/>
            {isLoading ?(
                    <p className="text-secondary text-2xl font-bold">Loading...</p>
                ) : (<div>
                 <div className='flex flex-col gap-4'>   
                <div className="flex flex-col md:flex-row gap-4">
                        <TextField 
                            sx={{
                            "& label": { color: "var(--text)" }, 
                            "& .MuiOutlinedInput-root": {
                            color: "var(--text)", 
                            "& fieldset": { borderColor: "var(--text)" }, 
                            },
                            "& .MuiFormHelperText-root": { color: "var(--text)" }, 
                        }}
                            required
                            fullWidth
                            id="outlined-read-only-input"
                            label="Full Name"
                            defaultValue={application.fullName}
                            slotProps={{
                                input: {readOnly: true},
                            }}/>
                        <TextField 
                                sx={{
                                "& label": { color: "var(--text)" }, 
                                "& .MuiOutlinedInput-root": {
                                color: "var(--text)", 
                                "& fieldset": { borderColor: "var(--text)" }, 
                                },
                                "& .MuiFormHelperText-root": { color: "var(--text)" }, 
                            }}
                            required
                            fullWidth
                            id="outlined-read-only-input"
                            label="Email Address"
                            defaultValue={application.emailAddress}
                            slotProps={{
                                input: {readOnly: true},
                            }}/>
                </div>
                <TextField 
                    sx={{
                    "& label": { color: "var(--text)" }, 
                    "& .MuiOutlinedInput-root": {
                      color: "var(--text)", 
                      "& fieldset": { borderColor: "var(--text)" }, 
                    },
                    "& .MuiFormHelperText-root": { color: "var(--text)" }, 
                  }}
                    required
                    fullWidth
                    id="outlined-read-only-input"
                    label="Phone Number"
                    defaultValue={application.phoneNumber}
                    slotProps={{
                        input: {readOnly: true},
                    }}/>
                <TextField 
                    sx={{
                    "& label": { color: "var(--text)" }, 
                    "& .MuiOutlinedInput-root": {
                      color: "var(--text)", 
                      "& fieldset": { borderColor: "var(--text)" }, 
                    },
                    "& .MuiFormHelperText-root": { color: "var(--text)" }, 
                  }}
                    id="outlined-read-only-input"
                    label="Cover Letter"
                    defaultValue={application.coverLetter}
                    multiline
                    rows={5} />
                <div>
                    <Typography variant='subtittle1'className='text-text' gutterBottom>Resume/CV</Typography>
                    <div className='mt-2 mb-2'>
                    <label htmlFor="resmue-upload">
                        <input
                          disabled
                          type="file"
                            id="resume-upload"
                            className="hidden"
                        />
                        <Button
                          variant="outlined"
                            component="span"
                            startIcon={<CloudUpload />}
                        >
                            Upload Resume
                        </Button>
                        </label>
                        </div>

                        {(application.resumeFile)?.name ? (
                            <p className="text-secondary text-xl font-semibold">
                               Selected: {application.resumeFile.name}
                            </p>
                        ):(<p className="text-secondary text-lg font-semibold">
                            No file selected 
                            </p>)
                        }
                        </div>
                        {application.resumeUrl && (
                            <div>
                                    <a className="text-xl text-secondary font-semibold underline"
                                     href={application.resumeUrl}
                                     download={application.resumeFile?.name||"resume"}
                                     >
                                     📄 Download Resume
                                     </a>
                            </div>)}
                  </div>
                  </div>
            )}
              
                <Close onClick={onClose} className="absolute top-2 right-2 text-secondary cursor-pointer"></Close>
            </div>
        </Dialog>
    );
};

export default ViewApplicationDetailsModal;