"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { InfoState } from "./Interface/InfoState";
import { ViaCEPResponse } from "./Interface/ViaCEP";
import { Product } from "./Interface/Product";

import ImageGallery from "./Components/ImageGallery/ImageGallery";
import VariantSelector from "./Components/VariantSelector/VariantSelector";
import DeliveryChecker from "./Components/DelieveryChecker/DelieveryChecker";

import TENIS1 from "../../public/images/tenis1.webp";
import TENIS2 from "../../public/images/tenis2.webp";
import TENIS3 from "../../public/images/tenis3.webp";

const DUMMY_PRODUCT: Product = {
  title: "Tênis Esportivo",
  price: 320,
  images: [TENIS1, TENIS2, TENIS3],
  variants: {
    sizes: ["38", "39", "40", "41", "42"],
    colors: ["Preto", "Branco", "Azul"],
  },
};

const LOCAL_STORAGE_KEY = "product-selection";

export default function ProductPage() {
  const [mainImage, setMainImage] = useState<string>(DUMMY_PRODUCT.images[0]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [cep, setCep] = useState<string>("");
  const [savedAddress, setSavedAddress] = useState<string | null>(null);
  const cleanCep = useMemo(() => cep.replace(/\D/g, ""), [cep]);

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed: InfoState = JSON.parse(saved);
      if (parsed && parsed.timestamp > Date.now() - 15 * 60 * 1000) {
        setSelectedSize(parsed.size);
        setSelectedColor(parsed.color);
        setMainImage(parsed.image || DUMMY_PRODUCT.images[0]);
        setCep(parsed.cep || "");
      }
    }
  }, []);

  useEffect(() => {
    const data: InfoState = {
      size: selectedSize,
      color: selectedColor,
      image: mainImage,
      cep,
      timestamp: Date.now(),
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  }, [selectedSize, selectedColor, mainImage, cep]);

  const { refetch, isFetching } = useQuery<string, Error>({
    queryKey: ["cep", cleanCep],
    queryFn: async () => {
      if (cleanCep.length !== 8) throw new Error("CEP inválido");
      const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data: ViaCEPResponse = await res.json();
      if (data.erro) return "CEP não encontrado.";
      return `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
    },
    enabled: false,
  });

  const handleCEPCheck = useCallback(async () => {
    if (cleanCep.length !== 8) return;

    try {
      const { data } = await refetch();

      if (data) setSavedAddress(data);
    } catch {
      setSavedAddress("CEP não encontrado.");
    }
  }, [cleanCep, refetch]);

  const productTitle = useMemo(() => DUMMY_PRODUCT.title, []);
  const productPrice = useMemo(() => DUMMY_PRODUCT.price.toFixed(2), []);

  return (
    <div className="max-w-5xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-8">
      <ImageGallery
        images={DUMMY_PRODUCT.images}
        mainImage={mainImage}
        onSelect={setMainImage}
      />

      <div>
        <h1 className="text-3xl font-bold mb-2">{productTitle}</h1>
        <p className="text-2xl text-green-600 font-semibold mb-4">
          R$ {productPrice}
        </p>

        <VariantSelector
          label="Tamanho"
          options={DUMMY_PRODUCT.variants.sizes}
          selected={selectedSize}
          onSelect={setSelectedSize}
        />
        <VariantSelector
          label="Cor"
          options={DUMMY_PRODUCT.variants.colors}
          selected={selectedColor}
          onSelect={setSelectedColor}
        />

        <DeliveryChecker
          cep={cep}
          setCep={setCep}
          savedAddress={savedAddress}
          onCheck={handleCEPCheck}
          isChecking={isFetching}
        />
      </div>
    </div>
  );
}
