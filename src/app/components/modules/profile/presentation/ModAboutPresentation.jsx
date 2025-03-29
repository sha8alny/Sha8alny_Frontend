import { Textarea } from "@/app/components/ui/Textarea";

/**
 * @namespace profile
 * @module profile
 */
/**
 * A presentation component for displaying and editing 'About' section in profile module
 * @param {Object} props - The component props
 * @param {string} props.about - The about text content
 * @param {string|null} props.error - Error message to display, if any
 * @param {Function} props.handleAbout - Callback function to handle changes in about text
 * @param {Function} props.handleSubmit - Callback function to handle form submission
 * @returns {JSX.Element} A form with textarea and submit button for editing about section
 */
export default function ModAboutPresentation({
  about,
  error,
  handleAbout,
  handleSubmit,
}) {
  return (
    <div className="p-4 text-primary">
      <h3 className="text-2xl mb-4 text-center font-bold">About</h3>
      <Textarea
        onChange={(e) => handleAbout(e.target.value)}
        placeholder="Write about yourself."
        value={about}
        className="w-full h-52 bg-foreground"
        style={{ resize: "none" }}
      />
      <div className="flex justify-start text-xs font-semibold text-muted mt-2">
        <span className={about.length > 1000 ? "text-red-500" : ""}>
          {about.length}
        </span>
        /1000
      </div>
      {error && (
        <p className="text-red-500 text-center text-sm mt-2">{error}</p>
      )}
      <button
        onClick={() => handleSubmit(about)}
        disabled={error}
        className="disabled:bg-red-800 bg-secondary w-full disabled:cursor-default hover:cursor-pointer disabled:hover:opacity-100 hover:bg-secondary hover:opacity-80 duration-250 text-primary font-semibold px-4 py-2 rounded-md mt-4"
      >
        Save
      </button>
    </div>
  );
}
