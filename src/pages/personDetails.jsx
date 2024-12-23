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
   
    
  return (
<div className='flex-1 overflow-auto relative z-10'>
			<Header title='personal Bill' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{/* STATS */}
				

				<PersonalTable />
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
