import NotepadContent from 'components/units/NotepadContent';
import React from 'react';
import { programType } from 'utils/type';

interface ProgramContentProps {
	program: programType;
}

function ProgramContent({ program }: ProgramContentProps) {
	return <>{program.type === 'notepad' && <NotepadContent program={program} />}</>;
}

export default ProgramContent;
