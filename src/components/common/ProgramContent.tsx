import React from 'react';
import { programType } from 'utils/type';
import NotepadContent from 'components/units/programContent/NotepadContent';
import PaintContent from 'components/units/programContent/PaintContent';
import ImageContent from 'components/units/programContent/ImageContent';
import DocumentContent from 'components/units/programContent/DocumentContent';
import BackgroundImage from 'components/units/programContent/BackgroundSetting';
import styled from 'styled-components';

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
			{program.name === '배경화면 설정' && <BackgroundImage program={program} />}
		</ProgramBackground>
	);
}

const ProgramBackground = styled.div`
	width: 100%;
	height: calc(100% - 36px);
	background-color: #666;
`;

export default ProgramContent;
