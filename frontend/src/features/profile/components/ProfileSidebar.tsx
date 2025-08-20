import React from 'react'

export type ProfileSection = 'profile' | 'cards' | 'upgrade' | 'security' | 'support' | 'verify'

type Props = {
  sections: { key: ProfileSection; label: string }[]
  active: ProfileSection
  onSelect: (key: ProfileSection) => void
}

const ProfileSidebar: React.FC<Props> = ({ sections, active, onSelect }) => {
  return (
    <aside className="w-56 shrink-0">
      <nav className="space-y-1">
        {sections.map((s) => (
          <button
            key={s.key}
            className={
              'w-full text-left px-3 py-2 rounded-md ' +
              (active === s.key ? 'bg-gray-900 text-white' : 'hover:bg-gray-100 text-gray-700')
            }
            onClick={() => onSelect(s.key)}
          >
            {s.label}
          </button>
        ))}
      </nav>
    </aside>
  )
}

export default ProfileSidebar


