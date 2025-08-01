export interface CreateTableUseCase {
  execute: (options: CreateTableOptions) => string;
}
export interface CreateTableOptions {
  base: number;
  limit?: number;
}

// Objetivo de este use case, es crear la tabla
export class CreateTable implements CreateTableUseCase {
  constructor(/**DI */) {}

  execute({ base, limit = 10 }: CreateTableOptions) {
    let outputMessage = ``;
    for (let i = 1; i <= limit; i++) {
      outputMessage += `${base} x ${i} = ${base * i}`;

      if (i < limit) outputMessage += "\n";
    }
    return outputMessage;
  }
}
