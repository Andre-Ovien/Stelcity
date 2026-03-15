const BASE_URL = process.env.NEXT_PUBLIC_API_URL || ""


export async function getServices() {
  return [
    {
      id: 1,
      category: "Body Wash",
      items: [
        { id: "bw1", name: "Body Polish Body Wash" },
        { id: "bw2", name: "Whitening Body Wash" },
        { id: "bw3", name: "Instant Knuckles Wash" },
        { id: "bw4", name: "Pedicure" },
        { id: "bw5", name: "Instant Whitening Foot" },
      ],
    },
    {
      id: 2,
      category: "Removal",
      items: [
        { id: "re1", name: "Hair Removal" },
        { id: "re2", name: "Tattoo Removal" },
      ],
    },
    {
      id: 3,
      category: "Dental Care",
      items: [
        { id: "dc1", name: "Teeth Whitening" },
        { id: "dc2", name: "Dental Cleaning" },
      ],
    },
    {
      id: 4,
      category: "Facials Treatment",
      items: [
        { id: "ft1", name: "Deep Cleansing Facial" },
        { id: "ft2", name: "Anti-Aging Facial" },
        { id: "ft3", name: "Brightening Facial" },
      ],
    },
    {
      id: 5,
      category: "Massage",
      items: [
        { id: "ma1", name: "Full Body Massage" },
        { id: "ma2", name: "Hot Stone Massage" },
      ],
    },
    {
      id: 6,
      category: "Advanced Aesthetics",
      items: [
        { id: "aa1", name: "Microneedling" },
        { id: "aa2", name: "Chemical Peel" },
        { id: "aa3", name: "LED Light Therapy" },
      ],
    },
  ]
}