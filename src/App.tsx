import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { startMockVenueEngine } from './services/mockVenueData';
import { initGoogleServices } from './services/googleIntegrations';

// Layouts
import FanLayout from './components/fan/FanLayout';
import StaffLayout from './components/staff/StaffLayout';

// Fan Views
import FanDashboard from './components/fan/FanDashboard';
import SmartNavigation from './components/fan/SmartNavigation';
import Concessions from './components/fan/Concessions';
import Merchandise from './components/fan/Merchandise';
import Parking from './components/fan/Parking';
import Transit from './components/fan/Transit';
import FanZone from './components/fan/FanZone';

// Staff Views
import OpsDashboard from './components/staff/OpsDashboard';
import StaffDispatch from './components/staff/StaffDispatch';
import SecurityFeeds from './components/staff/SecurityFeeds';
import CrowdControl from './components/staff/CrowdControl';

function App() {
  useEffect(() => {
    // Initialize mock services on mount
    initGoogleServices();
    startMockVenueEngine();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Fan Facing PWA Routes */}
        <Route path="/fan" element={<FanLayout />}>
          <Route index element={<FanDashboard />} />
          <Route path="navigate" element={<SmartNavigation />} />
          <Route path="food" element={<Concessions />} />
          <Route path="merch" element={<Merchandise />} />
          <Route path="parking" element={<Parking />} />
          <Route path="transit" element={<Transit />} />
          <Route path="zone" element={<FanZone />} />
        </Route>

        {/* Staff Dashboard Routes */}
        <Route path="/staff" element={<StaffLayout />}>
          <Route index element={<OpsDashboard />} />
          <Route path="crowd-control" element={<CrowdControl />} />
          <Route path="dispatch" element={<StaffDispatch />} />
          <Route path="feeds" element={<SecurityFeeds />} />
        </Route>

        {/* Default Redirect */}
        <Route path="*" element={<Navigate to="/fan" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
