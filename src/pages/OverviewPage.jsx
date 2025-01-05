import { BarChart2, ShoppingBag, Users, Zap,DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import SalesOverviewChart from "../components/overview/SalesOverviewChart";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import SalesChannelChart from "../components/overview/SalesChannelChart";
import { jwtDecode } from 'jwt-decode';

const OverviewPage = () => {

const token = localStorage.getItem("token")
const decodedToken = jwtDecode(token);
const role = decodedToken.role

	return (
		<>
		<Sidebar/>
		<div className='flex-1 overflow-auto relative z-10'>
		{role=="Admin" ?(
			<> 
			<Header title='Overview' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{/* STATS */}
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard name='Total Users' icon={Zap} value='12' color='#6366F1' />
					<StatCard name='Total Service' icon={Users} value='12' color='#8B5CF6' />
					<StatCard name='Total Enqury Clients' icon={ShoppingBag} value='57' color='#EC4899' />
					<StatCard name='profit' icon={DollarSign} value='12,000' color='#10B981' />
				</motion.div>

				{/* CHARTS */}
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
					<SalesOverviewChart />
					<CategoryDistributionChart />
					<SalesChannelChart />
				</div>
			</main>
		
		</> ):(<>
				<Header title='User Dashboard' />
			<div className="flex items-center justify-center h-screen">
 <h1 className="text-2xl font-semibold text-red-900">Welcome to the Dashboard .</h1>
</div>
</>)

}

</div>
		</>
	);
};
export default OverviewPage;
