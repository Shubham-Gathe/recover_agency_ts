import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';

import { useEffect } from 'react';

import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import { useTheme } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';
import Drawer, { drawerClasses } from '@mui/material/Drawer';

import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { _notifications } from 'src/_mock';
import { varAlpha } from 'src/theme/styles';

import { Logo } from 'src/components/logo';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { AccountPopover } from '../components/account-popover';
import { NotificationsPopover } from '../components/notifications-popover';

import type { WorkspacesPopoverProps } from '../components/workspaces-popover';

// ----------------------------------------------------------------------

export type NavContentProps = {
  data: {
    title: string;
    path: string;
    icon: React.ReactNode;
    info?: React.ReactNode;
  }[];
  slots?: {
    topArea?: React.ReactNode;
    bottomArea?: React.ReactNode;
  };
  workspaces: WorkspacesPopoverProps['data'];
  sx?: SxProps<Theme>;
};

export function NavDesktop({
  sx,
  data,
  slots,
  workspaces,
  layoutQuery,
}: NavContentProps & { layoutQuery: Breakpoint }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        pt: 2.5,
        px: 2.5,
        top: 0,
        left: 0,
        height: 1,
        display: 'none',
        position: 'fixed',
        flexDirection: 'column',
        bgcolor: 'var(--layout-nav-bg)',
        zIndex: 'var(--layout-nav-zIndex)',
        width: 'var(--layout-nav-vertical-width)',
        borderRight: `1px solid var(--layout-nav-border-color, ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)})`,
        [theme.breakpoints.up(layoutQuery)]: {
          display: 'flex',
        },
        ...sx,
      }}
    >
      <NavContent data={data} slots={slots} workspaces={workspaces} />
    </Box>
  );
}

// ----------------------------------------------------------------------

export function NavMobile({
  sx,
  data,
  open,
  slots,
  onClose,
  workspaces,
}: NavContentProps & { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  useEffect(() => {
    if (open) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          pt: 2.5,
          px: 2.5,
          overflow: 'unset',
          bgcolor: 'var(--layout-nav-bg)',
          width: 'var(--layout-nav-mobile-width)',
          ...sx,
        },
      }}
    >
      <NavContent data={data} slots={slots} workspaces={workspaces} />
    </Drawer>
  );
}

// ----------------------------------------------------------------------

export function NavContent({ data, slots, workspaces, sx }: NavContentProps) {
  const pathname = usePathname();
    const accountData = [
                      {
                        label: 'Home',
                        href: '/',
                        icon: <Iconify width={22} icon="solar:home-angle-bold-duotone" />,
                      },
                      {
                        label: 'Profile',
                        href: '#',
                        icon: <Iconify width={22} icon="solar:shield-keyhole-bold-duotone" />,
                      },
                      {
                        label: 'Settings',
                        href: '#',
                        icon: <Iconify width={22} icon="solar:settings-bold-duotone" />,
                      },
                    ];


  return (
    <>
      <Logo />

      {slots?.topArea}
      <Scrollbar fillContent>
        <Box component="nav" display="flex" flex="1 1 auto" flexDirection="column" sx={{ ...sx, justifyContent: 'space-between' }}>
          <Box component="ul" gap={0.5} display="flex" flexDirection="column">
            {data.map((item) => {
              const isActived = item.path === pathname;

              return (
                <ListItem disableGutters disablePadding key={item.title}>
                  <ListItemButton
                    disableGutters
                    component={RouterLink}
                    href={item.path}
                    sx={{
                      pl: 2,
                      py: 1,
                      gap: 2,
                      pr: 1.5,
                      borderRadius: 0.75,
                      typography: 'body2',
                      fontWeight: 'fontWeightMedium',
                      color: 'var(--layout-nav-item-color)',
                      minHeight: 'var(--layout-nav-item-height)',
                      ...(isActived && {
                        fontWeight: 'fontWeightSemiBold',
                        bgcolor: 'var(--layout-nav-item-active-bg)',
                        color: 'var(--layout-nav-item-active-color)',
                        '&:hover': {
                          bgcolor: 'var(--layout-nav-item-hover-bg)',
                        },
                      }),
                    }}
                  >
                    <Box component="span" sx={{ width: 24, height: 24 }}>
                      {item.icon}
                    </Box>

                    <Box component="span" flexGrow={1}>
                      {item.title}
                    </Box>

                    {item.info && item.info}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </Box>

            {/* Bottom Area Slot - if available, put Notifications and Account here */}
            {slots?.bottomArea ? (
                <Box component="ul" gap={0.5} display="flex" flexDirection="column" sx={{ mt: 2 }}>
                    <ListItem key="notifications" disableGutters disablePadding>
                        <Box sx={{ pl: 2, py: 1, gap: 2, pr: 1.5, borderRadius: 0.75, minHeight: 'var(--layout-nav-item-height)', display: 'flex', alignItems: 'center', color: 'var(--layout-nav-item-color)' }}>
                            <NotificationsPopover data={_notifications} />
                            <Typography sx={{ ml: 1 }}>Notifications</Typography>
                        </Box>
                    </ListItem>

                    <ListItem key="account" disableGutters disablePadding>
                        <Box sx={{ pl: 2, py: 1, gap: 2, pr: 1.5, borderRadius: 0.75, minHeight: 'var(--layout-nav-item-height)', display: 'flex', alignItems: 'center', color: 'var(--layout-nav-item-color)' }}>
                            <AccountPopover data={accountData} />
                            <Typography sx={{ ml: 1 }}>Account</Typography>
                        </Box>
                    </ListItem>
                </Box>
            ) : (
                // If no bottomArea slot, place them at the very bottom of the nav
                <Box component="ul" gap={0.5} display="flex" flexDirection="column" sx={{ mt: 2 }}>
                    <ListItem key="notifications" disableGutters disablePadding>
                        <Box sx={{ pl: 2, py: 1, gap: 2, pr: 1.5, borderRadius: 0.75, minHeight: 'var(--layout-nav-item-height)', display: 'flex', alignItems: 'center', color: 'var(--layout-nav-item-color)' }}>
                            <NotificationsPopover data={_notifications} />
                            <Typography sx={{ ml: 1 }}>Notifications</Typography>
                        </Box>
                    </ListItem>

                    <ListItem key="account" disableGutters disablePadding>
                        <Box sx={{ pl: 2, py: 1, gap: 2, pr: 1.5, borderRadius: 0.75, minHeight: 'var(--layout-nav-item-height)', display: 'flex', alignItems: 'center', color: 'var(--layout-nav-item-color)' }}>
                            <AccountPopover data={accountData} />
                            <Typography sx={{ ml: 1 }}>Account</Typography>
                        </Box>
                    </ListItem>
                </Box>
            )}


        </Box>
      </Scrollbar>

      {slots?.bottomArea && null} {/* Conditionally render bottomArea slot if not used above for Notifications/Account, otherwise, render nothing to avoid duplication */}
    </>
  );
}