export interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export interface Conversation {
  id: string;
  title: string;
  preview: string;
  updatedAt: Date;
  messages: Message[];
}

export function createMessage(
  content: string,
  sender: "user" | "bot"
): Message {
  return {
    id: crypto.randomUUID(),
    content,
    sender,
    timestamp: new Date(),
  };
}

export function getMockConversations(): Conversation[] {
  const now = new Date();
  const today = new Date(now);
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const lastWeek = new Date(now);
  lastWeek.setDate(lastWeek.getDate() - 4);

  return [
    {
      id: "1",
      title: "Como funciona a fotossíntese?",
      preview: "A fotossíntese é o processo pelo qual...",
      updatedAt: new Date(today.setHours(14, 30)),
      messages: [
        {
          id: "m1",
          content: "Me explica como funciona a fotossíntese?",
          sender: "user",
          timestamp: new Date(today.setHours(14, 28)),
        },
        {
          id: "m2",
          content:
            "A fotossíntese é o processo pelo qual as plantas convertem luz solar, água e dióxido de carbono em glicose e oxigênio. Ocorre principalmente nas folhas, nos cloroplastos que contêm clorofila — o pigmento verde responsável por captar a energia luminosa.",
          sender: "bot",
          timestamp: new Date(today.setHours(14, 28)),
        },
      ],
    },
    {
      id: "2",
      title: "Receita de bolo de chocolate",
      preview: "Aqui está uma receita deliciosa...",
      updatedAt: new Date(today.setHours(10, 15)),
      messages: [
        {
          id: "m3",
          content: "Me dá uma receita de bolo de chocolate?",
          sender: "user",
          timestamp: new Date(today.setHours(10, 12)),
        },
        {
          id: "m4",
          content:
            "Aqui está uma receita deliciosa de bolo de chocolate! Ingredientes: 3 ovos, 2 xícaras de farinha de trigo, 1 xícara de chocolate em pó, 2 xícaras de açúcar, 1 xícara de óleo, 1 xícara de leite morno, 1 colher de fermento.",
          sender: "bot",
          timestamp: new Date(today.setHours(10, 12)),
        },
      ],
    },
    {
      id: "3",
      title: "Dicas de produtividade",
      preview: "Existem várias técnicas...",
      updatedAt: yesterday,
      messages: [
        {
          id: "m5",
          content: "Quais são as melhores dicas de produtividade?",
          sender: "user",
          timestamp: yesterday,
        },
        {
          id: "m6",
          content:
            "Existem várias técnicas excelentes! A Técnica Pomodoro (25 min de foco + 5 min de pausa), a Matriz de Eisenhower para priorizar tarefas, e o método GTD (Getting Things Done) são ótimos para começar.",
          sender: "bot",
          timestamp: yesterday,
        },
      ],
    },
    {
      id: "4",
      title: "O que é inteligência artificial?",
      preview: "A inteligência artificial (IA) é...",
      updatedAt: lastWeek,
      messages: [
        {
          id: "m7",
          content: "O que é inteligência artificial?",
          sender: "user",
          timestamp: lastWeek,
        },
        {
          id: "m8",
          content:
            "A inteligência artificial (IA) é um campo da ciência da computação dedicado a criar sistemas capazes de realizar tarefas que normalmente requerem inteligência humana, como reconhecimento de padrões, tomada de decisão e processamento de linguagem natural.",
          sender: "bot",
          timestamp: lastWeek,
        },
      ],
    },
  ];
}

export function getBotResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();

  if (lower.includes("olá") || lower.includes("oi") || lower.includes("hey")) {
    return "Olá! 👋 Como posso te ajudar hoje?";
  }
  if (lower.includes("obrigado") || lower.includes("valeu")) {
    return "De nada! Fico feliz em ajudar. 😊 Tem mais alguma dúvida?";
  }
  if (lower.includes("como vai") || lower.includes("tudo bem")) {
    return "Estou ótimo, obrigado por perguntar! 🤖 Em que posso te ajudar?";
  }
  if (lower.includes("nome") || lower.includes("quem é você")) {
    return "Eu sou o ChatBot IA, seu assistente virtual! Fui criado para te ajudar com informações e respostas rápidas. 💡";
  }

  const responses = [
    "Que pergunta interessante! Vou te ajudar com isso. Com base no que sei, posso dizer que esse é um tópico bastante amplo. Poderia me dar mais detalhes sobre o que gostaria de saber?",
    "Ótima pergunta! 🎯 Esse assunto tem várias nuances. De forma resumida, existem diferentes perspectivas sobre isso. Quer que eu aprofunde em algum aspecto específico?",
    "Entendi! Deixa eu pensar sobre isso... 🤔 Esse é um tema fascinante. Aqui vai minha análise: há muitos fatores a considerar. Posso elaborar mais se quiser!",
    "Muito boa essa dúvida! Com base no meu conhecimento, posso te dar algumas informações úteis sobre o assunto. Gostaria de saber algo mais específico?",
    "Que legal que você quer saber sobre isso! 🚀 É um tema que eu adoro discutir. Posso te explicar de várias formas — prefere uma resposta mais técnica ou mais simples?",
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}
