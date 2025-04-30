import { Verified } from "@mui/icons-material";
import Container from "./Container";

const TryPremium = ({ navigateTo }) => {
  return (
    <Container
      className="p-4 w-full border dark:border-[#111] flex items-center shadow-md gap-1"
      data-testid="try-premium-root"
    >
      <Verified
        className="text-secondary"
        sx={{ fontSize: "1.3rem" }}
        data-testid="try-premium-icon"
      />
      <button
        onClick={() => navigateTo("/membership-page")}
        className="hover:underline cursor-pointer text-sm font-semibold"
        data-testid="try-premium-btn"
      >
        Try Premium
      </button>
    </Container>
  );
};

export default TryPremium;
