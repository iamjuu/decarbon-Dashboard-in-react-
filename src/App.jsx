import { Route, Routes } from "react-router-dom";
import Sidebar from "./components/common/Sidebar"
import OverviewPage from "./pages/OverviewPage";
import RequestPage from "./pages/RequestPage";
import UsersPage from "./pages/UsersPage";
import SalesPage from "./pages/SalesPage";
import OrdersPage from "./pages/OrdersPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import PersonalPage from "./pages/personDetails";
// import TotallistExel from "./pages/fullDetails"

function App() {
	return (
		<div className='flex h-screen bg-gray-900 text-gray-100 overflow-hidden'>
			{/* <div className='fixed inset-0 z-0'>
				<div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80' />
				<div className='absolute inset-0 backdrop-blur-sm' />
			</div> */}

			<Sidebar />
			<Routes>
				<Route path='/' element={<OverviewPage />} />
				<Route path='/RequestPage' element={<RequestPage />} />
				<Route path='/users' element={<UsersPage />} />
				<Route path='/sales' element={<SalesPage />} />
				<Route path='/orders' element={<OrdersPage />} />
				<Route path='/analytics' element={<AnalyticsPage />} />
				<Route path='/settings' element={<SettingsPage />} />
				<Route path='/client-details' element={<PersonalPage />} />


			</Routes>
		</div>
	);
}

export default App;
