// Browser-safe and asset-free: the Split Money page, SEO module, sitemap, and llms.txt all read from here.
// Features describe only what the app really does, as shown in its screens and README; screenshots are
// imported by the presentation component, keyed by screen id.
import type { AppShowcase } from "./apps";

export type SplitMoneyFeatureIcon =
  "trips" | "split" | "balances" | "settle" | "invite" | "themes";

export type SplitMoneyScreenId = "home" | "trip" | "expense" | "home-dark";

export const splitMoney = {
  name: "Split Money",
  path: "/split-money",
  tagline: "Split trip costs, settle up once.",
  description:
    "Split Money is an Android app for sharing trip expenses with friends: split equally, by exact amounts, by percent, or by shares, and see one net balance per friend across every trip.",
  platform: "Android",
  category: "Trip expense splitting",
  applicationCategory: "FinanceApplication",
  apkUrl:
    "https://drive.google.com/file/d/1AAH39klSkQzo84-rDlFyGIlCeP0jVYvj/view?usp=sharing",
  apkHost: "Google Drive",
  apkSize: "54.8 MB",
  hero: { label: "Home and trip", back: "trip", front: "home" },
  headings: {
    features: "Fair splits, without the spreadsheet.",
    steps: "Three steps, then you're square.",
    screens: {
      title: "A closer look.",
      description:
        "Screens from the Android app in its Glass theme, in light and dark.",
    },
    build: "Under the hood.",
    cta: ["Split the bill,", "not the friendship."],
  },
  features: [
    {
      title: "Trips with friends",
      body: "Create a trip with its own currency, icon, and color, then add the friends who came along. Each trip shows what was spent and your share.",
      icon: "trips",
    },
    {
      title: "Four ways to split",
      body: "Split each expense equally, by exact amounts, by percent, or by shares, like 2 for a couple. Splits always add up to the last paisa.",
      icon: "split",
    },
    {
      title: "One figure per friend",
      body: "Balances net out across every trip you share. If Aarav owes you ₹4,500 from Goa and you owe him ₹5,400 from Manali, Home shows you owe ₹900.",
      icon: "balances",
    },
    {
      title: "Settle up across trips",
      body: "Record a payment and the balance clears. Settling with a friend across trips records one payment in each shared trip, so every balance returns to zero.",
      icon: "settle",
    },
    {
      title: "Invite by email or code",
      body: "Find friends by their exact email once they've signed in, or share the trip's 6-character code.",
      icon: "invite",
    },
    {
      title: "Glass or Classic, light or dark",
      body: "Choose translucent Glass cards or solid Classic ones, and System, Light, or Dark appearance. The sun and moon button on Home flips it in one tap.",
      icon: "themes",
    },
  ],
  steps: [
    {
      title: "Start a trip",
      body: "Sign in with Google, create a trip, and invite friends by email or with its code.",
    },
    {
      title: "Add expenses",
      body: "Log what was spent, who paid, and how to split it. Everyone's share is worked out for you.",
    },
    {
      title: "Settle up",
      body: "See who owes whom across all your trips, then record the payments that clear it.",
    },
  ],
  screens: [
    {
      id: "home",
      title: "Balances",
      caption:
        "Home nets each friend across all your trips into one figure, here in the light Glass theme.",
      alt: "Split Money's Balances home screen in light mode: overall you're owed ₹2,550 across 4 people in 3 trips, New trip and Join with code buttons, and net balances where you owe Aarav Rao ₹900 across Goa Getaway and Manali, Meera Iyer owes you ₹2,800, Kabir Shah owes you ₹1,250, and you owe Zoya Khan ₹600.",
    },
    {
      id: "trip",
      title: "Trip detail",
      caption:
        "Total spent, your share, and every expense and settlement, grouped by day.",
      alt: "Split Money's Goa Getaway trip for You, Aarav, and Meera in INR: total spent ₹24,900, your share ₹8,700, and you're owed ₹7,300, above a scooter rental, a seafood dinner, a ₹2,000 settlement from Meera, and a beach villa, each with what you owe or lent.",
    },
    {
      id: "expense",
      title: "Add expense",
      caption:
        "Pick a category, then split equally, by exact amounts, by percent, or by shares.",
      alt: "Split Money's Add expense sheet for Goa Getaway: a ₹3,600 Sunset cruise in the Activity category, split equally so You, Aarav Rao, and Meera Iyer each owe ₹1,200.",
    },
    {
      id: "home-dark",
      title: "Dark mode",
      caption:
        "The same Home in dark. The sun button flips appearance in one tap.",
      alt: "Split Money's Balances home screen in dark mode, with the same ₹2,550 overall and the same four friends' net balances.",
    },
  ],
  build: [
    {
      title: "No server to run",
      body: "Built with Expo SDK 58 and Firebase's free Spark plan. All logic runs in the app, and Firestore security rules decide who can read and write each trip.",
    },
    {
      title: "Money in whole paise",
      body: "Amounts are stored as integers in minor units, and leftover paise go to the largest remainders, so splits always total exactly.",
    },
    {
      title: "Balances kept in step",
      body: "Each trip keeps a running balance for every pair of members, updated in the same batch as each expense or payment, so Home reads only trip documents.",
    },
    {
      title: "Tested where it counts",
      body: "Unit tests cover splits, money, balances, and cross-trip netting, and the security rules are tested against the Firestore emulator.",
    },
  ],
} satisfies AppShowcase<SplitMoneyFeatureIcon, SplitMoneyScreenId>;
