import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';

import { useState } from 'react';

import { IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';

import { Main } from './main';
import { layoutClasses } from '../classes';
import { NavMobile, NavDesktop } from './nav';
import { useNavData } from '../components/nav-item';
import { _workspaces } from '../config-nav-workspace';
import { LayoutSection } from '../core/layout-section';

// ----------------------------------------------------------------------

export type DashboardLayoutProps = {
  sx?: SxProps<Theme>;
  children: React.ReactNode;
  header?: {
    sx?: SxProps<Theme>;
  };
};

export function DashboardLayout({ sx, children, header }: DashboardLayoutProps) {
  const theme = useTheme();

  const [navOpen, setNavOpen] = useState(false); // State to control mobile nav visibility

  const layoutQuery: Breakpoint = 'lg';

  const handleOpenNav = () => {
    setNavOpen(true);
  };

  const handleCloseNav = () => {
    setNavOpen(false);
  };

  return (
    <LayoutSection
      /** **************************************
       * Header
       *************************************** */

      /** **************************************
       * Sidebar
       *************************************** */
      sidebarSection={
        <NavDesktop data={useNavData()} layoutQuery={layoutQuery} workspaces={_workspaces} />
      }
      /** **************************************
       * Footer
       *************************************** */
      footerSection={null}
      /** **************************************
       * Style
       *************************************** */
      cssVars={{
        '--layout-nav-vertical-width': '250PX',
        '--layout-dashboard-content-pt': theme.spacing(1),
        '--layout-dashboard-content-pb': theme.spacing(8),
        '--layout-dashboard-content-px': theme.spacing(5),
      }}
      sx={{
        [`& .${layoutClasses.main}`]: {
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          [theme.breakpoints.down(layoutQuery)]: {
            ml: 0, // Remove left margin on smaller screens
          },
        },
        [`& .${layoutClasses.hasSidebar}`]: {
          [theme.breakpoints.up(layoutQuery)]: {
            pl: 'var(--layout-nav-vertical-width)',
            transition: theme.transitions.create('margin', {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
        },
        ...sx,
      }}
    >
      {/* Hamburger menu for mobile */}
      <IconButton
        onClick={handleOpenNav}
        sx={{
          position: 'fixed',
          left: 16,
          bottom: (() => {
            const toolbarHeight = theme.mixins.toolbar?.minHeight;
            const height:any = toolbarHeight ?? 56;
            return (height / 2 - 16);
          })(),
          zIndex: theme.zIndex.mobileStepper + 1,
          display: { lg: 'none' }, // Hide on larger screens
        }}
      >
        <Iconify icon="eva:menu-2-fill" width={40} height={32} />
      </IconButton>

      {/* Mobile navigation drawer */}
      <NavMobile
        open={navOpen}
        onClose={handleCloseNav}
        data={useNavData()}
        workspaces={_workspaces}
      />

      {/* ⭐️ ADD paddingTop to the Main component here */}
      <Main sx={{ paddingTop: theme.mixins.toolbar }}>
        {children}
      </Main>
    </LayoutSection>
  );
}