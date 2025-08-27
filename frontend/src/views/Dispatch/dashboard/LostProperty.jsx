import React, { useState, useEffect } from "react";
import { Trash2, X,View, Edit, ToggleLeft } from "lucide-react";
import { LostPropertyService } from "../../../Services/Landing/LostPropertyService";

const LostPropertyManagement = () => {
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
    lostLocation: "",
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
      const data = await LostPropertyService.getAll();
      setReports(data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.message || "Failed to fetch lost property reports");
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
            lostLocation: report.lostLocation,
            preferredContact: report.preferredContact,
            bestContactTime: report.bestContactTime || "",
            additionalNotes: report.additionalNotes || "",
            status: report.status || "Not found",
          }
        : {
            fullName: "",
            phoneNumber: "",
            email: "",
            bookingReference: "",
            itemCategory: "",
            itemDescription: "",
            approximateValue: "",
            lostLocation: "",
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
        await LostPropertyService.update(currentReport.id, formData);
      } else {
        await LostPropertyService.create(formData);
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
      await LostPropertyService.delete(id);
      await loadReports();
    } catch (err) {
      setError(err.message || "Failed to delete report");
    }
  };

  const handleActivate = async (id) => {
    try {
      await LostPropertyService.activate(id);
      await loadReports();
    } catch (err) {
      setError(err.message || "Failed to activate report");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-sm text-gray-600">Loading lost property reports...</span>
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
        <h3 className="text-xl font-bold text-gray-800">Lost Property Management</h3>
        <button
          onClick={() => handleShowModal()}
          className="px-4 py-2 text-xs font-medium text-white bg-blue-500 rounded-lg"
        >
          Add Lost property
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
              <th className="px-4 py-3 text-center font-semibold text-gray-700">Lost Location</th>
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
                <td className="px-4 py-2 text-center">{report.lostLocation}</td>
                <td className="px-4 py-2 text-center">{report.status}</td>
                <td className="px-4 py-2 flex space-x-2 justify-center">
                       <button
                    onClick={() => handleShowModal(report)}
                    className="text-blue-500 hover:text-blue-700"
                    title="Edit"
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
              {currentReport ? "Edit Lost Property Report" : "Add Lost Property Report"}
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
                  <textarea
                    name="itemDescription"
                    value={formData.itemDescription}
                    onChange={handleFormChange}
                    required
                    rows={2}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm resize-none"
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
                  <label className="block text-xs font-medium text-gray-700">Lost Location</label>
                  <input
                    name="lostLocation"
                    value={formData.lostLocation}
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
                    <option value="">Select</option>
                    <option value="Phone">Phone</option>
                    <option value="Email">Email</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">Best Contact Time</label>
                  <input
                    name="bestContactTime"
                    value={formData.bestContactTime}
                    onChange={handleFormChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    type="time"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-700">Additional Notes</label>
                  <textarea
                    name="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={handleFormChange}
                    rows={3}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm resize-none"
                  />
                </div>
              
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  {currentReport ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LostPropertyManagement;
