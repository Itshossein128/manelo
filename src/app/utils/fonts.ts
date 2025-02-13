import { Plus_Jakarta_Sans } from "next/font/google";
import localFont from "next/font/local";

export const plusJakartaSans = Plus_Jakarta_Sans({
    subsets: ["latin"]
})

export const timesNewRoman = localFont({
    src: [
        {
            path: "../../../public/times-new-roman/times-new-roman.ttf",
            weight: "400",
            style: "normal",
        },
        {
            path: "../../../public/times-new-roman/times-new-roman-italic.ttf",
            weight: "400",
            style: "italic",
        },
        {
            path: "../../../public/times-new-roman/times-new-roman-bold.ttf",
            weight: "700",
            style: "normal",
        },
        {
            path: "../../../public/times-new-roman/times-new-roman-bold-italic.ttf",
            weight: "700",
            style: "italic",
        },
    ],
});