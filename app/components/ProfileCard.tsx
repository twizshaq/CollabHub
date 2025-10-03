// components/ProfileCard.tsx
import Link from 'next/link';

interface ProfileCardProps {
  title: string;
  description: string;
  color: string;
  linkTo: string;
}

export default function ProfileCard({ title, description, color, linkTo }: ProfileCardProps) {
  return (
    <Link href={linkTo} passHref>
        <div className={`p-6 border-4 rounded-xl cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-300 ${color}`}>
            <h3 className="text-xl font-bold mb-2 text-slate-800">{title}</h3>
            <p className="text-slate-600 mb-4">{description}</p>
            <span className="inline-block text-sm font-semibold text-blue-700 hover:text-blue-500">
                Start Session →
            </span>
        </div>
    </Link>
  );
}