import { useState } from "react";

export default function UserForm({ user, onSubmit, onCancel }: any) {
  const [name, setName] = useState(user.name);
  const [password, setPassword] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const updatedUser = {
      id: user.id,
      name,
      ...(password && { password }),
    };
    onSubmit(updatedUser);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 border p-4 rounded bg-gray-50">
      <h3 className="text-lg font-semibold mb-2">Update User</h3>
      <div className="mb-2">
        <label className="block text-sm">Name</label>
        <input value={name} onChange={e => setName(e.target.value)} className="w-full border p-2 rounded" />
      </div>
      <div className="mb-2">
        <label className="block text-sm">New Password (optional)</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border p-2 rounded" />
      </div>
      <div className="flex gap-2 mt-3">
        <button type="submit" className="bg-green-500 text-white px-4 py-1 rounded">Update</button>
        <button type="button" onClick={onCancel} className="bg-gray-400 text-white px-4 py-1 rounded">Cancel</button>
      </div>
    </form>
  );
}
