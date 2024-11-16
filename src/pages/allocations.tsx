import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import AllocationView  from 'src/sections/allocations/AllocationView';

// ----------------------------------------------------------------------

export default function Allocations() {
  return (
    <>
      <Helmet>
        <title> {`Allocations - ${CONFIG.appName}`}</title>
      </Helmet>
      <AllocationView />
    </>
  );
}
