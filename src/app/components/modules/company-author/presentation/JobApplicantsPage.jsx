import ProfileCard from "../../../ui/ProfileCard";
import { ArrowBack } from "@mui/icons-material";

const JobApplicantsPage = ({Applicants, isLoading, onBack}) => {
   console.log("Applicants",Applicants);
    return (
        <div className="bg-transparent flex-grow p-6 rounded-lg border border-secondary max-w-2xl m-18 relative grid grid-cols-1 gap-6">
        <div className="flex justify-end">
        <ArrowBack onClick={onBack} className="border border-secondary rounded-full hover:bg-background transition duration-300 "></ArrowBack>
        </div>
        <div className="grid grid-cols-2">
        {isLoading ?( <p className="text-text text-xl text-semibold">Loading...</p> ) : ( Applicants.length === 0 ? (
            <p className="text-text text-xl text-semibold">No Applicants yet</p> ) : (
                Applicants.map((Applicant) => (
                 <ProfileCard
                    key={Applicant.id}
                    name={Applicant.name}
                    title={Applicant.title}
                    profilePic={Applicant.profilePic}
                    coverPic={Applicant.coverPic}
                    buttonText="View Application"
                    showButton={true}
                    />
                ))
            )
        )}   
        </div>   
          </div>
    );
};

export default JobApplicantsPage;