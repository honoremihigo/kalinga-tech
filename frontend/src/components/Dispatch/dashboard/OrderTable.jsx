import { Edit, X } from 'lucide-react';

const OrderTable = ({ orders }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Order</h3>
      <table className="w-full text-left">
        <thead>
          <tr className="text-sm text-gray-600 border-b">
            <th className="p-2">ORDER ID</th>
            <th className="p-2">CUSTOMER</th>
            <th className="p-2">ITEMS</th>
            <th className="p-2">TOTAL</th>
            <th className="p-2">CREATED</th>
            <th className="p-2">MODIFIED</th>
            <th className="p-2">STATUS</th>
            <th className="p-2">ACTION</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={index} className="border-b text-sm">
              <td className="p-2 text-blue-600">{order.id}</td>
              <td className="p-2 flex items-center space-x-2">
                <img src={order.avatar} alt="Customer" className="w-8 h-8 rounded-full" />
                <span>{order.customer}</span>
              </td>
              <td className="p-2">{order.items}</td>
              <td className="p-2">{order.total}</td>
              <td className="p-2">{order.created}</td>
              <td className="p-2">{order.modified}</td>
              <td className="p-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    order.status === 'Delivered'
                      ? 'bg-green-100 text-green-600'
                      : order.status === 'Canceled'
                      ? 'bg-red-100 text-red-600'
                      : order.status === 'Pending'
                      ? 'bg-yellow-100 text-yellow-600'
                      : 'bg-blue-100 text-blue-600'
                  }`}
                >
                  {order.status}
                </span>
              </td>
              <td className="p-2 flex space-x-2">
                <button className="p-1 rounded-full bg-gray-100 hover:bg-gray-200">
                  <Edit className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-1 rounded-full bg-gray-100 hover:bg-gray-200">
                  <X className="w-4 h-4 text-red-600" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-600">1 of 3</p>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border rounded-lg">Prev</button>
          <button className="px-3 py-1 bg-teal-600 text-white rounded-lg">1</button>
          <button className="px-3 py-1 border rounded-lg">2</button>
          <button className="px-3 py-1 border rounded-lg">Next</button>
        </div>
      </div>
    </div>
  );
};

export default OrderTable;