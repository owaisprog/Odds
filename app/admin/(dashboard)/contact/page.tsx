// app/admin/(dashboard)/contact/page.tsx
import ContactMessages from "@/components/admin/ContactMessages";

export const metadata = {
  title: "Contact Messages • Admin",
};

export default function ContactPage() {
  return (
    <div className="p-6 md:p-8">
      <ContactMessages />
    </div>
  );
}
