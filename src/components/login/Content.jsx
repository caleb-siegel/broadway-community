import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import AutoFixHighRoundedIcon from "@mui/icons-material/AutoFixHighRounded";
import ConstructionRoundedIcon from "@mui/icons-material/ConstructionRounded";
import SettingsSuggestRoundedIcon from "@mui/icons-material/SettingsSuggestRounded";
import ThumbUpAltRoundedIcon from "@mui/icons-material/ThumbUpAltRounded";

import { SitemarkIcon } from "./CustomIcons";

const items = [
  {
    icon: <SettingsSuggestRoundedIcon sx={{ color: "text.secondary" }} />,
    title: "Making Broadway Accessible",
    description:
      "As a young professional with a love of Broadway Theater, I tried to find ways to make seeing shows more affordable. I quickly noticed that Stubhub tickets get cheaper as the show gets closer, so I made this site to pass this info on to you.",
  },
  {
    icon: <ConstructionRoundedIcon sx={{ color: "text.secondary" }} />,
    title: "Set Alerts",
    description:
      "No need to monitor this site constantly. Just create an account and set show (i.e. Hamilton) or category (i.e. all of Broadway) alerts to be notified when there are tickets available at your desired price.",
  },
  // {
  //   icon: <ThumbUpAltRoundedIcon sx={{ color: 'text.secondary' }} />,
  //   title: 'Great user experience',
  //   description:
  //     'Integrate our product into your routine with an intuitive and easy-to-use interface.',
  // },
  // {
  //   icon: <AutoFixHighRoundedIcon sx={{ color: 'text.secondary' }} />,
  //   title: 'Innovative functionality',
  //   description:
  //     'Stay ahead with features that set new standards, addressing your evolving needs better than the rest.',
  // },
];

export default function Content() {
  return (
    <Stack
      sx={{
        flexDirection: "column",
        alignSelf: "center",
        gap: 4,
        maxWidth: 450,
      }}
    >
      <Box sx={{ display: { xs: "none", md: "flex" } }}>
        {/* <SitemarkIcon /> */}
        <img style={{ height: 30, width: 30 }} src="/theater.png"></img>
        <p style={{ margin: 5 }}>Broadway Community</p>
      </Box>
      {items.map((item, index) => (
        <Stack key={index} direction="row" sx={{ gap: 2 }}>
          {item.icon}
          <div>
            <Typography gutterBottom sx={{ fontWeight: "medium" }}>
              {item.title}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {item.description}
            </Typography>
          </div>
        </Stack>
      ))}
    </Stack>
  );
}
