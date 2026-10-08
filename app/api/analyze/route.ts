import { NextResponse } from "next/server";

type RequestBody = {
  url?: string;
  title?: string;
  description?: string;
  category?: string;
  features?: string;
};

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractTerms(text: string) {
  const stop = new Set([
    "para","com","sem","uma","um","de","da","do","das","dos","e","ou","em",
    "no","na","nos","nas","por","que","produto","original","novo","nova",
    "mercado","livre","venda","kit","peca","pecas"
  ]);
  const words = normalize(text).split(" ").filter(w => w.length >= 3 && !stop.has(w));
  const freq = new Map<string, number>();
  for (const w of words) freq.set(w, (freq.get(w) || 0) + 1);
  return [...freq.entries()]
    .sort((a,b) => b[1]-a[1])
    .slice(0, 15)
    .map(([term, count], i) => ({
      term,
      score: Math.max(55, Math.min(96, 92 - i * 2 + Math.min(count * 2, 6))),
      type: i === 0 ? "Principal" : i < 5 ? "Secundária" : "Relacionada",
      intent: "Transacional"
    }));
}

export async function POST(req: Request) {
  const body = (await req.json()) as RequestBody;
  const title = body.title?.trim() || "";
  const description = body.description?.trim() || "";
  const category = body.category?.trim() || "";
  const features = body.features?.trim() || "";

  if (!title && !description && !features && !body.url) {
    return NextResponse.json({ error: "Informe uma URL ou dados do produto." }, { status: 400 });
  }

  const source = [title, category, features, description].filter(Boolean).join(" ");
  const keywords = extractTerms(source);

  const titleScore = title
    ? Math.min(100, 45 + Math.min(title.length, 60) / 2 + (keywords[0] && normalize(title).includes(keywords[0].term) ? 20 : 0))
    : 35;

  const descriptionScore = description ? Math.min(100, 55 + Math.min(description.length / 100, 30)) : 30;
  const featureScore = features ? Math.min(100, 50 + Math.min(features.split("\n").filter(Boolean).length * 5, 40)) : 25;
  const overall = Math.round(titleScore * .35 + descriptionScore * .25 + featureScore * .2 + 75 * .2);

  const main = keywords[0]?.term || "produto";
  const optimizedTitle = title
    ? `${main} ${title.replace(new RegExp(main, "ig"), "").trim()}`.replace(/\s+/g, " ").trim()
    : `${main} | produto otimizado para Mercado Livre`;

  const recommendations = [
    title ? (title.length > 60 ? "Avalie reduzir o título para concentrar os termos mais relevantes." : "Título com extensão adequada; priorize o termo principal no início.") : "Cadastre um título com produto, marca/modelo e especificações relevantes.",
    description ? "Inclua aplicações, especificações e benefícios reais sem repetir palavras artificialmente." : "Adicione uma descrição completa baseada somente nas características reais do produto.",
    features ? "Preencha os atributos específicos da categoria sempre que essas informações estiverem disponíveis." : "Complete as características técnicas do produto.",
    keywords.length ? `Considere trabalhar naturalmente os termos: ${keywords.slice(0,5).map(k => k.term).join(", ")}.` : "Adicione mais informações para aumentar a qualidade da análise."
  ];

  return NextResponse.json({
    product: {
      url: body.url || "",
      title: title || "Produto informado manualmente",
      category: category || "Não identificada"
    },
    score: Math.max(0, Math.min(100, overall)),
    scores: {
      title: Math.round(titleScore),
      description: Math.round(descriptionScore),
      features: Math.round(featureScore),
      relevance: 75
    },
    keywords,
    optimizedTitle,
    optimizedDescription: description
      ? `${description}\n\nPrincipais informações do produto:\n${features || "Complete as características técnicas do produto."}`
      : `Apresente claramente o ${main}, suas características, aplicações, compatibilidades e especificações técnicas reais.`,
    recommendations,
    competitors: [
      { name: "Concorrente 1", score: 84, opportunity: "Comparar título e atributos" },
      { name: "Concorrente 2", score: 79, opportunity: "Comparar termos relacionados" },
      { name: "Concorrente 3", score: 76, opportunity: "Comparar completude" }
    ]
  });
}