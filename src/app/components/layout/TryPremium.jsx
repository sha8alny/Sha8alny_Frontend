import { Verified } from "@mui/icons-material";
import Container from "./Container";

const TryPremium = ({ navigateTo }) => {
  return (
    <Container className="p-4 w-full border border-[#111] flex items-center gap-1">
      <Verified className="size-5 text-yellow-500" />
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
