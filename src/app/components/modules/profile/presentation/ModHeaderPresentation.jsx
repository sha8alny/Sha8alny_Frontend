/**
 * @namespace profile
 * @module profile
 */
export default function ModHeaderPresentation({
  isMyProfile,
  isConnected,
  pendingConnection,
  handleConnect,
  handleResumeDownload,
}) {
  return (
    <>
      {isMyProfile ? (
        <Button
          text="Edit Profile"
          onClick={() => console.log("Edit Profile")}
        />
      ) : (
        <div className="flex gap-4">
          <Button text="Download Resume" onClick={handleResumeDownload} />
          <Button
            text={
              isConnected
                ? "Message"
                : pendingConnection
                ? "Awaiting Response"
                : "Connect"
            }
            onClick={handleConnect}
          />
        </div>
      )}
    </>
  );
}

const Button = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-secondary text-background text-sm rounded-md cursor-pointer py-2 px-4 font-semibold hover:opacity-90 duration-250"
    >
      {text}
    </button>
  );
};
