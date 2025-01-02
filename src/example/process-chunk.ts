export type Input = {
  id: string;
  nome: string;
  endereco: string;
  email: string;
  dataNascimento: Date;
};

export async function processChunk(chunk: Input[]) {
  for (const item of chunk) {
    console.log({
      message: `Processando ${item.id}`,
    });
  }

  console.log({
    message: `Processando ${chunk.length} elementos`,
  });
}
