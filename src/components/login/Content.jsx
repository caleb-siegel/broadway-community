import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import AutoFixHighRoundedIcon from '@mui/icons-material/AutoFixHighRounded';
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';
import SettingsSuggestRoundedIcon from '@mui/icons-material/SettingsSuggestRounded';
import ThumbUpAltRoundedIcon from '@mui/icons-material/ThumbUpAltRounded';

import { SitemarkIcon } from './CustomIcons';

const items = [
  {
    icon: <SettingsSuggestRoundedIcon sx={{ color: 'text.secondary' }} />,
    title: 'Find great deals',
    description:
      'Find great deals on Stubhub for tonight or specific shows at any point.',
  },
  {
    icon: <ConstructionRoundedIcon sx={{ color: 'text.secondary' }} />,
    title: 'Set preferences',
    description:
      'Create an account and save preferences based on category or event to be notified when your event is selling at, or below, that price.',
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
      sx={{ flexDirection: 'column', alignSelf: 'center', gap: 4, maxWidth: 450 }}
    >
      <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
        {/* <SitemarkIcon /> */}
        <img style={{ height: 30, width: 30, }} src="/theater.png"></img>
        <p style={{ margin: 5, }}>Broadway Community</p>
      </Box>
      {items.map((item, index) => (
        <Stack key={index} direction="row" sx={{ gap: 2 }}>
          {item.icon}
          <div>
            <Typography gutterBottom sx={{ fontWeight: 'medium' }}>
              {item.title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {item.description}
            </Typography>
          </div>
        </Stack>
      ))}
    </Stack>
  );
}