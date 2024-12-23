import React, { useState } from 'react'
import styled from 'styled-components'
const index = () => {
const list={
totalUser,
enquireUser,
billForm

  }


  return (
    <Container>
      <ContainerWrap>
  <Left>
    {list.map(item,index)=>(
      <div key={index}>
        <div>
          {list.item}
        </div>

      </div>
    )}
  </Left>
  <Right><h1>asfsd</h1></Right>
      </ContainerWrap>
    </Container>
  )
}

export default index


const Container = styled.div`
  background-color: red;
  width: 100%;
display: flex;
justify-content: center;
align-items: center;
`

const ContainerWrap = styled.div`
display: flex;
justify-content: center;
gap: 10px;
/* align-items: center; */
background-color: #034c8c;
max-width :1500px ;
width: 100%;


`
const Left = styled.div`
  width: 20%;

background-color: pink;
`
const Right = styled.div`
  width: 80%;
  background-color: yellow;
`