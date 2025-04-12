"use client";
import  ArrowBackIcon  from "@mui/icons-material/ArrowBack";
import { Input } from "@/app/components/ui/Input";
import { Label } from "@/app/components/ui/Label";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/app/components/ui/Select";
import { Button } from "@/app/components/ui/Button";
/**
 * @namespace company-author
 * @module company-author
 */
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
 *   />
 * )
 */
const PostNewJobForm =({
 newJob,
 handleChange,
    errors,
    handleJobSubmit,
    isLoading,
    onBack
  })=>{
    return(
        <div className="bg-foreground flex-grow p-6 rounded-lg w-full relative grid grid-cols-1 gap-6">
        <div className="grid grid-cols-2">
        <h2 className="text-3xl text-secondary font-semibold mb-4">Post New Job</h2>
        <div className="flex justify-end">
        <ArrowBackIcon onClick={onBack} className="border border-secondary rounded-full hover:bg-background transition duration-300 text-text "
        sx={{
        color: "text", // Replace with your desired color (e.g., red-orange)
        }}  role="button" aria-label="ArrowBack"></ArrowBackIcon>
        </div>
            </div>
                      
         <form onSubmit={handleJobSubmit} className="space-y-4">
            <div className="flex flex-col gap-4">
                
               <Label className="text-text text-lg" htmlFor="title">Enter Job Title</Label>
                    <Input className="text-text text-md"
                        data-testid="title"
                        id="title"
                        name="title"
                        value={newJob.title}
                        onChange={handleChange}
                        error={errors.title}
                    />
                    {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                
                <Label className="text-text text-lg" htmlFor="location">Enter Job Location</Label>
                    <Input className="text-text text-md"
                        data-testid="location"
                        id="location"
                        name="location"
                        value={newJob.location}
                        onChange={handleChange}
                        error={errors.location}
                    />
                    {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}

                <Label className="text-text text-lg" htmlFor="description">Enter Job Description</Label>
                    <Input className="text-text text-md"
                        data-testid="description"
                        id="description"
                        name="description"
                        value={newJob.description}
                        onChange={handleChange}
                        error={errors.description}
                    />
                    {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}

                <Label className="text-text text-lg" htmlFor="employmentType">Employment Type</Label>
                    <Select
                        data-testid="employmentType"
                        role="combobox"
                        id="employmentType"
                        name="employmentType"
                        value={newJob.employmentType}
                        onValueChange={(value) => handleChange({ target: { name: "employmentType", value } })}
                        error={errors.employmentType}
                        placeholder="Select Employment Type"
                    >
                        <SelectTrigger className="w-full text-text">
                        <SelectValue>{newJob.employmentType}</SelectValue>
                        </SelectTrigger>  
                        <SelectContent>
                            <SelectItem value="Full-time">Full-time</SelectItem>
                            <SelectItem value="Part-time">Part-time</SelectItem>
                            <SelectItem value="Internship">Internship</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.employmentType && <p className="text-red-500 text-sm">{errors.employmentType}</p>}

                <Label  className="text-text text-lg" htmlFor="work">Work Location</Label>
                    <Select
                        data-testid="work"
                        role="combobox"
                        id="work"
                        name="workLocation"
                        value={newJob.workLocation}
                        onValueChange={(value) => handleChange({ target: { name: "workLocation", value } })}
                        error={errors.workLocation}
                        placeholder="Select Work Location"
                    >
                        <SelectTrigger className="w-full text-text">
                        <SelectValue>{newJob.workLocation}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Remote">Remote</SelectItem>
                            <SelectItem value="Onsite">Onsite</SelectItem>
                            <SelectItem value="Hybrid">Hybrid</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.workLocation && <p className="text-red-500 text-sm">{errors.workLocation}</p>}

                <Label className="text-text text-lg" htmlFor="industry">Enter Industry</Label>
                    <Input className="text-text text-md"
                        data-testid="industry"
                        id="industry"
                        name="industry"
                        value={newJob.industry}
                        onChange={handleChange}
                        error={errors.industry}
                    />  
                    {errors.industry && <p className="text-red-500 text-sm">{errors.industry}</p>}

                <Label className="text-text text-lg" htmlFor="experience">Experience</Label>
                    <Select
                        data-testid="experience"
                        role="combobox"
                        id="experience" 
                        name="experience"
                        value={newJob.experience}
                        onValueChange={(value) => handleChange({ target: { name: "experience", value } })}
                        error={errors.experience}
                        placeholder="Select Experience"
            
                    > 
                        <SelectTrigger className="w-full text-text">
                            <SelectValue>{newJob.experience}</SelectValue>
                        </SelectTrigger>
                        <SelectContent> 
                            <SelectItem value="Entry Level">Entry Level</SelectItem>
                            <SelectItem value="Mid Level">Mid Level</SelectItem>
                            <SelectItem value="Senior Level">Senior Level</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.experience && <p className="text-red-500 text-sm">{errors.experience}</p>}

                <Label className="text-text text-lg" htmlFor="salary">Enter Salary</Label>
                    <Input className="text-text text-md"
                        data-testid="salary"
                        id="salary"
                        name="salary"
                        type="number"
                        value={newJob.salary}
                        onChange={handleChange}
                        error={errors.salary}
                    />
                    {errors.salary && <p className="text-red-500 text-sm">{errors.salary}</p>}
            </div>
            <div className="flex justify-center">
            <Button
            type="submit"
            aria-label="Post"
             className=" text-background bg-secondary cursor-pointer hover:bg-secondary/80 transition-colors duration-200"
            disabled={isLoading}
            >            {isLoading ? "Posting..." : "Post"}</Button>
            </div>
        </form>
        </div>
    )
}

export default PostNewJobForm;