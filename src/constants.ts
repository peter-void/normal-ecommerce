export enum NavbarLabel {
  Collections = "Collections",
  Categories = "Categories",
  Sale = "Sale",
}

export enum HoverColor {
  Blue = "blue",
  Green = "green",
}

export const hoverColorMap = {
  [HoverColor.Blue]: "hover:bg-blue-400",
  [HoverColor.Green]: "hover:bg-green-400",
};

export const NAVBAR_LINKS = [
  {
    label: NavbarLabel.Collections,
    href: "/collections",
    hoverColor: HoverColor.Blue,
  },
  {
    label: NavbarLabel.Categories,
    subLinks: [
      {
        label: "Electronics",
        href: "/categories/electronics",
      },
      {
        label: "Furniture",
        href: "/categories/furniture",
      },
    ],
  },
];

export const PAGE_SIZE = 5;

export const DEFAULT_MAX_FILES = 5;
export const DEFAULT_MAX_SIZE = 1024 * 1024 * 5;

export const ITEMS_PER_PAGE = 5;

export enum MonthOfBirth {
  JAN = "JAN",
  FEB = "FEB",
  MAR = "MAR",
  APR = "APR",
  MAY = "MAY",
  JUN = "JUN",
  JUL = "JUL",
  AUG = "AUG",
  SEP = "SEP",
  OCT = "OCT",
  NOV = "NOV",
  DEC = "DEC",
}

export const MONTH = [
  MonthOfBirth.JAN,
  MonthOfBirth.FEB,
  MonthOfBirth.MAR,
  MonthOfBirth.APR,
  MonthOfBirth.MAY,
  MonthOfBirth.JUN,
  MonthOfBirth.JUL,
  MonthOfBirth.AUG,
  MonthOfBirth.SEP,
  MonthOfBirth.OCT,
  MonthOfBirth.NOV,
  MonthOfBirth.DEC,
];

export const MAX_ADDRESS = 2;

export type Courier = "jne" | "sicepat" | "jnt" | "tiki";
