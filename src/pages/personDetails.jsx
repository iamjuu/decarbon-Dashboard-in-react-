import React ,{useState}from 'react'
import { motion } from "framer-motion";
import { UserCheck, UserPlus, UsersIcon,DollarSign  } from "lucide-react";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import PersonalTable from "../components/users/personalTable";
import UserGrowthChart from "../components/users/UserGrowthChart";
import UserActivityHeatmap from "../components/users/UserActivityHeatmap";
import UserDemographicsChart from "../components/users/UserDemographicsChart";
const personDetails = () => {
    const userData = [
        { id: 1, name: "John Doe", email: "john@example.com", role: "Customer", status: "Active" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Admin", status: "Active" },
        { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Customer", status: "Inactive" },
        { id: 4, name: "Alice Brown", email: "alice@example.com", role: "Customer", status: "Active" },
        { id: 5, name: "Charlie Wilson", email: "charlie@example.com", role: "Moderator", status: "Active" },
    ];
    const userStats = {
        totalUsers: 243,
        totalServices: 243,
        enquryClients: 20,
        totalprofit: 10000,
    };
    const [searchTerm, setSearchTerm] = useState("");
        const [filteredUsers, setFilteredUsers] = useState(userData);
    
        const handleSearch = (e) => {
            const term = e.target.value.toLowerCase();
            setSearchTerm(term);
            const filtered = userData.filter(
                (user) => user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term)
            );
            setFilteredUsers(filtered);
        };
    
  return (
<div className='flex-1 overflow-auto relative z-10'>
			<Header title='personal Bill' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{/* STATS */}
				

				<PersonalTable />

				{/* USER CHARTS */}
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8'>
					<UserGrowthChart />
					<UserActivityHeatmap />
					<UserDemographicsChart />
				</div>
			</main>
		</div>
  )
}

export default personDetails
