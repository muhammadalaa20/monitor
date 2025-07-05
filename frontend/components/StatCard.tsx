import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StatCard({
  title,
  value,
  icon,
  children,
}: {
  title: string;
  value?: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <Card className="bg-[#111] border border-gray-700 h-full flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm text-gray-300 font-medium">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {value && (
          <div className="text-2xl font-bold text-green-400">{value}</div>
        )}
        {children}
      </CardContent>
    </Card>
  );
}