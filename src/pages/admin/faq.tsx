import React, { useState, useEffect } from "react";
import {
  Search,
  Edit2,
  Trash2,
  Eye,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
  Database,
} from "lucide-react";
import AdminLayout from "@/components/layouts/AdminLayout";
import axios from "axios";
import FormFaq from "@/components/admin/cards/FormFaq";

type QuestionAnswer = {
  id: string;
  question: string;
  answer: string;
  created_at: string;
};

export default function QuestionAnswerTable() {
  // Sample data - dalam implementasi nyata, ini akan diambil dari database
  const [allData, setAllData] = useState<QuestionAnswer[]>([]);

  const [filteredData, setFilteredData] = useState(allData);
  const [isDelete, setIsDelete] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedItem, setSelectedItem] = useState<QuestionAnswer | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Filter data berdasarkan search term
  useEffect(() => {
    const filtered = allData.filter(
      (item) =>
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1);
    handleGetItem();
  }, [searchTerm, allData]);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handleView = (item: QuestionAnswer ) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleEdit = (item: QuestionAnswer) => {
    alert(`Edit item dengan ID: ${item.id}`);
  };

  const handleDelete =async (item: QuestionAnswer) => {
    if (confirm(`Yakin ingin menghapus pertanyaan: "${item.question}"?`)) {
      try {
        await axios.delete(`/api/faq?id=${item.id}`);
         alert(`Item dengan ID ${item.id} dihapus (simulasi)`);
      } catch (error) {
        console.log(error)
      }
    }
   
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const handleGetItem = async () => {
    try {
      const result = await axios.get("/api/faq");
      setAllData(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl mb-4">
              <Database className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Daftar Pertanyaan & Jawaban
            </h1>
            <p className="text-purple-600 text-lg">
              Kelola dan lihat semua data Q&A yang tersimpan
            </p>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Cari pertanyaan atau jawaban..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                />
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Tampilkan:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    className="border border-purple-200 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-purple-500"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                </div>
                <button onClick={() => setIsDelete(!isDelete)} className="inline-flex cursor-pointer  items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-200">
                  <Plus className="w-4 h-4" />
                  Tambah Baru
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-4 pt-4 border-t border-purple-100">
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <span>
                  Total:{" "}
                  <strong className="text-purple-600">{allData.length}</strong>{" "}
                  item
                </span>
                <span>
                  Ditampilkan:{" "}
                  <strong className="text-purple-600">
                    {currentData.length}
                  </strong>{" "}
                  item
                </span>
                <span>
                  Halaman:{" "}
                  <strong className="text-purple-600">{currentPage}</strong>{" "}
                  dari <strong className="text-purple-600">{totalPages}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-lg border border-purple-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      #
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Pertanyaan
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Jawaban
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Tanggal Dibuat
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.length > 0 ? (
                    currentData.map((item, index) => (
                      <tr
                        key={item.id}
                        className="border-b border-purple-50 hover:bg-purple-25 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                          {startIndex + index + 1}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-800">
                            {truncateText(item?.question, 80)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600">
                            {truncateText(item?.answer, 100)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(item?.created_at).toLocaleDateString("id-ID")}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleView(item)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Lihat Detail"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(item)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Hapus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="text-gray-400">
                          <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p className="text-lg font-medium mb-2">
                            Tidak ada data
                          </p>
                          <p className="text-sm">
                            Coba ubah kata kunci pencarian atau tambah data baru
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-gray-50 px-6 py-4 border-t border-purple-100">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Menampilkan {startIndex + 1} -{" "}
                    {Math.min(endIndex, filteredData.length)} dari{" "}
                    {filteredData.length} hasil
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                      className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg disabled:text-gray-400 disabled:hover:bg-transparent transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {[...Array(totalPages)].map((_, i) => {
                      const page = i + 1;
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 2 && page <= currentPage + 2)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                              currentPage === page
                                ? "bg-purple-600 text-white"
                                : "text-purple-600 hover:bg-purple-50"
                            }`}
                          >
                            {page}
                          </button>
                        );
                      } else if (
                        page === currentPage - 3 ||
                        page === currentPage + 3
                      ) {
                        return (
                          <span key={page} className="px-2 text-gray-400">
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}

                    <button
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg disabled:text-gray-400 disabled:hover:bg-transparent transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Detail */}
        {showModal && selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-t-2xl">
                <h3 className="text-xl font-bold">
                  Detail Pertanyaan & Jawaban
                </h3>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    PERTANYAAN:
                  </h4>
                  <p className="text-gray-800 bg-purple-50 p-4 rounded-xl">
                    {selectedItem.question}
                  </p>
                </div>
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    JAWABAN:
                  </h4>
                  <p className="text-gray-800 bg-purple-50 p-4 rounded-xl">
                    {selectedItem.answer}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                  <div>
                    <span className="text-gray-500">Dibuat:</span>
                    <p className="text-gray-800 font-medium">
                      {new Date(selectedItem.created_at).toLocaleDateString(
                        "id-ID"
                      )}
                    </p>
                  </div>
                  {/* <div>
                    <span className="text-gray-500">Diperbarui:</span>
                    <p className="text-gray-800 font-medium">
                      {new Date(selectedItem.updated_at).toLocaleDateString(
                        "id-ID"
                      )}
                    </p>
                  </div> */}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(selectedItem)}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-xl hover:bg-green-700 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-xl hover:bg-gray-600 transition-colors"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="absolute right-0 left-0 top-20">
        {isDelete && <FormFaq cancel={()=>setIsDelete(!isDelete)}/>}      </div>
    </AdminLayout>
  );
}
