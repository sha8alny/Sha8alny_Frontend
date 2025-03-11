/**
 * SettingsFormLayout component is a layout component to apply a settings form layout.
 * @returns {JSX.Element} The rendered component.
 */

const SettingsFormLayout = ({children}) => {
  return (
    <div className="text-text flex flex-col gap-4 bg-foreground rounded-lg w-full max-w-[725px] mx-auto font-sans p-4">
        {children}
    </div>
  );
};

export default SettingsFormLayout;
