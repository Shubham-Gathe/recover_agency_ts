import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Import useSelector
import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { varAlpha } from 'src/theme/styles';
import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';
import Allocations from 'src/pages/allocations'
import MyAllocations from 'src/pages/my-allocations'
import PivotTable from 'src/sections/pivot/PivotTable';
// ----------------------------------------------------------------------

export const HomePage = lazy(() => import('src/pages/home'));
export const UserPage = lazy(() => import('src/pages/user'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

const renderFallback = (
  <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

// Protect routes for authenticated users
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated); // Get authentication state from Redux

  if (!isAuthenticated) {
    // Redirect to sign-in if not authenticated
    return <Navigate to="/" replace />;
  }

  return children;
};
export function Router() {
  return useRoutes([
    {
      path: '/',
      element: (
        <AuthLayout>
          <SignInPage />
        </AuthLayout>
      ),
    },
    {
      element: (
        <ProtectedRoute>
          <DashboardLayout>
            <Suspense fallback={renderFallback}>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        </ProtectedRoute>
      ),
      children: [
        { path: '/dashboard', element: <HomePage />, index: true },
        { path: '/dashboard/user', element: <UserPage /> },
        { path:'dashboard/allocations',element: <Allocations/>},
        { path:'dashboard/my-allocations',element: <MyAllocations/>},
        { path:'dashboard/pivot-reports',element: <PivotTable/>}
      ],
    },
    {
      path: '/404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}

