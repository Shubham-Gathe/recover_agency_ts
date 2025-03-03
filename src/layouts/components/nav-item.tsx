import { useSelector } from 'react-redux';
import { RootState } from 'src/store/store';
import { SvgColor } from 'src/components/svg-color';
import { ReactNode } from 'react';
import GroupIcon from '@mui/icons-material/Group';
import PivotTableChartIcon from '@mui/icons-material/PivotTableChart';
import TableChartIcon from '@mui/icons-material/TableChart';
import DashboardIcon from '@mui/icons-material/Dashboard';
// Define the structure for navigation items
interface NavItem {
  title: string;
  path: string;
  icon: ReactNode; 
  info?: ReactNode;
}

// Icon helper function
const icon = (name: string): ReactNode => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const useNavData = (): NavItem[] => {
  const userRole = useSelector((state: RootState) => state.auth.user?.role || '');

  // Common links for all users
  const commonNav: NavItem[] = [
    {
      title: 'Dashboard',
      path: '/',
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
      path: '/dashboard/user',
      icon: <GroupIcon/>,
    },
    {
      title: 'Allocations',
      path: '/dashboard/allocations',
      icon: <TableChartIcon/>,
    },
    {
      title: 'Pivot Reports',
      path: 'dashboard/pivot-reports',
      icon: <PivotTableChartIcon/>,
    },
  ];

  // Regular user-specific links
  const userNav: NavItem[] = [
    {
      title: 'My Allocations',
      path: '/dashboard/my-allocations',
      icon: <TableChartIcon/>,
    },
  ];

  return [...commonNav, ...(userRole === 'Admin' ? adminNav : userNav)];
};
