import { Verified } from "@mui/icons-material";
import Container from "./Container";

const TryPremium = () => {
  return (
    <Container className="p-4 w-full border border-[#111] flex items-center gap-1">
      <Verified className="size-5 text-yellow-500" />
      <button className="hover:underline text-sm font-semibold">
        Try Premium for free
      </button>
    </Container>
  );
};

export default TryPremium;