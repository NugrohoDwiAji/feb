import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import ButtonPrimary from "@/components/elements/ButtonPrimary";
import FileDropzone from "@/components/admin/elements/FileDropZone";
import axios from "axios";
import SuccessAlert from "@/components/cards/AlertSucces";
import { u } from "framer-motion/m";

type Data = {
  id: string;
  title: string;
  file_path: string;
  uploadat: string;
};

export default function Pengumuman() {
  const [isInput, setIsInput] = useState(false);
  const [title, setTitle] = useState("");
  const [datas, setDatas] = useState<Data[] | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isConfirm, setisConfirm] = useState(false);
  const [uploadat, setUploadat] = useState<Date>();
  const [showAlert, setShowAlert] = useState(false);
  const [isUpdate, setIsUpdate] = useState({
    status: false,
    id: "",
  });

  const handleFileDrop = (files: File) => {
    setisConfirm(true);
    setFile(files);

    // Lanjutkan upload ke server atau simpan ke state
  };

  const handleSave = async () => {
    const data = {
      title: title,
      file: file,
      uploadat: uploadat,
    };
    try {
      await axios.post("/api/pengumuman", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setShowAlert(true);
      document.location.reload();
    } catch (error) {
      console.log("ini error", error);
    }
  };

  const handleGetMethode = async () => {
    try {
      const result = await axios.get("/api/pengumuman");
      setDatas(result.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleUpdate = async (id: string) => {
    const data = {
      title: title,
      file: file,
    };
    try {
      await axios.put(`/api/pengumumanDetails?id=${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      document.location.reload();
    } catch (error) {
      console.log("eror", error);
    }
  };

  const handleGetById = async (id: string) => {
    try {
      const result = await axios.get(`/api/pengumumanDetails?id=${id}`);
      setIsInput(true);
      setIsUpdate((pref) => ({
        ...pref,
        status: true,
        id: result.data.id,
      }));
      setTitle(result.data.title);
      setFile(result.data.file_path);
      setUploadat(result.data.uploadat);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/pengumuman?id=${id}`);
      document.location.reload();
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    handleGetMethode();
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-4xl text-gray-600 ">Pengumuman</h1>
      <ButtonPrimary
        ClassName="bg-blue-500 text-white hover:border-2 hover:border-blue-500 hover:bg-white hover:text-blue-500 ease-in-out duration-300 transition-all mt-5"
        onClick={() => setIsInput(!isInput)}
      >
        {isInput ? "Cancel" : "Input"}
      </ButtonPrimary>

      {isInput && (
        <div className="mt-16">
          <div className="flex gap-10 mb-10">
          <div className="flex gap-5">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              className="p-2 bg-white h-10  rounded-md border-2 border-blue-400  font-bold focus:outline-blue-600"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="flex gap-5">
            <label htmlFor="uploadat">Tanggal Pengumuman</label>
            <input
              type="date"
              id="uploadat"
              className="p-2 bg-white h-10  rounded-md border-2 border-blue-400  font-bold focus:outline-blue-600"
              onChange={(e) => setUploadat(new Date(e.target.value))}
            />
          </div>
               </div>
          <FileDropzone onDrop={handleFileDrop} />
          {isConfirm && (
            <div className="flex gap-5 w-full justify-center mt-5">
              <ButtonPrimary
                onClick={() =>
                  isUpdate.status ? handleUpdate(isUpdate.id) : handleSave()
                }
                ClassName="bg-blue-600 text-white"
              >
                Simpan
              </ButtonPrimary>
              <ButtonPrimary
                onClick={() => {
                  document.location.reload();
                }}
                ClassName="bg-red-600 text-white"
              >
                Batal
              </ButtonPrimary>
            </div>
          )}
        </div>
      )}
      <table className="table-fixed border-collapse mt-10  m-auto rounded-2xl">
        <thead className="text-white">
          <tr className="">
            <th className="lg:w-10 py-2 bg-blue-600 rounded-tl-md border-xl border-gray-300 ">
              No
            </th>
            <th className=" lg:w-lg bg-blue-600 border-x border-gray-300 ">
              Judul Pengumuman
            </th>
            <th className=" lg:w-lg bg-blue-600 border-x border-gray-300 ">
              File
            </th>
            <th className=" lg:w-56 bg-blue-600 rounded-tr-md border-gray-300 ">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {datas?.map((item, index) => (
            <tr key={index} className="border-b border-x border-gray-300">
              <td className="py-2 text-center bg-blue-100">{index + 1}</td>
              <td className="py-2 px-2 border-x border-gray-300 bg-blue-100">
                {item.title}
              </td>
              <td className="py-2 px-2 border-x border-gray-300 bg-blue-100">
                {item.file_path}
              </td>
              <td className="py-2 text-center bg-blue-100 flex gap-2 justify-center">
                <ButtonPrimary
                  ClassName="bg-yellow-500 text-white"
                  onClick={() => handleGetById(item.id)}
                >
                  Edit
                </ButtonPrimary>
                <ButtonPrimary
                  ClassName="bg-red-500 text-white"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </ButtonPrimary>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <SuccessAlert
        show={showAlert}
        onClose={() => setShowAlert(false)}
        message="Data berhasil disimpan ke database!"
        duration={4000} // Opsional: custom duration
      />
    </AdminLayout>
  );
}
