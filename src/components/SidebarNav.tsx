import React from 'react';
import { NavLink } from 'react-router-dom';

export interface SidebarNavItem {
  id: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  path?: string;
}

interface SidebarNavProps {
  items: SidebarNavItem[];
  activeId: string;
  onSelect: (id: string) => void;
}

const baseItemClass =
  'group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[15px] font-medium transition-all duration-200';

const SidebarNav: React.FC<SidebarNavProps> = ({ items, activeId, onSelect }) => {
  return (
    <nav className="flex-1 p-5">
      <div className="space-y-2">
        {items.map((item) => {
          const inactiveClass =
            'text-slate-700 hover:text-slate-900 hover:bg-slate-200/70 hover:translate-x-0.5';
          const activeClass =
            'text-blue-700 font-semibold bg-white shadow-sm';

          if (item.path) {
            return (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  `${baseItemClass} ${(isActive || activeId === item.id) ? activeClass : inactiveClass}`
                }
              >
                {({ isActive }) => {
                  const active = isActive || activeId === item.id;

                  return (
                    <>
                      <item.icon
                        className={`w-[18px] h-[18px] transition-colors ${
                          active ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-700'
                        }`}
                      />
                      <span>{item.label}</span>
                    </>
                  );
                }}
              </NavLink>
            );
          }

          const isActiveButton = activeId === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`${baseItemClass} ${isActiveButton ? activeClass : inactiveClass}`}
            >
              <item.icon
                className={`w-[18px] h-[18px] transition-colors ${
                  isActiveButton ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-700'
                }`}
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default SidebarNav;
