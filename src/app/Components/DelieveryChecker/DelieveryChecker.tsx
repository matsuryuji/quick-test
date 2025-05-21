import { maskCEP } from "@/app/Utils/maskCEP";
import { ChangeEvent } from "react";

function DeliveryChecker({
  cep,
  setCep,
  savedAddress,
  onCheck,
  isChecking,
}: {
  cep: string;
  setCep: (value: string) => void;
  savedAddress: string | null;
  onCheck: () => void;
  isChecking: boolean;
}) {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const masked = maskCEP(e.target.value);
    setCep(masked);
  };

  return (
    <div className="mb-4">
      <label className="block font-semibold mb-1">Calcular Frete (CEP)</label>
      <div className="flex items-center gap-2">
        <input
          type="text"
          maxLength={9}
          value={cep}
          onChange={handleInputChange}
          placeholder="00000-000"
          className="border px-4 py-2 rounded-lg w-40"
        />
        <button
          onClick={onCheck}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          disabled={isChecking}
        >
          {isChecking ? "Verificando..." : "Verificar"}
        </button>
      </div>
      {savedAddress && <p className="mt-2 text-white">{savedAddress}</p>}
    </div>
  );
}

export default DeliveryChecker;
