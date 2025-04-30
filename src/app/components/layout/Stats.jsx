import Container from "./Container";

const Stats = ({ trackedStats, isPremium, determineStat }) => {
  return (
    <Container
      className="flex flex-col w-full dark:border-[#111] border shadow-md p-4"
      testId="stats-root"
    >
      <h2 className="text font-bold mb-4" data-testid="stats-plan-title">
        Your Current Plan:{" "}
        <span
          className={
            isPremium
              ? "text-yellow-600 dark:text-yellow-500 font-black"
              : "text-green-600 dark:text-green-500 font-semibold"
          }
          data-testid="stats-plan-type"
        >
          {isPremium ? "Premium" : "Free"}
        </span>
      </h2>
      <div className="flex flex-col gap-2" data-testid="stats-list">
        {trackedStats.map((stat, index) => (
          <div
            key={index}
            className="flex items-center"
            data-testid={`stats-item-${stat.name
              .replace(/\s+/g, "-")
              .toLowerCase()}`}
          >
            <stat.icon
              sx={{ fontSize: 20 }}
              className="mr-2"
              data-testid={`stats-icon-${stat.name
                .replace(/\s+/g, "-")
                .toLowerCase()}`}
            />
            <p
              className="text-sm text-primary mr-2"
              data-testid={`stats-name-${stat.name
                .replace(/\s+/g, "-")
                .toLowerCase()}`}
            >
              {stat.name}:
            </p>
            <span
              data-testid={`stats-value-${stat.name
                .replace(/\s+/g, "-")
                .toLowerCase()}`}
            >
              {determineStat(stat)}
            </span>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default Stats;
