const SummaryCard = ({ title, value, subValue, items }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      {title && (
        <div className="flex items-center mb-4">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-teal-600">{value}%</span>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-600">Last 6 months</p>
          </div>
        </div>
      )}
      <div className="flex justify-between items-center">
        <span className="text-lg font-semibold text-green-600">{value}</span>
        <span className="text-lg font-semibold text-red-600">{subValue}</span>
      </div>
      <p className="text-sm text-gray-600 mt-2">Delivered | Canceled</p>

      {items && (
        <div className="mt-4">
          {items.map((item, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-t">
              <div>
                <p className="text-sm font-medium text-gray-800">{item.name}</p>
                <p className="text-xs text-gray-600">{item.id}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800">{item.date}</p>
                <p className="text-sm text-gray-800">{item.price}</p>
                <p
                  className={`text-xs font-medium ${
                    item.stock === 'Low Stock'
                      ? 'text-yellow-600'
                      : item.stock === 'Out of Stock'
                      ? 'text-red-600'
                      : 'text-green-600'
                  }`}
                >
                  {item.stock}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{item.quantity}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SummaryCard;