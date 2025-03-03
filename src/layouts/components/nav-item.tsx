import { useSelector } from 'react-redux';
import { RootState } from 'src/store/store';
import { SvgColor } from 'src/components/svg-color';
import { ReactNode } from 'react';

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
      icon: icon('ic-analytics'),
    },
    {
      title: 'Profile',
      path: '/dashboard/profile',
      icon: icon('ic-user'),
    },
  ];

  // Admin-specific links
  const adminNav: NavItem[] = [
    {
      title: 'All Users',
      path: '/dashboard/user',
      icon: icon('ic-user'),
    },
    {
      title: 'Allocations',
      path: '/dashboard/allocations',
      icon: icon('ic-user'),
    },
    {
      title: 'Pivot Reports',
      path: 'dashboard/pivot-reports',
      icon: icon('ic-user'),
    },
  ];

  // Regular user-specific links
  const userNav: NavItem[] = [
    {
      title: 'My Allocations',
      path: '/dashboard/my-allocations',
      icon: icon('ic-folder'),
    },
  ];

  return [...commonNav, ...(userRole === 'Admin' ? adminNav : userNav)];
};
