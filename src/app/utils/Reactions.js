import {
  CelebrationOutlined,
  EmojiEmotionsOutlined,
  FavoriteBorderOutlined,
  LightbulbOutlined,
  ThumbUpOffAltOutlined,
  VolunteerActivismOutlined,
} from "@mui/icons-material";

export const Reactions = {
  Like: {
    icon: ThumbUpOffAltOutlined,
    className: "text-secondary",
  },
  Celebrate: {
    icon: CelebrationOutlined,
    className: "text-amber-500",
  },
  Support: {
    icon: VolunteerActivismOutlined,
    className: "text-green-600",
  },
  Love: {
    icon: FavoriteBorderOutlined,
    className: "text-rose-600",
  },
  Insightful: {
    icon: LightbulbOutlined,
    className: "text-yellow-600",
  },
  Funny: {
    icon: EmojiEmotionsOutlined,
    className: "text-yellow-600",
  },
};