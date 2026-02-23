import { useContext } from "react";
import { SynthContext } from "@/context/SynthContext";

export const useSynth = () => {
  const context = useContext(SynthContext);
  if (!context  ) {
    throw new Error("useSynth debe usarse dentro de un SynthProvider");
  }
  return context;
};