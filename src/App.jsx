import { Route, Router, Routes } from "react-router-dom";
// import Sidebar from "./components/common/Sidebar";
import OverviewPage from "./pages/OverviewPage";
import UsersPage from "./pages/UsersPage";
import SettingsPage from "./pages/SettingsPage";
import PersonalPage from "./pages/personDetails";
import ShafBillForm from './pages/staff/form';
import Login from './components/login'
import './App.css'
function App() {
	return (
		<>
<Routes>
	<Route path="/login" element={<Login/>}/>
</Routes>
	
		<div className='  flex  bg-gray-900 text-gray-100  '>
			<Routes>
				<Route path='/' element={<OverviewPage />} />
				<Route path='/users' element={<UsersPage />} />
				<Route path='/settings' element={<SettingsPage />} />
				<Route path='/client-details' element={<PersonalPage />} />
				<Route path='/staffs-bill-form' element={<ShafBillForm />} />
			</Routes>
		</div>

		</>
	);
}
export default App;