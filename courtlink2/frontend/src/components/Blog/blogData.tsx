import { Blog } from "@/types/blog";

const blogData: Blog[] = [
  {
    id: 1,
    title: "Legal Resource Center",
    paragraph:
      "A hub of articles, guides, and resources to help navigate legal challenges.",
    image: "/images/blog/blog-01.jpg",
    author: {
      name: "Sakshi Joshi",
      image: "/images/blog/author-01.png",
      designation: "Criminal Lawyer",
    },
    tags: ["Resources and Info"],
    publishDate: "2025",
  },
  {
    id: 2,
    title: "Court Link Learning Center",
    paragraph:
      "Practical guides, legal news, and advice for navigating the justice system.",
    image: "/images/blog/blog-02.jpg",
    author: {
      name: "Muzamil Khan",
      image: "/images/blog/author-02.png",
      designation: "Legal Consultant",
    },
    tags: ["Documentation"],
    publishDate: "2025",
  },
  {
    id: 3,
    title: "Empowerment Zone",
    paragraph:
      "Tips, advice, and knowledge to help undertrials and those who support them.",
    image: "/images/blog/blog-03.jpg",
    author: {
      name: "Lakshman Deo",
      image: "/images/blog/author-03.png",
      designation: "Social Justice Advocate",
    },
    tags: ["Empowerment"],
    publishDate: "2025",
  },
];
export default blogData;
