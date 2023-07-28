import { Casl } from "@utils/casl";

export const useCasl = (defaultModule: string = null) => {
  const casl = new Casl();
  if (defaultModule !== null) {
    casl.withModule(defaultModule);
  }

  return {
    can: (action: string, module: string = null) => casl.can(action, module),
  };
};
