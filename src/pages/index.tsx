import Loading from 'common/Loading';
import React, { Suspense, useState } from 'react';
import styled from 'styled-components';

interface ViewportTypes {
	children: React.ReactNode;
}

export default function Viewport({ children }: ViewportTypes) {
	const [loading, setLoading] = useState<boolean>(false);
	return (
		<Suspense fallback={<Loading />}>
			<Screen>
				<Desktop>{children}</Desktop>
				<StartMenu></StartMenu>
			</Screen>
		</Suspense>
	);
}

const Screen = styled.div`
	width: 100vw;
	height: 100vh;
	background-color: #000;
	color: #fff;
	font-size: 1rem;
	position: relative;
`;

const Desktop = styled.div``;

const StartMenu = styled.div`
	width: 100%;
	height: 40px;
	background-color: #aaa;
	position: absolute;
	bottom: 0;
	z-index: 101;
`;
