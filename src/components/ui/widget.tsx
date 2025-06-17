
import {
  IconUserBolt,
  IconShoppingCart,
  IconUser,
} from "@tabler/icons-react";
type WidgetProps = {
  label: string;
  value: string | number;
   icon?: "admin" | "seller" | "user";
  color?: "blue" | "green" | "pink" |"dark" | "teal";
  showIcon?:boolean;
};
const iconMap = {
  admin: <IconUserBolt size={32} className="text-white" />,
  seller: <IconShoppingCart size={32} className="text-white" />,
  user: <IconUser size={32} className="text-white" />,
};

const bgMap = {
  blue: "bg-[#75DDDD] text-black",    
  green: "bg-[#09BC8A] text-black",   
  pink: "bg-[#508991] text-black",    
  dark: "bg-[#172A3A] text-white",    
  teal: "bg-[#004346] text-white",
};

export default function Widget({ label, value,icon="admin",color="blue",showIcon=true }:WidgetProps) {
  return (
     <div
      className={`flex justify-between items-center p-6 rounded-lg shadow-md text-sm ${bgMap[color]}`}
    >
      <div className="space-y-2">
        <p className="text-md font-semibold">{label}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
       {showIcon && icon && iconMap[icon] && <div>{iconMap[icon]}</div>}
    </div>
  );
}
