import { RouletteColors } from "@/interfaces/interfaces";

export const BASE_URL = "https://dev-games-backend.advbet.com/v1/ab-roulette/";

export const getColor = (color: string) => {
  if (color === RouletteColors.RED) return "#ff0000";
  if (color === RouletteColors.BLACK) return "#000000";
  if (color === RouletteColors.GREEN) return "#00ff00";
  return "transparent";
};

export const formatDateString = (dateString: string) => {
  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return `${formattedDate} ${formattedTime}`;
};
