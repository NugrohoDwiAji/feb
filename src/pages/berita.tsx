import React from "react";
import { useState } from "react";
import axios from "axios";
import CardBerita from "@/components/cards/CardBerita";
import { useEffect } from "react";

type DataBerita = {
  id: string;
  title: string;
  description: string;
  filepath: string;
  uploudat: string;
};

export default function Berita() {
  const [dataBerita, setDataBerita] = useState<DataBerita[]>([]);

  const handleGetBerita = async () => {
    try {
      const result = await axios.get("/api/berita");
      setDataBerita(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetBerita();
  }, []);

  return (
    <div className="min-h-screen">
      <div className="relative h-80 md:h-96 lg:h-[43rem]">
        <img
          src="/img/banner-feb.png"
          alt=""
          className="w-full bg-cover h-full"
        />
        <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col justify-center p-10 ">
          <h1 className="text-white text-3xl md:text-4xl lg:text-6xl font-bold text-shadow-lg/20">
            Berita
          </h1>
          <h2 className="text-white mt-3 text-shadow-lg/10">Berita Fakultas Ekonomi dan Bisnis</h2>
        </div>
      </div>

      {/* Main */}
      <main>
        <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-cyan-400 text-shadow-lg/20 text-center">
          Berita
        </h1>

        <div className="flex flex-wrap gap-5 justify-center">
          {dataBerita.map((item, index) => (
            <div key={index} className="my-4">
              <CardBerita
                key={index}
                img={item.filepath}
                content={item.description}
                title={item.title}
                date={item.uploudat}
                id={item.id}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
