import React, { useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { useAtom } from 'jotai';
import { needAccount, setDarkModeAtom, startMenuToggle } from 'store';
import { darkTheme, lightTheme } from 'utils/theme';
import Login from 'components/units/Login';
import StartMenu from 'components/units/StartMenu';
import WallpaperIcons from 'components/units/WallpaperIcons';
import Programs from 'components/units/Programs';

export default function Viewport() {
	const [toggleOn, setToggleOn] = useAtom(startMenuToggle);
	const [account, setLogin] = useAtom(needAccount);
	const [darkMode, setDarkMode] = useAtom(setDarkModeAtom);

	const handleToggle = () => {
		setToggleOn(false);
	};

	useEffect(() => {
		const loginAccount = localStorage.getItem('account');
		const isDarkMode = localStorage.getItem('darkMode') === 'true';
		if (loginAccount !== null) {
			setLogin(loginAccount);
		}
		if (isDarkMode) {
			setDarkMode(isDarkMode);
		}
	}, []);

	return (
		<ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
			{account === null ? (
				<Login />
			) : (
				<Screen>
					<Desktop onClick={handleToggle} onMouseUp={(e) => e.preventDefault()}>
						<WallpaperIcons />
						<Programs />
					</Desktop>
					<StartMenu />
				</Screen>
			)}
		</ThemeProvider>
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
`;
