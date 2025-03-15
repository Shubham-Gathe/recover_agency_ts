import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import MyAllocationView from 'src/sections/allocations/MyAllocationView';

export default function MyAllocations() {
  return (
    <>
      <Helmet>
        <title> {`My Allocations - ${CONFIG.appName}`}</title>
      </Helmet>
      <MyAllocationView />
    </>
  );
}
