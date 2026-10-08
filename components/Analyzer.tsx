 "use client";

import { useState } from "react";
import {
  Search, BarChart3, Sparkles, Copy, Check, ChevronRight,
  AlertTriangle, Target, FileText, Tags, Trophy, RefreshCw
} from "lucide-react";

type Result = {
  product: { url: string; title: string; category: string };
  score: number;
  scores: { title: number; description: number; features: number; relevance: number };
  keywords: { term: string; score: number; type: string; intent: string }[];
  optimizedTitle: string;
  optimizedDescription: string;
  recommendations: string[];
  competitors: { name: string; score: number; opportunity: string }[];
};

function scoreClass(score: number) {
  if (score >= 80) return "good";
  if (score >= 60) return "medium";
  return "bad";
}

export default function Analyzer() {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [features, setFeatures] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  async function analyze() {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, title, description, category, features })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao analisar.");
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível realizar a análise.");
    } finally {
      setLoading(false);
    }
  }

  async function copy(text: string, key: string) {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 1800);
  }

  return (
    <main>
      <header className="topbar">
        <div className="brand"><div className="brandIcon"><Sparkles size={20}/></div><span>ML SEO Analyzer</span></div>
        <nav><a href="#analisar">Analisar produto</a><a href="#resultado">Resultados</a><a href="#como">Como funciona</a></nav>
        <button className="outlineBtn">Nova análise</button>
      </header>

      <section className="hero">
        <div className="heroBadge"><Sparkles size={15}/> SEO inteligente para Mercado Livre</div>
        <h1>Transforme seu anúncio em uma<br/><span>máquina de relevância.</span></h1>
        <p>Analise títulos, descrições, características e palavras-chave para descobrir oportunidades de otimização no seu anúncio.</p>
      </section>

      <section id="analisar" className="workspace">
        <div className="panel inputPanel">
          <div className="panelHead"><div><h2>Analisar produto</h2><p>Informe a URL ou os dados do anúncio.</p></div><Target size={23}/></div>

          <label>URL do anúncio Mercado Livre</label>
          <div className="urlBox"><Search size={18}/><input value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://produto.mercadolivre.com.br/..." /></div>

          <div className="divider"><span>ou análise manual</span></div>

          <label>Título atual</label>
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Ex.: Spot Sobrepor MR16 com Lâmpada..." />

          <div className="two">
            <div><label>Categoria</label><input value={category} onChange={e=>setCategory(e.target.value)} placeholder="Iluminação" /></div>
            <div><label>Características</label><input value={features} onChange={e=>setFeatures(e.target.value)} placeholder="MR16, LED, branco..." /></div>
          </div>

          <label>Descrição atual</label>
          <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Cole aqui a descrição do anúncio..." rows={7}/>

          {error && <div className="error"><AlertTriangle size={17}/>{error}</div>}
          <button className="primaryBtn" onClick={analyze} disabled={loading}>
            {loading ? <><RefreshCw className="spin" size={18}/> Analisando...</> : <><Sparkles size={18}/> Analisar anúncio</>}
          </button>
        </div>

        <div className="panel introPanel">
          <div className="miniIcon"><BarChart3/></div>
          <h3>O que será analisado?</h3>
          {[
            ["01","Palavras-chave","Identificação e priorização dos termos mais relevantes."],
            ["02","Título","Diagnóstico e versões otimizadas."],
            ["03","Descrição","Estrutura, relevância e oportunidades."],
            ["04","Características","Campos e informações que podem ser melhor aproveitados."],
            ["05","Concorrência","Estrutura preparada para comparar anúncios concorrentes."]
          ].map(x=><div className="step" key={x[0]}><b>{x[0]}</b><div><strong>{x[1]}</strong><p>{x[2]}</p></div></div>)}
        </div>
      </section>

      {result && <section id="resultado" className="results">
        <div className="resultHeader">
          <div><span className="eyebrow">RESULTADO DA ANÁLISE</span><h2>{result.product.title}</h2><p>{result.product.category}</p></div>
          <div className={`score ${scoreClass(result.score)}`}><small>SEO SCORE</small><strong>{result.score}</strong><span>/100</span></div>
        </div>

        <div className="scoreGrid">
          {[
            { name: "Título", value: result.scores.title, Icon: FileText },
            { name: "Descrição", value: result.scores.description, Icon: FileText },
            { name: "Características", value: result.scores.features, Icon: Tags },
            { name: "Relevância", value: result.scores.relevance, Icon: Target }
          ].map(({ name, value, Icon }) => (
            <div className="metric" key={name}>
              <Icon size={18} />
              <div><span>{name}</span><b>{value}</b></div>
              <div className="bar"><i style={{ width: `${value}%` }} /></div>
            </div>
          ))}
        </div>

        <div className="resultGrid">
          <div className="panel resultCard">
            <div className="cardTitle"><div><span className="eyebrow">KEYWORD RESEARCH</span><h3>Palavras-chave recomendadas</h3></div><Tags/></div>
            <div className="keywordTable">
              <div className="thead"><span>Palavra-chave</span><span>Tipo</span><span>Intenção</span><span>Score</span></div>
              {result.keywords.map(k=><div className="tr" key={k.term}><strong>{k.term}</strong><span>{k.type}</span><span>{k.intent}</span><b>{k.score}</b></div>)}
            </div>
          </div>

          <div className="panel resultCard">
            <div className="cardTitle"><div><span className="eyebrow">OTIMIZAÇÃO</span><h3>Título recomendado</h3></div><Trophy/></div>
            <div className="copyBox"><p>{result.optimizedTitle}</p><button onClick={()=>copy(result.optimizedTitle,"title")}>{copied==="title"?<Check/>:<Copy/>}{copied==="title"?"Copiado":"Copiar"}</button></div>
            <div className="recommendations">
              <h4><Sparkles size={16}/> Recomendações</h4>
              {result.recommendations.map((r,i)=><div className="recommendation" key={i}><ChevronRight size={16}/>{r}</div>)}
            </div>
          </div>
        </div>

        <div className="panel resultCard descriptionCard">
          <div className="cardTitle"><div><span className="eyebrow">DESCRIÇÃO</span><h3>Descrição otimizada</h3></div><button className="smallBtn" onClick={()=>copy(result.optimizedDescription,"desc")}>{copied==="desc"?<Check/>:<Copy/>} {copied==="desc"?"Copiado":"Copiar"}</button></div>
          <div className="description">{result.optimizedDescription}</div>
        </div>

        <div className="panel resultCard">
          <div className="cardTitle"><div><span className="eyebrow">OPORTUNIDADES</span><h3>O que melhorar no anúncio</h3></div><AlertTriangle/></div>
          <div className="opportunityGrid">
            {result.recommendations.map((r,i)=><div className="opportunity" key={i}><span>{String(i+1).padStart(2,"0")}</span><p>{r}</p></div>)}
          </div>
        </div>

        <div className="panel resultCard">
          <div className="cardTitle"><div><span className="eyebrow">CONCORRÊNCIA</span><h3>Estrutura de comparação</h3></div><Trophy/></div>
          <div className="competitors">
            {result.competitors.map(c=><div className="competitor" key={c.name}><div><strong>{c.name}</strong><span>{c.opportunity}</span></div><b>{c.score}/100</b></div>)}
          </div>
          <div className="notice">Nesta versão, a comparação de concorrentes está estruturada para receber a integração oficial/API e dados públicos permitidos do Mercado Livre. Não são inventados dados reais de concorrentes.</div>
        </div>
      </section>}

      <section id="como" className="how">
        <span className="eyebrow">FLUXO</span><h2>Analisar → Encontrar → Otimizar</h2>
        <p>A ferramenta foi estruturada para evoluir de um analisador simples para uma plataforma completa de SEO para marketplaces.</p>
      </section>

      <footer>ML SEO Analyzer · Ferramenta de apoio à otimização de anúncios. SEO não garante posicionamento ou vendas.</footer>
    </main>
  );
}