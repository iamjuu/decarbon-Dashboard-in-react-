import { useState } from "react";
import { motion } from "framer-motion";
import styled, { createGlobalStyle } from 'styled-components';
import LeftSideBar from '../home/LeftSideBar';
import StatCard from "../../../components/common/StatCard";
import {  ShoppingBag, Users, Zap, } from "lucide-react";
import UsersTable from "../../../components/users/UsersTable";

const Index = () => {
    const userData = [
        {
          id: 1,
          name: "Muhammed Ajmal CC",
          phone: "7025715250",
          vehicleType: "Bike",
          vehiclenumber: "KL 13 AQ 1596",
          itemsname: "Pulser",
          Quantity: "1",
          Price: "2118.64",
          Discount: "83.158%",
          Gst: "64.24(18.0%)",
          Amount: "4210",
        },
        {
          id: 1,
          name: "Muhammed  CC",
          phone: "7025715250",
          vehicleType: "Bike",
          vehiclenumber: "KL 13 AQ 1596",
          itemsname: "Pulser",
          Quantity: "1",
          Price: "2118.64",
          Discount: "83.158%",
          Gst: "64.24(18.0%)",
          Amount: "4210",
        },
      ];

  return (
    <>
      <Container>
        <Left>
          <LeftSideBar />
          </Left>

<Right>
        <BoxContainer>
		<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard name='Total Users' icon={Zap} value='12' color='#6366F1' />
					<StatCard name='Total Service' icon={Users} value='12' color='#8B5CF6' />
					<StatCard name='Total Enqury Clients' icon={ShoppingBag} value='57' color='#EC4899' />
				</motion.div>
        </BoxContainer>
        <UserContainer>
        <UsersTable userData={userData} />

        </UserContainer>

          </Right>
      </Container>
    </>
  );
};

export default Index;



// Styled Components
const Container = styled.div`
  width: 100%;
  justify-content: center;
  height: 100vh; /* Full height of the viewport */
  display: flex;
`;

const Left = styled.div`
  width: 20%;
  display: flex;
  background-color:#262f3a;
`;

const Right = styled.div`
  width: 80%;
  background-color: #232c38;

`
const BoxContainer= styled.div`
padding: 10px;
margin-top: 50px;
    width: 100%;

`

const UserContainer = styled.div`
    width: 100%;
`