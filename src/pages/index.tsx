import React, { useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { useAtom } from 'jotai';
import {
	accountAtom,
	setDarkModeAtom,
	setFontStyleAtom,
	setResolutionAtom,
	startMenuToggle
} from 'store';
import { darkTheme, lightTheme } from 'utils/theme';
import Login from 'components/units/Login';
import StartMenu from 'components/units/StartMenu';
import WallpaperIcons from 'components/units/WallpaperIcons';
import Programs from 'components/units/Programs';

export default function Viewport() {
	const [notUse, setToggleOn] = useAtom(startMenuToggle);
	const [account, setLogin] = useAtom(accountAtom);
	const [darkMode, setDarkMode] = useAtom(setDarkModeAtom);
	const [notUse2, setResolution] = useAtom(setResolutionAtom);
	const [fontFamily, setFontStyle] = useAtom(setFontStyleAtom);

	const handleToggle = () => {
		setToggleOn(false);
	};

	useEffect(() => {
		const loginAccount = localStorage.getItem('account');
		const isDarkMode = localStorage.getItem('darkMode') === 'true';
		const resolution = localStorage.getItem('resolution');
		const fontStyle = localStorage.getItem('fontStyle');
		if (loginAccount !== null) {
			setLogin(JSON.parse(loginAccount));
		}
		if (isDarkMode) {
			setDarkMode(isDarkMode);
		}
		if (resolution !== null) {
			setResolution(Number(resolution));
		}
		if (fontStyle !== null) {
			setFontStyle(JSON.parse(fontStyle));
		}
	}, []);

	return (
		<ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
			{account.uuid === '' ? (
				<Login />
			) : (
				<Screen fontFamily={fontFamily.value[0] + ', ' + fontFamily.value[1]}>
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

const Screen = styled.div<{ fontFamily: string }>`
	width: 100vw;
	height: 100vh;
	position: relative;
	overflow: hidden;
	font-family: ${(props) => props.fontFamily};
`;

const Desktop = styled.div`
	width: 100%;
	height: calc(100% - 40px);
`;
