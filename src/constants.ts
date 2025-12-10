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

export const DEFAULT_MAX_FILES = 3;
export const DEFAULT_MAX_SIZE = 1024 * 1024 * 5;

export const ITEMS_PER_PAGE = 5;
