import React from 'react';
import styled from 'styled-components';
import { programType } from 'utils/type';
import NotepadContent from 'components/units/programContent/NotepadContent';
import PaintContent from 'components/units/programContent/PaintContent';
import ImageContent from 'components/units/programContent/ImageContent';
import DocumentContent from 'components/units/programContent/DocumentContent';
import BackgroundSetting from 'components/units/programContent/BackgroundSetting';
import ThemeSetting from 'components/units/programContent/ThemeSetting';

interface ProgramContentProps {
	program: programType;
}

function ProgramContent({ program }: ProgramContentProps) {
	return (
		<ProgramBackground>
			{program.type === 'notepad' && <NotepadContent program={program} />}
			{program.type === 'paint' && <PaintContent program={program} />}
			{program.type === 'image' && <ImageContent program={program} />}
			{program.type === 'document' && <DocumentContent program={program} />}
			{program.name === '배경화면 설정' && <BackgroundSetting />}
			{program.name === '테마 설정' && <ThemeSetting />}
		</ProgramBackground>
	);
}

const ProgramBackground = styled.div`
	width: 100%;
	height: calc(100% - 36px);
	background-color: ${(props) => props.theme.program.backgroundColor};
`;

export default ProgramContent;
