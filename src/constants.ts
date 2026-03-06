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

export enum SortOption {
  NEWEST = "newest",
  PRICE_ASC = "price-asc",
  PRICE_DESC = "price-desc",
  BEST_SELLERS = "best-sellers",
}

export const EMAIL_VERIFICATION_TEMPLATE = (link: string) => {
  return `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;700;900&display=swap');
          </style>
        </head>
        <body style="margin: 0; padding: 40px 20px; background-color: #f0f0f0; font-family: 'Public Sans', 'Segoe UI', sans-serif;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
            <tr>
              <td>
                <div style="background-color: #ffffff; border: 4px solid #000000; box-shadow: 8px 8px 0px 0px #000000; overflow: hidden;">
                  <!-- Header -->
                  <div style="background-color: #facc15; border-bottom: 4px solid #000000; padding: 32px 24px; text-align: center;">
                    <div style="background-color: #000000; color: #ffffff; display: inline-block; padding: 4px 12px; font-weight: 900; font-size: 12px; text-transform: uppercase; margin-bottom: 16px;">
                      SECURITY
                    </div>
                    <h1 style="margin: 0; font-size: 36px; font-weight: 900; text-transform: uppercase; line-height: 1; color: #000000; letter-spacing: -1px;">
                      Verify Your<br/>Email
                    </h1>
                  </div>

                  <!-- Content -->
                  <div style="padding: 40px 24px; text-align: center; background-color: #ffffff;">
                    <p style="margin: 0 0 24px 0; font-size: 18px; font-weight: 700; color: #000000; line-height: 1.5;">
                      Greetings! We just need to make sure this email address belongs to you.
                    </p>
                    
                    <div style="margin: 32px 0;">
                      <a href="${link.toString()}" style="display: inline-block; background-color: #a985ff; color: #000000; border: 4px solid #000000; padding: 16px 32px; font-size: 18px; font-weight: 900; text-decoration: none; text-transform: uppercase; box-shadow: 4px 4px 0px 0px #000000; transition: all 0.2s;">
                        Confirm My Email
                      </a>
                    </div>

                    <p style="margin: 24px 0 0 0; font-size: 14px; color: #666666; font-weight: 700;">
                      Or copy and paste this link:<br/>
                      <span style="color: #a985ff; text-decoration: underline; font-size: 12px; word-break: break-all;">
                        ${link.toString()}
                      </span>
                    </p>
                  </div>

                  <!-- Footer -->
                  <div style="background-color: #000000; color: #ffffff; padding: 24px; text-align: center; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
                    This link will expire in 1 hour.
                  </div>
                </div>
                
                <div style="margin-top: 24px; text-align: center;">
                   <p style="margin: 0; font-size: 12px; font-weight: 900; text-transform: uppercase; color: #000000;">
                    &copy; 2025 LOH-WOK ENTERPRISE
                   </p>
                </div>
              </td>
            </tr>
          </table>
        </body>
        </html>
        `;
};
