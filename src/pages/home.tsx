import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useSelector } from 'react-redux';

import { OverviewAnalyticsView } from 'src/sections/overview/view';
import { RootState } from 'src/store/store';

import UserDashboard from './user-dashboard';

// ----------------------------------------------------------------------

export default function Page() {
  const user = useSelector((state: RootState) => state?.auth?.user);
  return (
    <>
      <Helmet>
        <title> {`Dashboard - ${CONFIG.appName}`}</title>
      </Helmet>
      {user?.type !== 'Admin' ?
        (
          <UserDashboard />
        ) : (
          <OverviewAnalyticsView />
        )}
    </>
  );
}
