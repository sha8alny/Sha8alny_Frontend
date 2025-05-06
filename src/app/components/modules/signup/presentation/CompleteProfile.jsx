"use client";


/**
 * CompleteProfile Component
 * 
 * This component renders a form for users to complete their profile by uploading a profile picture,
 * a cover picture, and filling out additional form data. It includes validation and submission handling.
 * 
 * @param {Object} props - The props object.
 * @param {Object} props.formData - The form data object containing user input values.
 * @param {string} props.profilePic - The URL of the profile picture.
 * @param {string} props.coverPic - The URL of the cover picture.
 * @param {Function} props.handleSubmit - The function to handle form submission.
 * @param {Function} props.handleChange - The function to handle input changes.
 * @param {boolean} props.isSubmitting - Indicates whether the form is currently being submitted.
 * @param {Function} props.handleImageChange - The function to handle image file changes.
 * @param {boolean} props.isFormValid - Indicates whether the form is valid for submission.
 * 
 * @returns {JSX.Element} The rendered CompleteProfile component.
 */
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
                    src={coverPic}
                    alt="Cover Pic"
                    className="w-full h-full object-cover"
                    />
                <input
                    data-testid="cover-pic-input"
                    type="file"
                    accept="image/png, image/jpg, image/jpeg, image/webp, image/gif"
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
                    src={profilePic}
                    alt="Profile Pic"
                    className="w-full h-full object-cover"
                    />
                <input
                    data-testid="profile-pic-input"
                    type="file"
                    accept="image/png, image/jpg, image/jpeg, image/webp, image/gif"
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
                    data-testid="fullname-input"
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
                        data-testid="location-input"
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
                    data-testid="complete-profile-button"
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