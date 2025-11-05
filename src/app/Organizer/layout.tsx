import SideBarOrganizer from '@/components/molecules/SideBarOrganizer/SideBarOrganizer';

export default function OrganizerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <SideBarOrganizer />
      <section className="flex-1 p-6">{children}</section>
    </div>
  );
}
