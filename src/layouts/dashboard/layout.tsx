import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';

import { useTheme } from '@mui/material/styles';

import { Main } from './main';
import { NavDesktop } from './nav';
import { layoutClasses } from '../classes';
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

  // const [navOpen, setNavOpen] = useState(false);

  const layoutQuery: Breakpoint = 'lg';

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
        [`& .${layoutClasses.hasSidebar}`]: {
          [theme.breakpoints.up(layoutQuery)]: {
            pl: 'var(--layout-nav-vertical-width)',
          },
        },
        ...sx,
      }}
    >
      {/*  ⭐️ ADD paddingTop to the Main component here */}
      <Main sx={{ paddingTop: theme.mixins.toolbar }}>
        {children}
      </Main>
    </LayoutSection>
  );
}