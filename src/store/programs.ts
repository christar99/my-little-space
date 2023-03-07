import { atom } from 'jotai';
import { programType, programStyle, iconType, memorizedProgramStyle } from 'utils/type';

const biggestZIndex = atom<number>(101);
export const changeZIndex = atom(
	(get) => get(biggestZIndex),
	(get, set) => {
		set(biggestZIndex, get(biggestZIndex) + 1);
	}
);

export const programList = atom<programType[]>([]);
export const executeProgram = atom(
	(get) => get(programList),
	(get, set, executeValue: { icon: iconType; zIndex: number }) => {
		const newProgram: programType = {
			...executeValue.icon,
			style: {
				width: 500,
				height: 300,
				top: 250 + get(programList).length * 40,
				left: 300 + get(programList).length * 40,
				zIndex: executeValue.zIndex,
				minimization: false,
				maximization: false
			}
		};
		set(programList, [...get(programList), newProgram]);
	}
);
export const updateProgram = atom(
	(get) => get(programList),
	(get, set, changeValue: { program: programType; type: string; value?: number[] }) => {
		let style: programStyle = {
			width: 500,
			height: 300,
			top: 250 + get(programList).length * 40,
			left: 300 + get(programList).length * 40,
			zIndex: changeValue.value === undefined ? 101 : changeValue.value[0],
			minimization: false,
			maximization: false
		};
		switch (changeValue.type) {
			case 'initial':
				break;
			case 'zIndex':
				style = {
					...changeValue.program.style,
					zIndex: changeValue.value === undefined ? 101 : changeValue.value[0]
				};
				break;
			case 'size':
				style = {
					...changeValue.program.style,
					width:
						changeValue.value === undefined
							? 500
							: changeValue.value[0] > 300
							? changeValue.value[0]
							: 300,
					height:
						changeValue.value === undefined
							? 300
							: changeValue.value[1] > 200
							? changeValue.value[1]
							: 200
				};
				break;
			case 'locate':
				style = {
					...changeValue.program.style,
					left:
						changeValue.value === undefined
							? 250 + get(programList).length * 40
							: changeValue.value[0],
					top:
						changeValue.value === undefined
							? 300 + get(programList).length * 40
							: changeValue.value[1]
				};
				break;
			case 'maximize':
				style = {
					...changeValue.program.style,
					width: changeValue.value === undefined ? 500 : changeValue.value[0],
					height: changeValue.value === undefined ? 300 : changeValue.value[1],
					top: 0,
					left: 0,
					zIndex: changeValue.value === undefined ? 0 : changeValue.value[2],
					maximization: true
				};
				break;

			case 'minimize':
				style = {
					...changeValue.program.style,
					minimization: true,
					zIndex: 99
				};
				break;
			case 'restoration':
				style = {
					...changeValue.program.style,
					width: changeValue.value === undefined ? 500 : changeValue.value[0],
					height: changeValue.value === undefined ? 300 : changeValue.value[1],
					top:
						changeValue.value === undefined
							? 250 + get(programList).length * 40
							: changeValue.value[2],
					left:
						changeValue.value === undefined
							? 300 + get(programList).length * 40
							: changeValue.value[3],
					zIndex: changeValue.value === undefined ? 0 : changeValue.value[4],
					maximization: false,
					minimization: false
				};
				break;
		}
		const changedProgram = { ...changeValue.program, style };
		set(
			programList,
			get(programList).map((program) => {
				return program.name === changeValue.program.name ? changedProgram : program;
			})
		);
	}
);

export const exitProgram = atom(
	(get) => get(programList),
	(get, set, currentProgram: programType) => {
		set(
			programList,
			get(programList).filter((program) => program.name !== currentProgram.name)
		);
	}
);

const memorizedProgram = atom<memorizedProgramStyle[]>([]);
export const memorizeProgramStyle = atom(
	(get) => get(memorizedProgram),
	(get, set, changeValue: { program: programType; type: string }) => {
		if (changeValue.type === 'add') {
			set(memorizedProgram, [
				...get(memorizedProgram),
				{
					name: changeValue.program.name,
					width: changeValue.program.style.width,
					height: changeValue.program.style.height,
					top: changeValue.program.style.top,
					left: changeValue.program.style.left,
					zIndex: changeValue.program.style.zIndex
				}
			]);
		} else {
			set(
				memorizedProgram,
				get(memorizedProgram).filter((program) => {
					return program.name !== changeValue.program.name;
				})
			);
		}
	}
);
