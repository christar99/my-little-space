import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useAtom } from 'jotai';
import { needAccount, startMenuToggle } from 'store';
import Login from 'components/units/Login';
import StartMenu from 'components/units/StartMenu';
import Icons from 'components/units/Icons';
import Programs from 'components/units/Programs';

export default function Viewport() {
	const [toggleOn, setToggleOn] = useAtom(startMenuToggle);
	const [account, setLogin] = useAtom(needAccount);
	const handleToggle = () => {
		setToggleOn(false);
	};

	useEffect(() => {
		const loginAccount = localStorage.getItem('account');
		if (loginAccount !== null) {
			setLogin(loginAccount);
		}
	}, []);

	return (
		<>
			{account === null ? (
				<Login />
			) : (
				<Screen>
					<Desktop onClick={handleToggle} onMouseUp={(e) => e.preventDefault()}>
						<Icons />
						<Programs />
					</Desktop>
					<StartMenu />
				</Screen>
			)}
		</>
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
