# Design System — Integra (MASTER)

> **Como usar:** ao montar uma tela, veja primeiro `design-system/integra/pages/<tela>.md`.
> Se existir, as regras dele **sobrescrevem** este arquivo; senão, siga este.
> Toda tela nova ou redesenhada passa pela skill **ui-ux-pro-max** (ver `docs/CONVENCOES.md`).

Gerado com a skill ui-ux-pro-max em 03/10/2026 (consulta: "B2B SaaS admin dashboard finance HR
management professional"; densidade 7, variância 3, movimento 3) e ajustado para aplicativo:
o resultado original trazia padrões de landing page (hero, CTA laranja, GSAP), que **não** se aplicam.

- **Produto:** SaaS B2B de gestão administrativa, financeira, operacional e de RH.
- **Estilo:** Minimalismo / Suíço — limpo, funcional, alto contraste, grid, sans-serif.
- **Densidade:** padrão para dados (tabelas e formulários), sem apertar áreas de toque.
- **Modo claro** é o padrão; **modo escuro** suportado (seletor no menu e no login).

---

## Cores (tokens)

Definidas em `frontend/src/index.css` como variáveis HSL do shadcn e usadas pelas classes do
Tailwind (`bg-primary`, `text-muted-foreground`...). **Nunca use hex direto nos componentes.**

| Token | Claro | Escuro | Uso |
|---|---|---|---|
| `background` | `#F8FAFC` | `#0F172A` | Fundo da página |
| `foreground` | `#0F172A` | `#F1F5F9` | Texto principal |
| `card` / `popover` | `#FFFFFF` | `#1E293B` | Superfícies |
| `primary` | `#2563EB` | `#60A5FA` | Ação principal, links, foco |
| `primary-foreground` | `#FFFFFF` | `#0F172A` | Texto sobre `primary` |
| `secondary` | `#F1F5F9` | `#334155` | Botões secundários |
| `muted` | `#F1F5F9` | `#1E293B` | Fundos discretos |
| `muted-foreground` | `#475569` | `#94A3B8` | Texto secundário |
| `accent` / `accent-foreground` | `#EFF6FF` / `#1D4ED8` | `#1E3A5F` / `#BFDBFE` | Item de menu ativo, seleção |
| `destructive` | `#DC2626` | `#F87171` | Erros, ações destrutivas |
| `success` | `#15803D` | `#4ADE80` | Status positivo |
| `warning` | `#B45309` | `#FBBF24` | Atenção, vencendo |
| `border` | `#E2E8F0` | `#334155` | Divisórias e cards (decorativo) |
| `input` | `#8492A6` | `#64748B` | Borda de campos (≥ 3:1) |
| `ring` | `#2563EB` | `#60A5FA` | Anel de foco |

**Contraste verificado** (WCAG): todo texto ≥ 4,5:1 sobre seu fundo nos dois modos (ex.: primário
5,17:1, sucesso 5,02:1, alerta 5,02:1, destrutivo 4,83:1, texto secundário 7,58:1 no claro);
borda de campo e anel de foco ≥ 3:1.

**Status:** a cor nunca é o único sinal. Use `StatusBadge` (texto + ícone; o texto fica em
`foreground` e a cor do status no ícone, na borda e no fundo suave).

## Tipografia

- **Fonte:** Plus Jakarta Sans (Google Fonts, pesos 400/500/600/700, `display=swap`), com fallback
  para a pilha sans do sistema.
- **Escala:** título de página `text-2xl font-bold tracking-tight`; título de seção/diálogo
  `text-lg font-semibold`; corpo `text-sm` (14px) em telas densas, `text-base` em campos no celular;
  apoio `text-xs`/`text-sm text-muted-foreground`. Nada abaixo de 12px.
- **Números** (valores, datas, documentos, contagens): `tabular-nums`, alinhados à direita em
  colunas numéricas.

## Espaçamento, forma e profundidade

- Ritmo de 4/8px (escala do Tailwind). Página: `p-4` (celular) → `p-6` → `p-8` (desktop);
  `space-y-6` entre blocos; largura máxima `max-w-7xl`.
- Raio: `--radius: 0.5rem` (cantos discretos, geométricos).
- Sombra: só `shadow-card` (1–3px, quase imperceptível). Sem gradientes, brilhos ou cards que
  "sobem" no hover.

## Movimento

- Transições de cor/sombra 150–250ms; entrada de página `animate-fade-in` (250ms, 10px).
- `prefers-reduced-motion` desliga animações (regra global em `index.css`).
- Sem bibliotecas de animação (GSAP etc.).

## Ícones

- **lucide-react** (já usado no projeto), traço padrão, `h-4 w-4` em botões/badges e `h-5 w-5` no menu.
- Ícone ao lado de texto: `aria-hidden="true"`. Botão só com ícone: `aria-label` obrigatório.
- Nunca emoji como ícone.

---

## Componentes base (`frontend/src/components/`)

| Componente | Quando usar |
|---|---|
| `PageHeader` | Topo de toda tela: `h1`, descrição e **uma** ação principal |
| `DataTable` | Toda listagem: colunas declarativas, rolagem horizontal no celular, esqueleto ao carregar, erro com "Tentar novamente", vazio com `EstadoVazio`, `legenda` para leitores de tela |
| `EstadoVazio` | Lista/área sem conteúdo: ícone, mensagem e ação que resolve |
| `CampoFormulario` | Todo campo: rótulo visível, `*` em obrigatório, ajuda permanente, erro logo abaixo ligado por `aria-describedby` |
| `StatusBadge` | Status (sucesso, perigo, alerta, info, neutro) com texto + ícone |
| `ConfirmarAcao` | Antes de suspender, excluir, fechar folha etc.; vermelho quando `destrutivo` |
| `Marca`, `SeletorTema` | Identidade e alternância claro/escuro |
| `components/ui/*` | Primitivos shadcn (Button, Input, Dialog, Table...) |

Exemplo de referência: `frontend/src/modules/plataforma/OrganizacoesPage.tsx`.

## Padrões de tela

- **Layout:** menu lateral fixo no desktop (recolhível para ícones), gaveta no celular com barra
  superior; link "Pular para o conteúdo"; foco vai para o conteúdo ao trocar de rota.
- **Formulários:** validação no envio; erros da API (422) aparecem no campo; foco no primeiro campo
  inválido; botão desabilitado com indicador "Salvando..." durante o envio; aviso (toast) de sucesso.
- **Ações destrutivas:** sempre `ConfirmarAcao`, explicando a consequência; o botão da tabela
  fica neutro, o vermelho aparece só na confirmação.
- **Diálogos:** para criar/editar registros curtos; formulários longos são páginas.

---

## Anti-padrões (não usar)

- ❌ Gradientes, brilhos (`glow`), sombras fortes, cards que sobem no hover
- ❌ Cor como único indicador de status
- ❌ Placeholder no lugar de rótulo
- ❌ Erros só no topo ou só em toast
- ❌ Botão só com ícone sem `aria-label`
- ❌ Hex direto em componente (use tokens)
- ❌ Modo escuro como padrão
- ❌ Animações longas ou decorativas; bibliotecas de animação
- ❌ Classes legadas do protótipo em código novo (`bg-gradient-ocean`, `shadow-ocean`, `shadow-glow`)

## Checklist antes de entregar uma tela

- [ ] Usa `PageHeader` e, se listar dados, `DataTable` com estados de carregando/erro/vazio
- [ ] Campos com `CampoFormulario`; erros da API no campo certo
- [ ] Contraste ≥ 4,5:1 em texto nos modos claro **e** escuro
- [ ] Navegável só com teclado, foco visível
- [ ] Ícones decorativos com `aria-hidden`, botões só com ícone com `aria-label`
- [ ] Sem rolagem horizontal da página em 375px (tabelas rolam dentro do card)
- [ ] Ação destrutiva com `ConfirmarAcao`
- [ ] Números com `tabular-nums`; datas e documentos formatados (`lib/formatar.ts`)
