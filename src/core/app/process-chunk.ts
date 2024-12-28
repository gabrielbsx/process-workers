export type Input = {
  id: string;
  nome: string;
  endereco: string;
  email: string;
  dataNascimento: Date;
};

export async function processChunk(chunk: Input[]) {
  console.log({
    message: `Processando ${chunk.length} elementos`,
  });
}
