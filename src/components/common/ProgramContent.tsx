import React from 'react';
import { programType } from 'utils/type';
import NotepadContent from 'components/units/NotepadContent';
import PaintContent from 'components/units/PaintContent';

interface ProgramContentProps {
	program: programType;
}

function ProgramContent({ program }: ProgramContentProps) {
	return (
		<>
			{program.type === 'notepad' && <NotepadContent program={program} />}
			{program.type === 'paint' && <PaintContent program={program} />}
		</>
	);
}

export default ProgramContent;
