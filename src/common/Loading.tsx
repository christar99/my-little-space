import React from 'react';
import styled from 'styled-components';

function Loading() {
	return <LoadingScreen>컴퓨터 켜는 중...</LoadingScreen>;
}

const LoadingScreen = styled.div`
	width: 100vw;
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 4rem;
	background-color: #3b5998;
	color: #e5e5e5;
`;

export default Loading;
