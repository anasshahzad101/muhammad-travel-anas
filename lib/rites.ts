import type { RitesCopy } from "@/components/RitesExperience";
import { getDua } from "./duas";

/**
 * Copy for the "Umrah in four steps" experience (home page and the how-to
 * guide). Step text follows the guide; the walk-along hints are the duas
 * themselves from lib/duas.ts, so the two can never disagree.
 */
export function ritesCopy(): RitesCopy {
  const d = (id: string) => `${getDua(id).when}: ${getDua(id).transliteration}`;
  return {
    steps: [
      {
        id: "ihram",
        title: "Ihram",
        body: "Enter the state of ihram before the miqat, with the intention for Umrah and the talbiyah. Flights from Pakistan cross the miqat in the air, so put on your ihram before you board.",
      },
      {
        id: "tawaf",
        title: "Tawaf",
        body: "Seven circuits around the Kaaba, anticlockwise with the Kaaba on your left, starting and ending at the Black Stone. Then two rak‘ahs behind Maqam Ibrahim, and Zamzam.",
      },
      {
        id: "sai",
        title: "Sa'i",
        body: "Seven lengths between Safa and Marwah, starting at Safa and ending at Marwah. Men walk briskly between the green lights.",
      },
      {
        id: "halq",
        title: "Halq or taqsir",
        body: "Men shave or trim their hair; women trim a fingertip's length. Your Umrah is complete, and the restrictions of ihram are lifted.",
      },
    ],
    hints: {
      blackStone: d("black-stone"),
      rabbana: d("rabbana"),
      freely: "The rest of each circuit, pray freely, in your own words and language.",
      tawafDone: "Seven circuits complete. Pray two rak‘ahs behind Maqam Ibrahim if there is room, then drink Zamzam.",
      safaStart: d("safa-start"),
      greenLights: d("green-lights"),
      saiDone: "Seven lengths complete, ending at Marwah. Now halq or taqsir, and your Umrah is done.",
    },
    talbiyah: { arabic: "لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ", transliteration: "Labbayk Allāhumma labbayk" },
  };
}
