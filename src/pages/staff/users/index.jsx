import React, { useState } from 'react';
import styled from 'styled-components';

const Index = () => {
  // Define the list as an array
  const list = ['Total Users', 'Enquire Users', 'Bill Form']; // Replace with actual data

  return (
    <Container>
      <ContainerWrap>
        <Left>
          {list.map((item, index) => (
            <div key={index}>
              <div>{item}</div>
            </div>
          ))}
        </Left>
        <Right>
          <h1>Content Goes Here</h1>
        </Right>
      </ContainerWrap>
    </Container>
  );
};

export default Index;

// Styled Components
const Container = styled.div`
  background-color: red;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ContainerWrap = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  background-color: #034c8c;
  max-width: 1500px;
  width: 100%;
`;

const Left = styled.div`
  width: 20%;
  background-color: pink;
`;

const Right = styled.div`
  width: 80%;
  background-color: yellow;
`;
