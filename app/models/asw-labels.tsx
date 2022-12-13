import type { Reason } from "@prisma/client";

const TopLevelCategories = [
  "Explicit Nudity",
  "Suggestive",
  "Violence",
  "Visually Disturbing",
  "Rude Gestures",
  "Drugs",
  "Tobacco",
  "Alcohol",
  "Gambling",
  "Hate Symbols",
];

const Categories = [
  "Explicit Nudity",
  "Nudity",
  "Graphic Male Nudity",
  "Graphic Female Nudity",
  "Sexual Activity",
  "Illustrated Explicit Nudity",
  "Adult Toys",
  "Suggestive",
  "Female Swimwear Or Underwear",
  "Male Swimwear Or Underwear",
  "Partial Nudity",
  "Barechested Male",
  "Revealing Clothes",
  "Sexual Situations",
  "Violence",
  "Graphic Violence Or Gore",
  "Physical Violence",
  "Weapon Violence",
  "Weapons",
  "Self Injury",
  "Visually Disturbing",
  "Emaciated Bodies",
  "Corpses",
  "Hanging",
  "Air Crash",
  "Explosions And Blasts",
  "Rude Gestures",
  "Middle Finger",
  "Drugs",
  "Drug Products",
  "Drug Use",
  "Pills",
  "Drug Paraphernalia",
  "Tobacco",
  "Tobacco Products",
  "Smoking",
  "Alcohol",
  "Drinking",
  "Alcoholic Beverages",
  "Gambling",
  "Hate Symbols",
  "Nazi Party",
  "White Supremacy",
  "Extremist",
];

export type TopLevelCategory = typeof TopLevelCategories[number];
export type LabelCategory = typeof Categories[number];

const topLevelForCategory: Record<LabelCategory, TopLevelCategory> = {
  "Explicit Nudity": "Explicit Nudity",
  Nudity: "Explicit Nudity",
  "Graphic Male Nudity": "Explicit Nudity",
  "Graphic Female Nudity": "Explicit Nudity",
  "Sexual Activity": "Explicit Nudity",
  "Illustrated Explicit Nudity": "Explicit Nudity",
  "Adult Toys": "Explicit Nudity",
  Suggestive: "Suggestive",
  "Female Swimwear Or Underwear": "Suggestive",
  "Male Swimwear Or Underwear": "Suggestive",
  "Partial Nudity": "Suggestive",
  "Barechested Male": "Suggestive",
  "Revealing Clothes": "Suggestive",
  "Sexual Situations": "Suggestive",
  Violence: "Violence",
  "Graphic Violence Or Gore": "Violence",
  "Physical Violence": "Violence",
  "Weapon Violence": "Violence",
  Weapons: "Violence",
  "Self Injury": "Violence",
  "Visually Disturbing": "Visually Disturbing",
  "Emaciated Bodies": "Visually Disturbing",
  Corpses: "Visually Disturbing",
  Hanging: "Visually Disturbing",
  "Air Crash": "Visually Disturbing",
  "Explosions And Blasts": "Visually Disturbing",
  "Rude Gestures": "Rude Gestures",
  "Middle Finger": "Rude Gestures",
  Drugs: "Drugs",
  "Drug Products": "Drugs",
  "Drug Use": "Drugs",
  Pills: "Drugs",
  "Drug Paraphernalia": "Drugs",
  Tobacco: "Tobacco",
  "Tobacco Products": "Tobacco",
  Smoking: "Tobacco",
  Alcohol: "Alcohol",
  Drinking: "Alcohol",
  "Alcoholic Beverages": "Alcohol",
  Gambling: "Gambling",
  "Hate Symbols": "Hate Symbols",
  "Nazi Party": "Hate Symbols",
  "White Supremacy": "Hate Symbols",
  Extremist: "Hate Symbols",
};

export const getReasonForCategories = function (reasons: Reason[]) {
  const reasonDict: Record<TopLevelCategory, Reason> = reasons.reduce(
    (acc, reason) => ({ ...acc, [reason.name]: reason }),
    {}
  );

  const reasonForCat: Record<LabelCategory, Reason> = Categories.reduce(
    (acc, category) => ({
      ...acc,
      [category]: reasonDict[topLevelForCategory[category]],
    }),
    {}
  );
  return reasonForCat;
};
