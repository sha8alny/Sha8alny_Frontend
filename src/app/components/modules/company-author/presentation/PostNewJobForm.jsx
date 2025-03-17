const PostNewJobForm =({
 newJob,
 handleChange,
    errors,
    handleJobSubmit,
    isLoading,
})=>{
    return(
        <div className="bg-transparent flex-grow p-6 rounded-lg border border-secondary max-w-2xl m-18 relative grid grid-cols-1 gap-6">
        <h2 className="text-3xl text-secondary font-semibold mb-4">Post New Job</h2>
        <form onSubmit={handleJobSubmit} className="space-y-4">
            <div>
                <label htmlFor="jobTitle" className="block text-text text-semibold font-medium">
                    Job Title :
                    </label>
                <input
                type="text"
                id="title"
                value={ newJob.title}
                onChange={handleChange}
                className={`w-full p-2 mt-2 border border-secondary rounded ${
            errors.title ? "border border-red-500" : ""
          }`}
                placeholder="Enter Job Title"
                
                />
                {errors.title && (
                <p className="text-red-500 text-sm">{errors.title}</p>
                )}
                <label htmlFor="location" className="block text-text text-semibold font-medium">
                   Location :
                   </label>
                <input
                type="text"
                id="location"
                value={ newJob.location}
                onChange={handleChange}
                className={`w-full p-2 mt-2 border border-secondary rounded ${
            errors. location? "border border-red-500" : ""
          }`}
                placeholder="Enter Job Location"
                
                />
                {errors.location && (
                <p className="text-red-500 text-sm">{errors.location}</p>
                )}

                <label htmlFor="description" className="block text-text text-semibold font-medium">
                    Description:
                    </label>
                <input
                type="text"
                id="description"
                value={ newJob.description}
                onChange={handleChange}
                className={`w-full p-2 mt-2 border border-secondary rounded ${
            errors.description ? "border border-red-500" : ""
          }`}
                placeholder="Enter Job Description"
                rows="4"
                
                />
                {errors.description && (
                <p className="text-red-500 text-sm">{errors.description}</p>
                )}                                                     
                <label htmlFor="industry" className="block text-text text-semibold font-medium">
                    Industry:
                    </label>
                <input
                type="text"
                id="industry"
                value={ newJob.industry}
                onChange={handleChange}
                className={`w-full p-2 mt-2 border border-secondary rounded ${
            errors.industry ? "border border-red-500" : ""
          }`}
                placeholder="Enter Industry"
                
                />
                {errors.industry && (
                <p className="text-red-500 text-sm">{errors.industry}</p>
                )}
                <label htmlFor="experience" className="block text-text text-semibold font-medium">
                    Experience:
                    </label>
                <select
                type="text"
                id="experience"
                value={ newJob.experience}
                onChange={handleChange}
                className={`w-full p-2 mt-2 border border-secondary rounded ${
            errors.experience ? "border border-red-500" : ""
          }`}
                
                >
                <option value="">Select Experience Level</option>
                <option value="Entry Level">Entry Level</option>
                <option value="Mid Level">Mid Level</option>
                <option value="Senior Level">Senior Level</option> 
                </select>  
                {errors.experience && (
                <p className="text-red-500 text-sm">{errors.experience}</p>
                )}
                <label htmlFor="salary" className="block text-text text-semibold font-medium">
                    Salary:
                    </label>
                <input
                type="number"
                id="salary"
                value={ newJob.salary}
                onChange={handleChange}
                className={`w-full p-2 mt-2 border border-secondary rounded ${
            errors.salary ? "border border-red-500" : ""
          }`}
                placeholder="Enter Salary"
                
                />
                {errors.salary && (
                <p className="text-red-500 text-sm">{errors.salary}</p>
                )}
                <label htmlFor="time" className="block text-text text-semibold font-medium">
                    Job Posting Date:
                <input
                type="datetime-local"
                id="time"
                value={ newJob.time.slice(0,16)}
                onChange={(e) =>
                    setNewJob({ ...newJob, time: new Date(e.target.value).toISOString() })
                  }
                className="w-full p-2 mt-2 border border-secondary rounded"
                
                />
                </label>                                                       
            </div>
            <div className="flex justify-center">
            <button
             className=" border border-secondary text-xl text-secondary rounded-full px-8 py-2 hover:bg-foreground transition duration-300"
            disabled={isLoading}
            >            {isLoading ? "Posting..." : "Post"}</button>
            </div>
        </form>
        </div>
    )
}

export default PostNewJobForm;