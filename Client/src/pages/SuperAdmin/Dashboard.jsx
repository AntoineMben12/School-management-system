import React, { useState } from "react";

function SuperAdminDashboard() {
	return (
		<div className="flex h-screen w-full">
			{/* Sidebar Navigation */}
			<aside className="w-72 shrink-0 flex flex-col border-r border-border-dark bg-[#131118] transition-all duration-300">
				<div className="p-6 pb-2">
					<div className="flex items-center gap-3">
						<div className="bg-primary/20 p-2 rounded-lg text-primary">
							<span className="material-symbols-outlined text-3xl">school</span>
						</div>
						<div className="flex flex-col">
							<h1 className="text-white text-lg font-bold tracking-tight">SchoolOS</h1>
							<p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Superadmin</p>
						</div>
					</div>
				</div>
				<nav className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-2">
					<p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Main Menu</p>
					<a className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary border-l-4 border-primary transition-all" href="#">
						<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
						<span className="text-sm font-medium">Dashboard</span>
					</a>
					<a className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all group" href="#">
						<span className="material-symbols-outlined group-hover:text-white transition-colors">domain</span>
						<span className="text-sm font-medium">Schools</span>
					</a>
					<a className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all group" href="#">
						<span className="material-symbols-outlined group-hover:text-white transition-colors">payments</span>
						<span className="text-sm font-medium">Finance</span>
					</a>
					<a className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all group" href="#">
						<span className="material-symbols-outlined group-hover:text-white transition-colors">group</span>
						<span className="text-sm font-medium">Users</span>
					</a>
					<div className="my-4 border-t border-white/5"></div>
					<p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">System</p>
					<a className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all group" href="#">
						<span className="material-symbols-outlined group-hover:text-white transition-colors">settings</span>
						<span className="text-sm font-medium">Settings</span>
					</a>
					<a className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all group" href="#">
						<span className="material-symbols-outlined group-hover:text-white transition-colors">support</span>
						<span className="text-sm font-medium">Support</span>
					</a>
				</nav>
				<div className="p-4 border-t border-white/5">
					<a className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-white/5 transition-all" href="#">
						<div
							className="bg-center bg-no-repeat bg-cover rounded-full size-10 ring-2 ring-white/10"
							data-alt="Profile picture of the superadmin user"
							style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCvjoFkuTmidRBdJUo3xodn3rJ9TQlNUL7LeY7BPE_3JmG-pwtCh0vHRHibx19-1J9s98vJs7aUaPbg9QtOSii9QQYvCPHRrdrv-D-GJWo4NZv8iyKi9S9CrA_bAOuDvTPQXlvfVLcoFZ-WquMs0X0EIaP5iCRHh_GqLEMg0tL5dk9m0VOb2kCj9MZNrNQDIdgriFt-61mN3WisAFF-nRhY083cYGqAXqxIiOumfRWty-ak4JqdZUcKV_p0GJQaTd4ZY3xzwvSyems")' }}
						></div>
						<div className="flex flex-col min-w-0">
							<p className="text-white text-sm font-medium truncate">Alexander P.</p>
							<p className="text-slate-500 text-xs truncate">alex@edumanage.com</p>
						</div>
						<span className="material-symbols-outlined text-slate-500 ml-auto">logout</span>
					</a>
				</div>
			</aside>
			{/* Main Content Area */}
			<main className="flex-1 flex flex-col h-full overflow-hidden bg-background-dark relative">
				{/* Sticky Header */}
				<header className="h-20 shrink-0 flex items-center justify-between px-8 border-b border-border-dark bg-background-dark/80 backdrop-blur-md z-20">
					<div className="flex flex-col">
						<h2 className="text-2xl font-bold tracking-tight text-white">Global Overview</h2>
						<p className="text-slate-400 text-sm">Welcome back, here's what's happening today.</p>
					</div>
					<div className="flex items-center gap-6">
						{/* Search Bar */}
						<div className="relative w-80">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<span className="material-symbols-outlined text-slate-400 text-[20px]">search</span>
							</div>
							<input
								className="block w-full rounded-full border-none bg-surface-dark py-2.5 pl-10 pr-3 text-sm placeholder:text-slate-500 text-white focus:ring-2 focus:ring-primary/50 transition-all"
								placeholder="Search schools, licenses..."
								type="text"
							/>
						</div>
						{/* Notifications */}
						<button className="relative p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
							<span className="material-symbols-outlined">notifications</span>
							<span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-background-dark"></span>
						</button>
					</div>
				</header>
				{/* Scrollable Content */}
				<div className="flex-1 overflow-y-auto p-8">
					<div className="max-w-350 mx-auto space-y-8">
						{/* Stats Grid */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							{/* Stat Card 1 */}
							<div className="bg-surface-dark rounded-xl p-6 border border-white/5 shadow-sm hover:border-primary/30 transition-all group relative overflow-hidden">
								<div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
									<span className="material-symbols-outlined text-6xl text-primary">school</span>
								</div>
								<p className="text-slate-400 text-sm font-medium mb-1">Total Schools</p>
								<div className="flex items-baseline gap-3">
									<h3 className="text-3xl font-bold text-white">1,240</h3>
									<span className="flex items-center text-emerald-400 text-xs font-medium bg-emerald-400/10 px-2 py-0.5 rounded-full">
										<span className="material-symbols-outlined text-[14px] mr-1">trending_up</span> +5%
									</span>
								</div>
								<div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
									<div className="h-full bg-primary w-[75%] rounded-full"></div>
								</div>
							</div>
							{/* Stat Card 2 */}
							<div className="bg-surface-dark rounded-xl p-6 border border-white/5 shadow-sm hover:border-primary/30 transition-all group relative overflow-hidden">
								<div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
									<span className="material-symbols-outlined text-6xl text-primary">payments</span>
								</div>
								<p className="text-slate-400 text-sm font-medium mb-1">Monthly Revenue</p>
								<div className="flex items-baseline gap-3">
									<h3 className="text-3xl font-bold text-white">$420,500</h3>
									<span className="flex items-center text-emerald-400 text-xs font-medium bg-emerald-400/10 px-2 py-0.5 rounded-full">
										<span className="material-symbols-outlined text-[14px] mr-1">trending_up</span> +12%
									</span>
								</div>
								<div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
									<div className="h-full bg-primary w-[60%] rounded-full"></div>
								</div>
							</div>
							{/* Stat Card 3 */}
							<div className="bg-surface-dark rounded-xl p-6 border border-white/5 shadow-sm hover:border-primary/30 transition-all group relative overflow-hidden">
								<div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
									<span className="material-symbols-outlined text-6xl text-primary">verified_user</span>
								</div>
								<p className="text-slate-400 text-sm font-medium mb-1">Active Licenses</p>
								<div className="flex items-baseline gap-3">
									<h3 className="text-3xl font-bold text-white">45,200</h3>
									<span className="flex items-center text-slate-400 text-xs font-medium bg-white/5 px-2 py-0.5 rounded-full">
										98% utilization
									</span>
								</div>
								<div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
									<div className="h-full bg-primary w-[98%] rounded-full"></div>
								</div>
							</div>
						</div>
						{/* Action Bar & Filters */}
						<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
							<div className="flex gap-2">
								<div className="relative">
									<select className="appearance-none bg-surface-dark border border-white/10 text-white text-sm rounded-lg pl-3 pr-8 py-2 focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer">
										<option>All Statuses</option>
										<option>Active</option>
										<option>Expired</option>
										<option>Pending</option>
									</select>
									<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
										<span className="material-symbols-outlined text-[18px]">expand_more</span>
									</div>
								</div>
								<div className="relative">
									<select className="appearance-none bg-surface-dark border border-white/10 text-white text-sm rounded-lg pl-3 pr-8 py-2 focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer">
										<option>Sort by Date</option>
										<option>Sort by Name</option>
										<option>Sort by Revenue</option>
									</select>
									<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
										<span className="material-symbols-outlined text-[18px]">expand_more</span>
									</div>
								</div>
							</div>
							<button className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white text-sm font-semibold py-2 px-4 rounded-lg shadow-lg shadow-primary/20 transition-all">
								<span className="material-symbols-outlined text-[20px]">add</span>
								<span>Add New School</span>
							</button>
						</div>
						{/* Data Table */}
						<div className="bg-surface-dark rounded-xl border border-white/5 overflow-hidden shadow-sm">
							<div className="overflow-x-auto">
								<table className="w-full text-left border-collapse">
									<thead>
										<tr className="border-b border-white/5 bg-white/2">
											<th className="p-4 text-xs font-medium text-slate-400 uppercase tracking-wider">School Name</th>
											<th className="p-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Admin Contact</th>
											<th className="p-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Plan / Tier</th>
											<th className="p-4 text-xs font-medium text-slate-400 uppercase tracking-wider text-right">Students</th>
											<th className="p-4 text-xs font-medium text-slate-400 uppercase tracking-wider text-center">Status</th>
											<th className="p-4 text-xs font-medium text-slate-400 uppercase tracking-wider text-right">Renewal</th>
											<th className="p-4 text-xs font-medium text-slate-400 uppercase tracking-wider text-right">Actions</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-white/5">
										{/* Row 1 */}
										<tr className="group hover:bg-white/2 transition-colors">
											<td className="p-4">
												<div className="flex items-center gap-3">
													<div className="size-8 rounded bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-inner">LH</div>
													<div className="flex flex-col">
														<span className="text-sm font-medium text-white">Lincoln High School</span>
														<span className="text-xs text-slate-500">ID: #SCH-8832</span>
													</div>
												</div>
											</td>
											<td className="p-4">
												<div className="flex flex-col">
													<span className="text-sm text-slate-200">Sarah Connor</span>
													<span className="text-xs text-slate-500">sarah@lincoln.edu</span>
												</div>
											</td>
											<td className="p-4">
												<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/10">
													<span className="size-1.5 rounded-full bg-purple-400"></span> Enterprise
												</span>
											</td>
											<td className="p-4 text-right text-sm text-slate-300 font-mono">2,450</td>
											<td className="p-4 text-center">
												<span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/10">
													Active
												</span>
											</td>
											<td className="p-4 text-right text-sm text-slate-400">Oct 24, 2024</td>
											<td className="p-4 text-right">
												<div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
													<button className="p-1.5 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors" title="Login as Admin">
														<span className="material-symbols-outlined text-[20px]">login</span>
													</button>
													<button className="p-1.5 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors" title="Edit">
														<span className="material-symbols-outlined text-[20px]">edit</span>
													</button>
													<button className="p-1.5 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors" title="More">
														<span className="material-symbols-outlined text-[20px]">more_vert</span>
													</button>
												</div>
											</td>
										</tr>
										{/* Row 2 */}
										<tr className="group hover:bg-white/2 transition-colors">
											<td className="p-4">
												<div className="flex items-center gap-3">
													<div className="size-8 rounded bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold shadow-inner">SA</div>
													<div className="flex flex-col">
														<span className="text-sm font-medium text-white">St. Mary's Academy</span>
														<span className="text-xs text-slate-500">ID: #SCH-9921</span>
													</div>
												</div>
											</td>
											<td className="p-4">
												<div className="flex flex-col">
													<span className="text-sm text-slate-200">Father John</span>
													<span className="text-xs text-slate-500">john@stmarys.org</span>
												</div>
											</td>
											<td className="p-4">
												<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/10">
													<span className="size-1.5 rounded-full bg-blue-400"></span> Standard
												</span>
											</td>
											<td className="p-4 text-right text-sm text-slate-300 font-mono">850</td>
											<td className="p-4 text-center">
												<span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/10">
													Expired
												</span>
											</td>
											<td className="p-4 text-right text-sm text-red-400 font-medium">Yesterday</td>
											<td className="p-4 text-right">
												<div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
													<button className="p-1.5 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors" title="Login as Admin">
														<span className="material-symbols-outlined text-[20px]">login</span>
													</button>
													<button className="p-1.5 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors" title="Edit">
														<span className="material-symbols-outlined text-[20px]">edit</span>
													</button>
													<button className="p-1.5 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors" title="More">
														<span className="material-symbols-outlined text-[20px]">more_vert</span>
													</button>
												</div>
											</td>
										</tr>
										{/* Row 3 */}
										<tr className="group hover:bg-white/2 transition-colors">
											<td className="p-4">
												<div className="flex items-center gap-3">
													<div className="size-8 rounded bg-linear-to-br from-orange-500 to-red-600 flex items-center justify-center text-white text-xs font-bold shadow-inner">WT</div>
													<div className="flex flex-col">
														<span className="text-sm font-medium text-white">West Tech Institute</span>
														<span className="text-xs text-slate-500">ID: #SCH-1029</span>
													</div>
												</div>
											</td>
											<td className="p-4">
												<div className="flex flex-col">
													<span className="text-sm text-slate-200">Alan Turing</span>
													<span className="text-xs text-slate-500">alan@westtech.edu</span>
												</div>
											</td>
											<td className="p-4">
												<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/10">
													<span className="size-1.5 rounded-full bg-purple-400"></span> Enterprise
												</span>
											</td>
											<td className="p-4 text-right text-sm text-slate-300 font-mono">5,200</td>
											<td className="p-4 text-center">
												<span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/10">
													Active
												</span>
											</td>
											<td className="p-4 text-right text-sm text-slate-400">Nov 15, 2024</td>
											<td className="p-4 text-right">
												<div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
													<button className="p-1.5 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors" title="Login as Admin">
														<span className="material-symbols-outlined text-[20px]">login</span>
													</button>
													<button className="p-1.5 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors" title="Edit">
														<span className="material-symbols-outlined text-[20px]">edit</span>
													</button>
													<button className="p-1.5 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors" title="More">
														<span className="material-symbols-outlined text-[20px]">more_vert</span>
													</button>
												</div>
											</td>
										</tr>
										{/* Row 4 */}
										<tr className="group hover:bg-white/2 transition-colors">
											<td className="p-4">
												<div className="flex items-center gap-3">
													<div className="size-8 rounded bg-linear-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white text-xs font-bold shadow-inner">RA</div>
													<div className="flex flex-col">
														<span className="text-sm font-medium text-white">Riverdale Academy</span>
														<span className="text-xs text-slate-500">ID: #SCH-3341</span>
													</div>
												</div>
											</td>
											<td className="p-4">
												<div className="flex flex-col">
													<span className="text-sm text-slate-200">Betty Cooper</span>
													<span className="text-xs text-slate-500">betty@riverdale.edu</span>
												</div>
											</td>
											<td className="p-4">
												<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/10">
													<span className="size-1.5 rounded-full bg-blue-400"></span> Standard
												</span>
											</td>
											<td className="p-4 text-right text-sm text-slate-300 font-mono">1,100</td>
											<td className="p-4 text-center">
												<span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/10">
													Pending
												</span>
											</td>
											<td className="p-4 text-right text-sm text-slate-400">--</td>
											<td className="p-4 text-right">
												<div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
													<button className="p-1.5 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors" title="Login as Admin">
														<span className="material-symbols-outlined text-[20px]">login</span>
													</button>
													<button className="p-1.5 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors" title="Edit">
														<span className="material-symbols-outlined text-[20px]">edit</span>
													</button>
													<button className="p-1.5 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors" title="More">
														<span className="material-symbols-outlined text-[20px]">more_vert</span>
													</button>
												</div>
											</td>
										</tr>
										{/* Row 5 */}
										<tr className="group hover:bg-white/2 transition-colors">
											<td className="p-4">
												<div className="flex items-center gap-3">
													<div className="size-8 rounded bg-linear-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-inner">GP</div>
													<div className="flex flex-col">
														<span className="text-sm font-medium text-white">Grand Park Primary</span>
														<span className="text-xs text-slate-500">ID: #SCH-5512</span>
													</div>
												</div>
											</td>
											<td className="p-4">
												<div className="flex flex-col">
													<span className="text-sm text-slate-200">Leslie Knope</span>
													<span className="text-xs text-slate-500">leslie@grandpark.gov</span>
												</div>
											</td>
											<td className="p-4">
												<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/10">
													<span className="size-1.5 rounded-full bg-blue-400"></span> Standard
												</span>
											</td>
											<td className="p-4 text-right text-sm text-slate-300 font-mono">420</td>
											<td className="p-4 text-center">
												<span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/10">
													Active
												</span>
											</td>
											<td className="p-4 text-right text-sm text-slate-400">Dec 01, 2024</td>
											<td className="p-4 text-right">
												<div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
													<button className="p-1.5 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors" title="Login as Admin">
														<span className="material-symbols-outlined text-[20px]">login</span>
													</button>
													<button className="p-1.5 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors" title="Edit">
														<span className="material-symbols-outlined text-[20px]">edit</span>
													</button>
													<button className="p-1.5 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors" title="More">
														<span className="material-symbols-outlined text-[20px]">more_vert</span>
													</button>
												</div>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
							{/* Pagination */}
							<div className="flex items-center justify-between p-4 border-t border-white/5 bg-white/2">
								<p className="text-xs text-slate-500">
									Showing <span className="text-white font-medium">1-5</span> of <span className="text-white font-medium">1,240</span> schools
								</p>
								<div className="flex items-center gap-2">
									<button className="p-1 rounded hover:bg-white/10 text-slate-400 disabled:opacity-50 transition-colors">
										<span className="material-symbols-outlined text-[20px]">chevron_left</span>
									</button>
									<button className="p-1 rounded hover:bg-white/10 text-slate-400 transition-colors">
										<span className="material-symbols-outlined text-[20px]">chevron_right</span>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
};

export default SuperAdminDashboard;
