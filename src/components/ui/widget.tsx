
import {
  IconUserBolt,
  IconShoppingCart,
  IconUser,
} from "@tabler/icons-react";
type WidgetProps = {
  label: string;
  value: string | number;
   icon?: "admin" | "seller" | "user";
  color?: "blue" | "green" | "pink";
  showIcon?:boolean;
};
const iconMap = {
  admin: <IconUserBolt size={32} className="text-white" />,
  seller: <IconShoppingCart size={32} className="text-white" />,
  user: <IconUser size={32} className="text-white" />,
};
const bgMap = {
  blue: "bg-gradient-to-r from-blue-400 to-blue-500",
  green: "bg-gradient-to-r from-green-400 to-teal-400",
  pink: "bg-gradient-to-r from-pink-400 to-pink-500",
};

export default function Widget({ label, value,icon="admin",color="blue",showIcon=true }:WidgetProps) {
  return (
     <div
      className={`flex justify-between items-center p-6 rounded-lg shadow-md text-white ${bgMap[color]}`}
    >
      <div className="space-y-2">
        <p className="text-md font-semibold">{label}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
       {showIcon && icon && iconMap[icon] && <div>{iconMap[icon]}</div>}
    </div>
  );
}
