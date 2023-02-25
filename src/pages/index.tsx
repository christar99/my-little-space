import React, { Suspense } from 'react';
import styled from 'styled-components';
import Loading from 'common/Loading';
import StartMenu from 'components/units/StartMenu';
import { useAtom } from 'jotai';
import { startMenuToggle } from 'store';
import Icons from 'components/units/Icons';

export default function Viewport() {
	const [toggleOn, setToggleOn] = useAtom(startMenuToggle);
	const handleToggle = () => {
		setToggleOn(false);
	};
	return (
		<Suspense fallback={<Loading />}>
			<Screen>
				<Desktop onClick={handleToggle}>
					<Icons />
				</Desktop>
				<StartMenu />
			</Screen>
		</Suspense>
	);
}

const Screen = styled.div`
	width: 100vw;
	height: 100vh;
	position: relative;
	overflow: hidden;
`;

const Desktop = styled.div`
	width: 100%;
	height: calc(100% - 40px);
	background-color: #000;
`;
