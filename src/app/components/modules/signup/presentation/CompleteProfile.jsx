"use client";


const CompleteProfile = ({
    formData,
    profilePic,
    coverPic,
    handleSubmit,
    handleChange,
    isSubmitting,
    handleImageChange,
    isFormValid
}) => {

    return(
        <div className="flex items-center jusifty-center min-h-screen bg-background flex-col">
            <h2 className="text-3xl font-bold text-center text-secondary mt-30">Achieve The Best Professional Experience</h2>
            <div className="bg-foreground p-8 rounded-lg shadow-2xl shadow-secondary w-115 mt-9 mb-10">
            <div className="flex items-center justify-center w-90 h-15  text-background rounded-full mx-auto mb-2">
             <h2 className="text-3xl font-bold text-center text-secondary">Complete Your Profile!</h2>
            </div>
            <div className="flex items-center justify-center w-70 h-15  text-background rounded-full mx-auto ">
                <h2 className="text-lg font-bold text-center text-text">Click to upload Cover Picture</h2>
            </div>
            <div className="relative w-full h-32 sm:h-40 md:h-48 rounded-lg overflow-hidden">
                    <img
                    src={coverPic|| "https://operaparallele.org/wp-content/uploads/2023/09/Placeholder_Image.png"}
                    alt="Cover Pic"
                    className="w-full h-full object-cover"
                    />
                <input
                    type="file"
                    accept="image/png, image/jpg, image/jpeg"
                    onChange={(e) => handleImageChange(e, "cover")}
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                    title="Upload Cover Pic"
                    required
                />
            </div>

            <div className="flex items-center justify-center w-70 h-15  text-background rounded-full mx-auto mt-4">
                <h2 className="text-lg font-bold text-center text-text">Click to upload Profile Picture</h2>
            </div>

            <div className="relative w-24 h-24 md:w-36 md:h-36 sm:w-28 sm:h-28 lg:w-40 lg:h-40 rounded-full overflow-hidden mx-auto ">
                    <img
                    src={profilePic || "https://www.gravatar.com/avatar/?d=mp&s=200"}
                    alt="Profile Pic"
                    className="w-full h-full object-cover"
                    />
                <input
                    type="file"
                    accept="image/png, image/jpg, image/jpeg"
                    onChange={(e) => handleImageChange(e, "profile")}
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                    title="Upload Profile Pic"
                    required
                />
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 ">
            <div className="mb-4">
                <label htmlFor="fullname" className="block text-text text-sm font-semibold mb-2"> Full Name </label>
                <input
                    id="fullname"
                    type="text"
                    name="name"
                    placeholder="Enter your Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border-gray-300 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-secondary bg-background text-text"
                />
                </div> 
                <div className="mb-4">
                    <label htmlFor="location" className="block text-text text-sm font-semibold mb-2"> Location </label>
                    <input
                        id="location"
                        type="location"
                        name="location"
                        placeholder="Enter your location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border-gray-300 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-secondary bg-background text-text"
                    />
                    </div>
                    <button
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
                    className={`w-full font-semibold p-3 rounded-lg transition duration-300 ${
                        isFormValid ? "bg-secondary text-background hover:bg-opacity-80" : "bg-gray-400 text-gray-700 cursor-not-allowed"
                    }`}
                >
                    {isSubmitting ? "Submitting..." : "Submit"}
                </button>
=                </form>
           </div>
        </div>
    );
};


export default CompleteProfile