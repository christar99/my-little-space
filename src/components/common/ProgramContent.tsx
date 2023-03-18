import React from 'react';
import { programType } from 'utils/type';
import NotepadContent from 'components/units/programContent/NotepadContent';
import PaintContent from 'components/units/programContent/PaintContent';
import ImageContent from 'components/units/programContent/ImageContent';

interface ProgramContentProps {
	program: programType;
}

function ProgramContent({ program }: ProgramContentProps) {
	return (
		<>
			{program.type === 'notepad' && <NotepadContent program={program} />}
			{program.type === 'paint' && <PaintContent program={program} />}
			{program.type === 'image' && <ImageContent program={program} />}
		</>
	);
}

export default ProgramContent;
