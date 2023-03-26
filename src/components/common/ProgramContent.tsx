import React from 'react';
import styled from 'styled-components';
import { programType } from 'utils/type';
import NotepadContent from 'components/units/programContent/NotepadContent';
import PaintContent from 'components/units/programContent/PaintContent';
import ImageContent from 'components/units/programContent/ImageContent';
import DocumentContent from 'components/units/programContent/DocumentContent';
import BackgroundSetting from 'components/units/programContent/BackgroundSetting';
import ThemeSetting from 'components/units/programContent/ThemeSetting';
import { setResolutionAtom } from 'store';
import { useAtom } from 'jotai';

interface ProgramContentProps {
	program: programType;
}

function ProgramContent({ program }: ProgramContentProps) {
	const [resolution] = useAtom(setResolutionAtom);
	return (
		<ProgramBackground resolution={resolution}>
			{program.type === 'notepad' && <NotepadContent program={program} />}
			{program.type === 'paint' && <PaintContent program={program} />}
			{program.type === 'image' && <ImageContent program={program} />}
			{program.type === 'document' && <DocumentContent program={program} />}
			{program.name === '배경화면 설정' && <BackgroundSetting />}
			{program.name === '테마 설정' && <ThemeSetting />}
		</ProgramBackground>
	);
}

const ProgramBackground = styled.div<{ resolution: number }>`
	width: 100%;
	height: ${(props) => `calc(100% - ${props.resolution * 17 + 5}px)`};
	background-color: ${(props) => props.theme.program.backgroundColor};
`;

export default ProgramContent;
