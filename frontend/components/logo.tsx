import Image from 'next/image';

export function Logo() {
  return (
    <div className="flex items-center gap-2 font-bold text-green-400 text-lg">
      <Image src="/logo.svg" alt="Logo" className="h-6 w-6" width={24} height={24} />
      Monitor
    </div>
  );
}
