
import React, { useState } from "react";

const studentsData = [
	{
		name: "Alice Baker",
		avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC59OvtaolfjHQmKumrqBwnF_-VdQPtsJnp09Zn6TMVTZSqVjG2qScjeh07hRANaQ-AbpmA0VzcMVDpbjh_38Z28TCYn0RwBjdSWys7l-NSfOEgxgiID9Wck3APaqNK18xmjdan35H_hcjZkzMBW7DSJ301TVU0f7o4zYMVjrGTst71nOz-qjvMWL9JfLgyDGI9rKkJSr6wFYy0aDWBWBTb1QPgAFiJrZcMMyxiuiYdcEK5NwN3VvOCURkgsaWWiVd6xRyswSqgMK8",
		grades: [9, 18, 92, 45, "", 0],
		total: 164,
		totalColor: "text-text-main dark:text-white"
	},
	{
		name: "Charlie Davis",
		avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAdrCq21yQmqLzbsTjHqoVKV_HGeZ4gvGjWu96m-N4JWfCntH71OwscNMXMzQ8j_G6LCAQ0HcwqPChh-lC05lTLc2tr7aS8LuxzXR3y0cRCGiS1DmErSCqJOfyIOLnHGOAhJILswQKdEhVUQNtm86Zg11AXOEi383Vmd034qEgS61tr8rk7zU5onaFxcdVd894wMWih1oA6S-piiDIyWqo8weUOCy2sOgUseURiFpjvkmQ5hcQ8L7WDT35HSFB6pmCUQQx6HB8OI94",
		grades: [8, 15, 78, 40, "", 0],
		total: 141,
		totalColor: "text-yellow-600 dark:text-yellow-500"
	},
	{
		name: "Eva Fisher",
		avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCtWFmysXZY2Mm3Sr9ZOWtv7suaFwy82PornByD_ku_DGbq970q8wp0PPGLiH5Mg3XGS8r20xxtfQ7zaUSaMZk0U851B7S1WAuG-503NjU6bV6pq6s6jVYwhK5hpWDFFCS0yJW612mIycsyGOefH1Rdf_H03bKFQV1WHJyiwuP7VKJWn7TyYO2WST_OS48cZstFAEP9sJpH3GIzuros8FcOIqzxF2vhV0M4D8aXtAqzLarGrnaOneCeKymFWtRerTGUs_OLIJ57pTE",
		grades: [10, 20, 98, 50, 95, 0],
		total: 273,
		totalColor: "text-green-600 dark:text-green-500"
	},
	{
		name: "George Harris",
		avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHl9jhxlcgXueF7FcjR3IIqUufnuDFy_IHftJlWcRy_QjZ8jxY9AoVlHfUkgh9xs5pDyaz-REn_SG1F_MozoP6RuJGBrnebC7bwfdsaEhADXJAI3ie9E-kXNUSbeX0KvsoGk6JaoTV2GpgzGP0GndE1OQAWPDF6-sqpWq07J4FCK_9qUfuMAQMVViBWyQjoBlSVfSnrzQ3-YgbcPstU4P5hiaMv_qDj5P8Rho6GDfSfiuR-QzfGzvIthRg732ugHxKfoG1AqZcTCY",
		grades: [7, 14, 85, 42, "", 0],
		total: 148,
		totalColor: "text-text-main dark:text-white"
	},
	{
		name: "Ivy Jones",
		avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDUFZjZE74E-PNhXe5FUHkCJAkgUOELS-imu1Uv8GCcK6GqWPpcAcFC2HVd1gaFtYN0JYWpBTJ7cSXG69DgkjkyzdgDjksNGMetwkiEi2ra5nSpV4B579DhhZ03tadlcGa2M3C7IjopyVE_0BFhwDRIEki8DFBOGaqcj-s568C2AJ-8tDit9FN1jKeICozkxwYtvUua-tKCz1oIRIa002A6rVEQi4okRAeGKf-0WU47YRN7hu8ki8hl7-0YSYF-rZf29_6PmwzTS50",
		grades: [9, 19, 90, 48, "", 0],
		total: 166,
		totalColor: "text-green-600 dark:text-green-500"
	},
	{
		name: "Kevin Miller",
		avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBtGhFpDILbMygXVCBDT4KB16W8Ehbg-3HJhWrBH88aLjSlLDgjfdbg6s6HrRwXYAl5AC8c2ZZGUiQ7QPDtO958rPZzEKpki8fJFEG6etbZyfO4cEpGde_9aIpDVMXinKDcvEWE0q0hwWmlz99Resh-84PWleXCtXI5x7j5yKdvEPZurWsHBe7uvjf49JYLzvP71DcxQ25QamQGl-9RePQFEEGhiwLgaUaIA19UxyaE0THVigGPG-hZQekfnQMfthOyJmzZjUPQEUg",
		grades: [6, 12, 65, 30, "", 0],
		total: 113,
		totalColor: "text-red-600 dark:text-red-400"
	},
];

const assignments = [
	{ label: "Homework 1", max: 10 },
	{ label: "Quiz 1", max: 20 },
	{ label: "Midterm", max: 100 },
	{ label: "Project Alpha", max: 50 },
	{ label: "Essay", max: 100 },
];

function GradeBook() {
	const [students, setStudents] = useState(studentsData);

	const handleGradeChange = (studentIdx, assignmentIdx, value) => {
		setStudents((prev) => {
			const updated = [...prev];
			updated[studentIdx] = { ...updated[studentIdx] };
			const grades = [...updated[studentIdx].grades];
			grades[assignmentIdx] = value;
			updated[studentIdx].grades = grades;
			// Optionally recalculate total here
			return updated;
		});
	};

	return (
		<div className="bg-background-light dark:bg-background-dark text-text-main font-display antialiased min-h-screen flex flex-col">
			{/* Top Navigation */}
			<header className="sticky top-0 z-50 w-full bg-white dark:bg-gray-900 border-b border-border-light dark:border-border-dark px-6 py-3 shadow-sm">
				<div className="max-w-[1440px] mx-auto flex items-center justify-between">
					<div className="flex items-center gap-4 text-text-main dark:text-white">
						<div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
							<span className="material-symbols-outlined">school</span>
						</div>
						<h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">School Manager</h2>
					</div>
					<nav className="hidden md:flex flex-1 justify-center gap-8">
						<a className="text-text-secondary hover:text-primary dark:text-gray-400 dark:hover:text-white text-sm font-medium transition-colors" href="#">Dashboard</a>
						<a className="text-primary text-sm font-medium" href="#">Classes</a>
						<a className="text-text-secondary hover:text-primary dark:text-gray-400 dark:hover:text-white text-sm font-medium transition-colors" href="#">Students</a>
						<a className="text-text-secondary hover:text-primary dark:text-gray-400 dark:hover:text-white text-sm font-medium transition-colors" href="#">Reports</a>
						<a className="text-text-secondary hover:text-primary dark:text-gray-400 dark:hover:text-white text-sm font-medium transition-colors" href="#">Settings</a>
					</nav>
					<div className="flex items-center gap-4">
						<button className="text-text-secondary hover:text-text-main dark:text-gray-400 dark:hover:text-white">
							<span className="material-symbols-outlined">notifications</span>
						</button>
						<div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-9 ring-2 ring-white dark:ring-gray-800 shadow-sm" style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDXPl3PmwFbBajOIxGUluuiCissznupEknDciHnRtXDvrresWne51v4ZqQn4z3NbmtirNr31vioZYO6uDYLjE4vTZ_snOuQHSA7qf-sBAfUbe67Is27-wQXw57NfD-QPehxtdSiWsE_2KIw1MmqZYPrdEMPoau6WZUH2YU2gpxaYqxeSM89H3TiUvJjKGvymdEwEYeSHkif73f2LCQgIg9obo_2q5UNO6KoTeVKw1S4qglU9pxz0h-m8d8-3qAK8LFZYGqGfq5dOOU')` }} />
					</div>
				</div>
			</header>
			{/* Main Content */}
			<main className="flex-1 w-full max-w-[1440px] mx-auto px-6 py-8 flex flex-col gap-6">
				{/* Breadcrumbs & Header Section */}
				<div className="flex flex-col gap-1">
					<nav className="flex items-center gap-2 text-sm text-text-secondary dark:text-gray-400">
						<a className="hover:text-primary transition-colors" href="#">Home</a>
						<span className="material-symbols-outlined text-[16px]">chevron_right</span>
						<a className="hover:text-primary transition-colors" href="#">Classes</a>
						<span className="material-symbols-outlined text-[16px]">chevron_right</span>
						<span className="text-text-main dark:text-white font-medium">Grade 10 Math</span>
					</nav>
					<div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-4">
						<div className="flex flex-col gap-1">
							<h1 className="text-3xl md:text-4xl font-bold tracking-tight text-text-main dark:text-white">Gradebook</h1>
							<p className="text-text-secondary dark:text-gray-400 text-base font-normal">Fall Semester 2023 • Section A</p>
						</div>
						<div className="flex items-center gap-3">
							<div className="hidden sm:flex items-center text-sm text-text-secondary dark:text-gray-500 mr-2">
								<span className="material-symbols-outlined text-[18px] mr-1">history</span>
								<span>Last updated 2 min ago</span>
							</div>
							<button className="flex items-center justify-center gap-2 h-10 px-5 bg-white dark:bg-gray-800 border border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-700 text-text-main dark:text-white text-sm font-semibold rounded-lg transition-colors shadow-sm">
								<span className="material-symbols-outlined text-[18px]">download</span>
								Export
							</button>
							<button className="flex items-center justify-center gap-2 h-10 px-6 bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded-lg shadow-sm shadow-primary/30 transition-all active:scale-95">
								<span className="material-symbols-outlined text-[18px]">save</span>
								Save
							</button>
						</div>
					</div>
				</div>
				{/* Toolbar */}
				<div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-900 p-2 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
					{/* Search */}
					<div className="relative w-full sm:max-w-xs group">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<span className="material-symbols-outlined text-gray-400 text-[20px]">search</span>
						</div>
						<input className="block w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-gray-800 border border-transparent focus:bg-white dark:focus:bg-gray-900 text-text-main dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary sm:text-sm transition-all" placeholder="Search students..." type="text" />
					</div>
					{/* Filters */}
					<div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
						<button className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium text-primary bg-primary/10 border border-transparent whitespace-nowrap">
							<span className="material-symbols-outlined text-[18px]">star</span>
							All
						</button>
						<button className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium text-text-secondary dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent whitespace-nowrap transition-colors">
							<span className="material-symbols-outlined text-[18px]">check_circle</span>
							Passed
						</button>
						<button className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium text-text-secondary dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent whitespace-nowrap transition-colors">
							<span className="material-symbols-outlined text-[18px]">error</span>
							Needs Attention
						</button>
						<div className="h-4 w-px bg-gray-300 dark:bg-gray-700 mx-1"></div>
						<button className="p-1.5 text-gray-400 hover:text-text-main dark:hover:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
							<span className="material-symbols-outlined text-[20px]">filter_list</span>
						</button>
						<button className="p-1.5 text-gray-400 hover:text-text-main dark:hover:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
							<span className="material-symbols-outlined text-[20px]">settings</span>
						</button>
					</div>
				</div>
				{/* Gradebook Table Container */}
				<div className="bg-white dark:bg-gray-900 rounded-xl border border-border-light dark:border-border-dark shadow-sm overflow-hidden flex flex-col flex-1 min-h-[500px]">
					<div className="overflow-x-auto custom-scrollbar flex-1">
						<table className="w-full text-left border-collapse">
							<thead className="bg-gray-50 dark:bg-gray-800/50 sticky top-0 z-10">
								<tr>
									<th className="sticky left-0 z-20 bg-gray-50 dark:bg-gray-800 border-b border-r border-border-light dark:border-border-dark px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary dark:text-gray-400 min-w-[240px] shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)]" scope="col">
										Student
									</th>
									{assignments.map((a, idx) => (
										<th key={a.label} className="border-b border-border-light dark:border-border-dark px-4 py-4 min-w-[140px]" scope="col">
											<div className="flex flex-col gap-1">
												<span className="text-sm font-semibold text-text-main dark:text-white">{a.label}</span>
												<span className="text-xs text-text-secondary dark:text-gray-500 font-normal">/ {a.max} pts</span>
											</div>
										</th>
									))}
									<th className="border-b border-border-light dark:border-border-dark px-6 py-4 min-w-[120px] bg-gray-50/50 dark:bg-gray-800/50" scope="col">
										<div className="flex flex-col gap-1">
											<span className="text-sm font-bold text-primary dark:text-primary">Total Grade</span>
											<span className="text-xs text-text-secondary dark:text-gray-500 font-normal">Current Avg</span>
										</div>
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-border-light dark:divide-border-dark bg-white dark:bg-gray-900">
								{students.map((student, sIdx) => (
									<tr key={student.name} className="group hover:bg-gray-50/80 dark:hover:bg-gray-800/50 transition-colors">
										<td className="sticky left-0 z-10 bg-white dark:bg-gray-900 group-hover:bg-gray-50/80 dark:group-hover:bg-gray-800/50 border-r border-border-light dark:border-border-dark px-6 py-3 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)] transition-colors">
											<div className="flex items-center gap-3">
												<div className="size-9 rounded-full bg-cover bg-center ring-1 ring-gray-200 dark:ring-gray-700" style={{ backgroundImage: `url('${student.avatar}')` }} />
												<div className="font-medium text-sm text-text-main dark:text-white">{student.name}</div>
											</div>
										</td>
										{assignments.map((a, aIdx) => (
											<td key={a.label} className="px-4 py-3">
												<input
													className="grade-input w-20 px-3 py-1.5 text-sm rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-main dark:text-white focus:outline-none transition-all placeholder-gray-300"
													max={a.max}
													min={0}
													type="number"
													value={student.grades[aIdx]}
													onChange={e => handleGradeChange(sIdx, aIdx, e.target.value)}
												/>
											</td>
										))}
										<td className={`px-6 py-3 bg-gray-50/30 dark:bg-gray-800/30 font-bold text-sm ${student.totalColor}`}>
											{student.total}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					{/* Table Footer */}
					<div className="px-6 py-4 border-t border-border-light dark:border-border-dark flex items-center justify-between bg-white dark:bg-gray-900">
						<p className="text-sm text-text-secondary dark:text-gray-400">Showing <span className="font-medium text-text-main dark:text-white">6</span> of <span className="font-medium text-text-main dark:text-white">24</span> students</p>
						<div className="flex items-center gap-2">
							<button className="flex items-center justify-center p-2 rounded-lg text-text-secondary dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" disabled>
								<span className="material-symbols-outlined text-[20px]">chevron_left</span>
							</button>
							<div className="flex gap-1">
								<button className="h-8 w-8 rounded-lg bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">1</button>
								<button className="h-8 w-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-text-secondary dark:text-gray-400 text-sm font-medium flex items-center justify-center transition-colors">2</button>
								<button className="h-8 w-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-text-secondary dark:text-gray-400 text-sm font-medium flex items-center justify-center transition-colors">3</button>
							</div>
							<button className="flex items-center justify-center p-2 rounded-lg text-text-secondary dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
								<span className="material-symbols-outlined text-[20px]">chevron_right</span>
							</button>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}

export default GradeBook;
