# ML SEO Analyzer

MVP de uma plataforma para análise e otimização de anúncios do Mercado Livre.

## O que já funciona

- Interface SaaS responsiva
- Análise por URL ou dados manuais
- SEO Score
- Extração/classificação inicial de palavras-chave
- Sugestão de título
- Sugestão de descrição
- Recomendações de otimização
- Estrutura de comparação de concorrentes
- Copiar resultados
- API interna `/api/analyze`
- Arquitetura pronta para integração com APIs externas e IA

## Rodar localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`.

## Build

```bash
npm run build
npm start
```

## Vercel

1. Suba o projeto para GitHub.
2. Importe o repositório na Vercel.
3. Configure as variáveis de ambiente usando `.env.example`.
4. Faça o deploy.

## Próxima etapa recomendada

Integrar a API oficial do Mercado Livre, banco de dados, autenticação e um provedor de IA no backend. A camada de integração deve respeitar os termos, limites e políticas do Mercado Livre e não deve depender de scraping frágil.

## Observação

O SEO Score desta versão é heurístico e serve como base do produto. Ele não representa um ranking oficial do Mercado Livre e não garante posicionamento, vendas ou conversão.

## Estrutura obrigatória para Vercel

O conteúdo desta pasta deve estar na **raiz do repositório GitHub**. A raiz deve conter diretamente:

- `package.json`
- `app/`
- `components/`
- `tsconfig.json`

Não coloque todos esses arquivos dentro de outra pasta, como `ml-seo-analyzer/`, a menos que o Root Directory do projeto na Vercel seja configurado para essa subpasta.
