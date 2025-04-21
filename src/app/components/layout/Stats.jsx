import Container from "./Container";

const Stats = ({ trackedStats, isPremium, determineStat }) => {
  return (
    <Container className="flex flex-col w-full dark:border-[#111] border shadow-md p-4">
      <h2 className="text font-bold mb-4">
        Your Current Plan:{" "}
        <span
          className={
            isPremium
              ? "text-yellow-600 dark:text-yellow-500 font-black"
              : "text-green-600 dark:text-green-500 font-semibold"
          }
        >
          {isPremium ? "Premium" : "Free"}
        </span>
      </h2>
      <div className="flex flex-col gap-2">
        {trackedStats.map((stat, index) => (
          <div key={index} className="flex items-center">
            <stat.icon sx={{fontSize: 20}} className="mr-2" />
            <p className="text-sm text-primary mr-2">{stat.name}: </p>
            {determineStat(stat)}
          </div>
        ))}
      </div>
    </Container>
  );
};

export default Stats;
