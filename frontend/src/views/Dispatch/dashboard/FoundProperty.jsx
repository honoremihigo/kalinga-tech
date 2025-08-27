import React, { useState, useEffect } from "react";
import { Trash2, X, View, Edit, ToggleLeft } from "lucide-react";
import { FoundPropertyService } from "../../../Services/Landing/FoundProperty";

const FoundPropertyManagement = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    bookingReference: "",
    itemCategory: "",
    itemDescription: "",
    approximateValue: "",
    foundLocation: "",            // changed from lostLocation to foundLocation
    preferredContact: "",
    bestContactTime: "",
    additionalNotes: "",
  });

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await FoundPropertyService.getAll();
      setReports(data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.message || "Failed to fetch found property reports");
    }
  };

  const handleShowModal = (report = null) => {
    setCurrentReport(report);
    setFormData(
      report
        ? {
            fullName: report.fullName,
            phoneNumber: report.phoneNumber,
            email: report.email || "",
            bookingReference: report.bookingReference || "",
            itemCategory: report.itemCategory,
            itemDescription: report.itemDescription,
            approximateValue: report.approximateValue || "",
            foundLocation: report.foundLocation,       // changed here too
            preferredContact: report.preferredContact,
            bestContactTime: report.bestContactTime || "",
            additionalNotes: report.additionalNotes || "",
            status: report.status || "Not claimed",
          }
        : {
            fullName: "",
            phoneNumber: "",
            email: "",
            bookingReference: "",
            itemCategory: "",
            itemDescription: "",
            approximateValue: "",
            foundLocation: "",
            preferredContact: "",
            bestContactTime: "",
            additionalNotes: "",
          }
    );
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setCurrentReport(null);
    setShowModal(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentReport) {
        await FoundPropertyService.update(currentReport.id, formData);
      } else {
        await FoundPropertyService.create(formData);
      }
      await loadReports();
      handleCloseModal();
    } catch (err) {
      setError(err.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;
    try {
      await FoundPropertyService.delete(id);
      await loadReports();
    } catch (err) {
      setError(err.message || "Failed to delete report");
    }
  };

  const handleActivate = async (id) => {
    try {
      await FoundPropertyService.activate(id);
      await loadReports();
    } catch (err) {
      setError(err.message || "Failed to activate report");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-sm text-gray-600">Loading found property reports...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <div className="text-red-600 text-sm">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Found Property Management</h3>
        <button
          onClick={() => handleShowModal()}
          className="px-4 py-2 text-xs font-medium text-white bg-blue-500 rounded-lg"
        >
          Add Found Property
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 max-h-[600px]">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">Full Name</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">Phone</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">Category</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">Description</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">Found Location</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">Status</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-center">{report.fullName}</td>
                <td className="px-4 py-2 text-center">{report.phoneNumber}</td>
                <td className="px-4 py-2 text-center">{report.itemCategory}</td>
                <td className="px-4 py-2 text-center">{report.itemDescription}</td>
                <td className="px-4 py-2 text-center">{report.foundLocation}</td>
                <td className="px-4 py-2 text-center">{report.status}</td>
                <td className="px-4 py-2 flex space-x-2 justify-center">
                  <button
                    onClick={() => handleShowModal(report)}
                    className="text-blue-500 hover:text-blue-700"
                    title="View"
                  >
                    <View className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleShowModal(report)}
                    className="text-blue-500 hover:text-blue-700"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(report.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleActivate(report.id)}
                    className="text-green-500 hover:text-green-700"
                    title="Activate"
                  >
                    <ToggleLeft className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">
              {currentReport ? "Edit Found Property Report" : "Add Found Property Report"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700">Full Name</label>
                  <input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleFormChange}
                    required
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">Phone Number</label>
                  <input
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleFormChange}
                    required
                    type="tel"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700">Email</label>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    type="email"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">Booking Reference</label>
                  <input
                    name="bookingReference"
                    value={formData.bookingReference}
                    onChange={handleFormChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">Item Category</label>
                  <input
                    name="itemCategory"
                    value={formData.itemCategory}
                    onChange={handleFormChange}
                    required
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">Item Description</label>
                  <input
                    name="itemDescription"
                    value={formData.itemDescription}
                    onChange={handleFormChange}
                    required
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700">Approximate Value</label>
                  <input
                    name="approximateValue"
                    value={formData.approximateValue}
                    onChange={handleFormChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    type="number"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">Found Location</label>
                  <input
                    name="foundLocation"
                    value={formData.foundLocation}
                    onChange={handleFormChange}
                    required
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700">Preferred Contact Method</label>
                  <select
                    name="preferredContact"
                    value={formData.preferredContact}
                    onChange={handleFormChange}
                    required
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  >
                    <option value="">Select contact method</option>
                    <option value="Phone">Phone</option>
                    <option value="Email">Email</option>
                    <option value="SMS">SMS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">Best Time to Contact</label>
                  <input
                    name="bestContactTime"
                    value={formData.bestContactTime}
                    onChange={handleFormChange}
                    placeholder="e.g., 9am - 5pm"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-700">Additional Notes</label>
                  <textarea
                    name="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={handleFormChange}
                    rows={3}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded-lg bg-gray-300 text-gray-700 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  {currentReport ? "Update Report" : "Add Report"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoundPropertyManagement;
