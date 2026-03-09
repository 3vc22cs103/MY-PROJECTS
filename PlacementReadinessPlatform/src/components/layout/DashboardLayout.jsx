import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Code, FileText, BookOpen, User, LogOut, Briefcase } from 'lucide-react';

const DashboardLayout = () => {
    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Code, label: 'Practice', path: '/dashboard/practice' },
        { icon: FileText, label: 'Assessments', path: '/dashboard/assessments' },
        { icon: BookOpen, label: 'Resources', path: '/dashboard/resources' },
        { icon: Briefcase, label: 'History', path: '/dashboard/history' },
        { icon: User, label: 'Profile', path: '/dashboard/profile' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-10">
                <div className="h-16 flex items-center px-6 border-b border-gray-100">
                    <span className="text-xl font-bold text-primary">Placement Prep</span>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/dashboard'} // Only exact match for root dashboard
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? 'bg-indigo-50 text-primary'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`
                            }
                        >
                            <item.icon size={20} />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <NavLink to="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors">
                        <LogOut size={20} />
                        Sign Out
                    </NavLink>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 ml-64 flex flex-col min-w-0">
                {/* Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
                    <h2 className="text-lg font-semibold text-gray-800">Welcome back, Student</h2>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-primary font-bold">
                            ST
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
