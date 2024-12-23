import { UserCheck, UserPlus, UsersIcon, UserX,DollarSign  } from "lucide-react";
import { motion } from "framer-motion";
import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import UsersTable from "../components/users/UsersTable";
import UserGrowthChart from "../components/users/UserGrowthChart";
import UserActivityHeatmap from "../components/users/UserActivityHeatmap";
import UserDemographicsChart from "../components/users/UserDemographicsChart";

const userStats = {
	totalUsers: 243,
	totalServices: 243,
	enquryClients: 20,
	totalprofit: 10000,
};

const UsersPage = () => {
	return (
		<>
		
<Sidebar/>
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Users' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{/* STATS */}
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard
						name='Total Users'
						icon={UsersIcon}
						value={userStats.totalUsers.toLocaleString()}
						color='#6366F1'
					/>
					<StatCard name='Total Services' icon={UserPlus} value={userStats.totalServices} color='#b91010' />
					<StatCard
						name='Enqury Clients'
						icon={UserCheck}
						value={userStats.enquryClients.toLocaleString()}
						color='#F59E0B'
					/>
					<StatCard name='Total profit' icon={DollarSign} value={userStats.totalprofit} color='#10B981' />
				</motion.div>

				<UsersTable />

				{/* USER CHARTS */}
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8'>
					<UserGrowthChart />
					<UserActivityHeatmap />
					<UserDemographicsChart />
				</div>
			</main>
		</div>
		</>
	);
};
export default UsersPage;
