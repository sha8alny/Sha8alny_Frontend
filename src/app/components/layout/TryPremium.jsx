import { Verified } from "@mui/icons-material";
import Container from "./Container";

const TryPremium = ({ navigateTo }) => {
  return (
    <Container className="p-4 w-full border dark:border-[#111] flex items-center shadow-md gap-1">
      <Verified className="text-secondary" sx={{fontSize: "1.3rem" }} />
      <button
        onClick={() => navigateTo("/membership-page")}
        className="hover:underline cursor-pointer text-sm font-semibold"
      >
        Try Premium
      </button>
    </Container>
  );
};

export default TryPremium;
