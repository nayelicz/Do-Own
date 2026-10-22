"use client";

import { useState } from "react";
import { Banknote, Info, Send, ShoppingBag } from "lucide-react";
import { Badge, Card, IconTile } from "@/components/ui/primitives";

type Option = "transferir" | "retirar" | "usar";

/**
 * Product Definition F09: "Mis activos → Retirar, Transferir o Usar".
 * Only "Transferir" works today. The other two are shown as "Próximamente"
 * with what is missing, so nothing is presented as withdrawable before it is.
 */
export function AssetActions({ unit }: { unit: string }) {
  const [open, setOpen] = useState<Option | null>(null);

  const options: {
    id: Option;
    title: string;
    icon: typeof Send;
    ready: boolean;
    text: string;
    missing?: string[];
  }[] = [
    {
      id: "transferir",
      title: "Transferir",
      icon: Send,
      ready: true,
      text: `Envía tus ${unit} a otra cuenta de Do-Own. Antes de confirmar ves cuánto envías, a quién y que la comisión la paga Do-Own.`,
    },
    {
      id: "retirar",
      title: "Retirar",
      icon: Banknote,
      ready: false,
      text: `Cambiar tus ${unit} por pesos y recibirlos en tu cuenta de banco.`,
      missing: [
        `Que los ${unit} tengan valor en dinero, respaldado por patrocinadores. Hoy son de prueba.`,
        "Pasar de la red de prueba de Stellar a la red real.",
        "Un proveedor autorizado en México que haga el cambio a pesos y verifique tu identidad.",
      ],
    },
    {
      id: "usar",
      title: "Usar",
      icon: ShoppingBag,
      ready: false,
      text: `Canjear tus ${unit} por productos, servicios o descuentos.`,
      missing: [
        "Tiendas y servicios aliados que acepten las recompensas.",
        "Beneficios reales para elegir dentro de la app.",
      ],
    },
  ];
  const current = options.find((o) => o.id === open);

  function choose(id: Option) {
    setOpen((value) => (value === id ? null : id));
    if (id === "transferir")
      document
        .querySelector(".transfer-card")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <Card className="asset-actions">
      <h2>¿Qué puedes hacer con tus {unit}?</h2>
      <div className="asset-actions-row">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            className={`asset-action ${o.ready ? "" : "is-soon"}`}
            aria-expanded={open === o.id}
            aria-controls="asset-action-detail"
            onClick={() => choose(o.id)}
          >
            <IconTile icon={o.icon} tone={o.ready ? "violet" : "neutral"} />
            <span>{o.title}</span>
            {o.ready ? (
              <Badge tone="mint">Disponible</Badge>
            ) : (
              <Badge tone="neutral">Próximamente</Badge>
            )}
          </button>
        ))}
      </div>
      {current && (
        <div
          id="asset-action-detail"
          className="asset-action-detail"
          role="region"
          aria-label={current.title}
        >
          <p>
            <strong>{current.title}:</strong> {current.text}
          </p>
          {current.missing && (
            <>
              <p className="field-hint">
                <Info size={14} /> Aún no está disponible. Para activarlo falta:
              </p>
              <ul>
                {current.missing.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </Card>
  );
}
