import  ArrowBackIcon  from "@mui/icons-material/ArrowBack";
import { Alert } from "@mui/material";
import { TextField, MenuItem } from "@mui/material";

/**
 * PostNewJobForm component
 * 
 * This component renders a form for posting a new job. It includes fields for job details,
 * handles input changes, form submission, and displays validation errors and alerts.
 * 
 * @component
 * @param {Object} props - The properties object.
 * @param {Object} props.newJob - The state object containing the new job details.
 * @param {Function} props.handleChange - The function to handle input changes.
 * @param {Object} props.errors - The state object containing validation errors.
 * @param {Function} props.handleJobSubmit - The function to handle form submission.
 * @param {boolean} props.isLoading - The state indicating if the form is being submitted.
 * @param {Function} props.onBack - The function to call when the back button is clicked.
 * @param {Object} props.alert - The state object containing alert message and type.
 * 
 * @example
 * return (
 *   <PostNewJobForm
 *     newJob={newJob}
 *     handleChange={handleChange}
 *     errors={errors}
 *     handleJobSubmit={handleJobSubmit}
 *     isLoading={isLoading}
 *     onBack={onBack}
 *     alert={alert}
 *   />
 * )
 */
const PostNewJobForm =({
 newJob,
 handleChange,
    errors,
    handleJobSubmit,
    isLoading,
    onBack,
    alert
})=>{
    return(
        <div className="bg-transparent flex-grow p-6 rounded-lg border border-secondary max-w-2xl m-5 relative grid grid-cols-1 gap-6">
        <div className="grid grid-cols-2">
        <h2 className="text-3xl text-secondary font-semibold mb-4">Post New Job</h2>
        <div className="flex justify-end">
        <ArrowBackIcon onClick={onBack} className="border border-secondary rounded-full hover:bg-background transition duration-300 text-text "
        sx={{
        color: "text", // Replace with your desired color (e.g., red-orange)
        }}  role="button" aria-label="ArrowBack"></ArrowBackIcon>
        </div>
            </div>
            {alert && (
              <Alert severity={alert?.type === "success" ? "success" : "error"}>
                {alert?.message}
              </Alert>
            )}
                      
         <form onSubmit={handleJobSubmit} className="space-y-4">
            <div className="flex flex-col gap-4">
                
                <TextField 
                    data-testid="title" 
                    sx={{
                    "& label": { color: "var(--text)" }, 
                    "& .MuiOutlinedInput-root": {
                      color: "var(--text)", 
                      "& fieldset": { borderColor: "var(--text)" }, 
                    },
                    "& .MuiFormHelperText-root": { color: "var(--text)" }, 
                  }} error={!!errors.title} id="title" name="title" label="Enter Job Title" variant="outlined" value={newJob.title} onChange={handleChange} className="w-full my-2 " helperText={errors.title}
                
                />
                
                <TextField      
                    data-testid="location"            
                 sx={{
                    "& label": { color: "var(--text)" }, 
                    "& .MuiOutlinedInput-root": {
                      color: "var(--text)", 
                      "& fieldset": { borderColor: "var(--text)" }, 
                    },
                    "& .MuiFormHelperText-root": { color: "var(--text)" }, 
                  }} error={!!errors.location} id="location" name="location" label="Enter Job Location" variant="outlined" value={newJob.location} onChange={handleChange} className="w-full my-2 " helperText={errors.location}/>
                
                <TextField    
                    data-testid="description"               
                sx={{
                    "& label": { color: "var(--text)" }, 
                    "& .MuiOutlinedInput-root": {
                      color: "var(--text)", 
                      "& fieldset": { borderColor: "var(--text)" }, 
                    },
                    "& .MuiFormHelperText-root": { color: "var(--text)" }, 
                  }} error={!!errors.description} id="description" name="description" label="Enter Job Description" variant="outlined" value={newJob.description} onChange={handleChange} className="w-full my-2 " helperText={errors.description}/>
                <TextField
                data-testid="employmentType"
                sx={{
                "& label": { color: "var(--text)" }, 
                "& .MuiOutlinedInput-root": {
                    color: "var(--text)", 
                    "& fieldset": { borderColor: "var(--text)" }, 
                },
                "& .MuiFormHelperText-root": { color: "var(--text)" }, 
                }}
                select
                error={!!errors.employmentType}
                id="employmentType"
                name="employmentType"
                label="Employment Type"
                variant="outlined"
                value={newJob.employmentType}
                onChange={handleChange}
                className="w-full my-2 "
                helperText={errors.employmentType}
                >
                <MenuItem value="Full Time">Full Time</MenuItem>
                <MenuItem value="Part Time">Part Time</MenuItem>
                <MenuItem value="Contract">Contract</MenuItem>
                <MenuItem value="Internship">Internship</MenuItem>
                </TextField>
                <TextField
                data-testid="work"
                sx={{
                "& label": { color: "var(--text)" }, 
                "& .MuiOutlinedInput-root": {
                    color: "var(--text)", 
                    "& fieldset": { borderColor: "var(--text)" }, 
                },
                "& .MuiFormHelperText-root": { color: "var(--text)" }, 
                }}
                select
                error={!!errors.workLocation}
                id="workLocation"
                name="workLocation"
                label="Work Location"
                variant="outlined"
                value={newJob.workLocation}
                onChange={handleChange}
                className="w-full my-2 "
                helperText={errors.workLocation}
                >
                <MenuItem value="Remote">Remote</MenuItem>
                <MenuItem value="Onsite">Onsite</MenuItem>
                <MenuItem value="Hybrid">Hybrid</MenuItem>
                </TextField>
                <TextField 
                    data-testid="industry"                  
                sx={{
                    "& label": { color: "var(--text)" }, 
                    "& .MuiOutlinedInput-root": {
                      color: "var(--text)", 
                      "& fieldset": { borderColor: "var(--text)" }, 
                    },
                    "& .MuiFormHelperText-root": { color: "var(--text)" }, 
                  }} error={!!errors.industry} id="industry" name="industry" label="Enter Industry" variant="outlined" value={newJob.industry} onChange={handleChange} className="w-full my-2 " helperText ={errors.industry} />
                <TextField
                data-testid="experience"
                sx={{
                "& label": { color: "var(--text)" }, 
                "& .MuiOutlinedInput-root": {
                    color: "var(--text)", 
                    "& fieldset": { borderColor: "var(--text)" }, 
                },
                "& .MuiFormHelperText-root": { color: "var(--text)" }, 
                }}
                select
                error={!!errors.experience}
                id="experience"
                name="experience"
                label="Experience"
                variant="outlined"
                value={newJob.experience}
                onChange={handleChange}
                className="w-full my-2 "
                helperText={errors.experience}
                >
                <MenuItem value="Entry Level">Entry Level</MenuItem>
                <MenuItem value="Mid Level">Mid Level</MenuItem>
                <MenuItem value="Senior Level">Senior Level</MenuItem>
                </ TextField>
                <TextField         
                    data-testid="salary"          
                sx={{
                    "& label": { color: "var(--text)" }, 
                    "& .MuiOutlinedInput-root": {
                      color: "var(--text)", 
                      "& fieldset": { borderColor: "var(--text)" }, 
                    },
                    "& .MuiFormHelperText-root": { color: "var(--text)" }, 
                  }} error={!!errors.salary} id="salary" name="salary" label="Enter Salary" variant="outlined" value={newJob.salary} onChange={handleChange} type="number" className="w-full my-2 " helperText={errors.salary}/>
            </div>
            <div className="flex justify-center">
            <button
            type="submit"
            aria-label="Post"
             className=" border border-secondary text-xl text-secondary rounded-full px-8 py-2 hover:bg-foreground transition duration-300"
            disabled={isLoading}
            >            {isLoading ? "Posting..." : "Post"}</button>
            </div>
        </form>
        </div>
    )
}

export default PostNewJobForm;