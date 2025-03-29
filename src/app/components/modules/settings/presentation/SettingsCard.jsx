import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
/**
 * @namespace settings
 * @module settings
 */
/**
 * A reusable settings card component that displays a list of settings items.
 *
 * @component
 * @example
 * return (
 *   <SettingsCard
          header="Display"
          items={{
            "Dark mode": {
              label: theme,
              link: () => setActiveForm("darkMode"),
            },
          }}
        />
 * @param {Object} props - The component props.
 * @param {string} props.header - The header text for the settings card.
 * @param {Object} props.items - The list of settings items to display, where the key is the setting name
 * and the value has two items : label and link. label is the setting value. link is optional if a a setting can redirect to another page.
 */

const SettingsCard = ({ header, items }) => {
  return (
    <div className="flex flex-col gap-4 bg-foreground rounded-lg w-full max-w-[725px] mx-auto font-sans">
      <h1 className="text-primary text-xl font-semibold pt-4 pl-4">{header}</h1>
      <div className="flex flex-col gap-2 ">
        {Object.entries(items).map(([key, value], index) => (
          <button
            key={key}
            onClick={value.link}
            className={`flex flex-row justify-between items-center pl-4 pb-4 pr-2 cursor-pointer  ${
              index !== Object.entries(items).length - 1
                ? "border-b-[1px] border-gray-600"
                : ""
            }`}
          >
            <span className="text-primary text-lg">{key}</span>

            <div className=" flex flex-row items-center gap-4 cursor-pointer">
              <span className="text-gray-500 text-[1rem]">{value.label}</span>
              <ArrowForwardIcon className="text-primary" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SettingsCard;
