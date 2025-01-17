

import { motion } from "framer-motion";

const StatCard = ({ name, icon: Icon, periodData, color }) => {
	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-700'
			whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
		>
			<div className='px-4 py-5 sm:p-6'>
				<span className='flex items-center text-sm font-medium text-gray-400 mb-2'>
					<Icon size={20} className='mr-2' style={{ color }} />
					{name}
				</span>
				{/* Loop through periodData to display values for each period */}
				{periodData.map(({ label, value }) => (
					<div key={label} className='flex justify-between mt-2'>
						<span className='text-sm text-gray-400'>{label}</span>
						<span className='text-sm text-gray-100'>{value || "N/A"}</span>
					</div>
				))}
			</div>
		</motion.div>
	);
};

export default StatCard;


