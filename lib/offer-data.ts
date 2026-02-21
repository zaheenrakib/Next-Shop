import { Offer } from "../types";

export const offers: Offer[] = [
  {
    id: "off-1",
    title: "Eid Tech Carnival - Only on MyBL App!",
    slug: "eid-tech-carnival",
    description: "Shop Star Tech via MyBL App & Win Prizes!",
    image:
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&h=800&fit=crop", // Replace with real image if possible
    startDate: "19 Feb 2026",
    endDate: "20 Mar 2026",
    status: "Online",
    details:
      "During this Eid season, shop your favorite tech gadgets through the MyBL app and participate in our Tech Carnival to win exciting prizes. Every purchase gives you a chance to win!",
    terms: [
      "Offer valid only for purchases made via MyBL app.",
      "Stock is limited and subject to availability.",
      "Offer ends on March 20th, 2026.",
    ],
  },
  {
    id: "off-2",
    title: "Ramadan Deals",
    slug: "ramadan-deals",
    description:
      "Get Amazing Discount, Bkash Cashback, and Free Home Delivery on Ramadan Deal!",
    image:
      "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=800&h=800&fit=crop",
    startDate: "18 Feb 2026",
    endDate: "20 Mar 2026",
    status: "Online",
    details:
      "Celebrate the holy month of Ramadan with exclusive discounts on processors, motherboards, graphics cards, and more. Enjoy additional cashback when paying with bKash and free home delivery for all online orders.",
    terms: [
      "Cashback applicable for payments via bKash only.",
      "Free delivery applies to all online orders within the campaign period.",
      "Not applicable with other ongoing promotions.",
    ],
  },
  {
    id: "off-3",
    title: "Ceiling Fan Deal",
    slug: "ceiling-fan-deal",
    description: "Buy Your Ceiling Fan & Get Exciting Discounts!",
    image:
      "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?w=800&h=800&fit=crop",
    startDate: "10 Feb 2026",
    endDate: "22 Mar 2026",
    status: "Online",
    details:
      "Beat the heat this summer! Buy top-brand ceiling fans from NextShop and enjoy up to ৳10,000 discount on selected models.",
    terms: [
      "Discount varies based on the model and brand.",
      "Offer valid at all NextShop online and offline stores.",
      "While stocks last.",
    ],
  },
];
