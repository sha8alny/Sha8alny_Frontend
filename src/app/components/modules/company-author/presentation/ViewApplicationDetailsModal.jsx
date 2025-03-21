"use client";
import Dialog from '@mui/material/Dialog';
import { Close } from '@mui/icons-material';

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
            <div className='border-3 border-secondary p-8'>
                <h2  className="text-2xl text-secondary font-bold mb-6">
                    Application Details
                </h2>
            <hr className="border-secondary mb-2"/>
            {isLoading ?(
                    <p className="text-secondary text-2xl font-bold">Loading...</p>
                ) : (<div>
                <p className="text-secondary text-xl font-semibold">Name: <span className="text-xl text-text font-semibold">{application.fullName}</span></p>
                <p className="text-secondary text-xl font-semibold">Email:<span className="text-xl text-text font-semibold">{application.emailAddress}</span></p>
                <p className="text-secondary text-xl font-semibold"> Phone:<span className="text-xl text-text font-semibold">{application.phoneNumber}</span></p>
                <p className="text-secondary text-xl font-semibold">Cover Letter: <span className="text-xl text-text font-semibold">{application.coverLetter}</span></p>
                <p className="text-secondary text-xl font-semibold">Resume/CV: <a className="text-xl text-text font-semibold underline" href={application.resumeCv} target="_blank" rel="noreferrer">Download Resume/CV</a></p>
                <Close onClick={onClose} className="absolute top-2 right-2 text-secondary cursor-pointer"></Close>
            </div>
            )}
            </div>
        </Dialog>
    );
};

export default ViewApplicationDetailsModal;