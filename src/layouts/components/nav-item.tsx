import type { ReactNode } from 'react';
import type { RootState } from 'src/store/store';

import { useSelector } from 'react-redux';

import GroupIcon from '@mui/icons-material/Group';
import BarChartIcon from '@mui/icons-material/BarChart';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TableChartIcon from '@mui/icons-material/TableChart';
import PivotTableChartIcon from '@mui/icons-material/PivotTableChart';

// Define the structure for navigation items
interface NavItem {
  title: string;
  path: string;
  icon: ReactNode; 
  info?: ReactNode;
}

// Icon helper function
// const icon = (name: string): ReactNode => (
//   <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
// );

export const useNavData = (): NavItem[] => {
  // @ts-ignore
  const userRole = useSelector((state: RootState) => state.auth.user?.type || '');

  // Common links for all users
  const commonNav: NavItem[] = [
    {
      title: 'Dashboard',
      path: '/maa_sharda_app/',
      icon: <DashboardIcon/>,
    },
    // {
    //   title: 'Profile',
    //   path: '/dashboard/profile',
    //   icon: icon('ic-user'),
    // },
  ];

  // Admin-specific links
  const adminNav: NavItem[] = [
    {
      title: 'All Users',
      path: '/maa_sharda_app/dashboard/user',
      icon: <GroupIcon/>,
    },
    {
      title: 'Allocations',
      path: '/maa_sharda_app/dashboard/allocations',
      icon: <TableChartIcon/>,
    },
    {
      title: 'Pivot Chart',
      path: '/maa_sharda_app/dashboard/pivot-reports',
      icon: <PivotTableChartIcon/>,
    },
    {
      title: 'Attendances',
      path: '/maa_sharda_app/dashboards/attendances',
      icon: <BarChartIcon />,
    },
  ];
  
  // Regular user-specific links
  const userNav: NavItem[] = [
    {
      title: 'My Allocations',
      path: '/maa_sharda_app/dashboard/my-allocations',
      icon: <TableChartIcon/>,
    },
  ];

  return [...commonNav, ...(userRole === 'Admin' ? adminNav : userNav)];
};
