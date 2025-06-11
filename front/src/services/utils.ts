/**
 * V2 - Desserializador robusto para respostas de API .NET com preservação de referência.
 * Limpa completamente os objetos, garantindo que o resultado seja um array de POJOs (Plain Old JavaScript Objects).
 * @param data A resposta da API.
 * @returns Um array de objetos desserializados e limpos.
 */
function desserializarV2<T>(data: any): T[] {
  if (!data || !data.$values) {
    return Array.isArray(data) ? data : [];
  }

  const idMap = new Map<string, any>();

  // 1ª Passagem: Catalogar todos os objetos que possuem um ID.
  // Isso nos permite encontrar qualquer objeto por seu "$id" posteriormente.
  const popularMapa = (arr: any[]) => {
    for (const item of arr) {
      if (item && typeof item === 'object') {
        if (item.$id) {
          idMap.set(item.$id, item);
        }
        // Se o item tiver valores aninhados, catalogar eles também (recursivo)
        if (item.$values) {
          popularMapa(item.$values);
        } else {
          // Percorrer as propriedades do objeto para encontrar mais valores aninhados
          Object.values(item).forEach(val => {
            if (val && (val as any).$values) {
              popularMapa((val as any).$values);
            }
          });
        }
      }
    }
  };
  
  popularMapa(data.$values);

  // 2ª Passagem: Construir o resultado final.
  // Aqui, resolvemos as referências ("$ref") e criamos objetos limpos.
  const resolverERemontar = (val: any): any => {
    if (!val || typeof val !== 'object') {
      return val; // Retorna primitivos (string, number, etc.) como estão.
    }

    // Se encontrarmos uma referência, buscamos o objeto real no nosso mapa.
    if (val.$ref) {
      // É crucial chamar a função novamente no objeto encontrado para resolver suas próprias referências.
      return resolverERemontar(idMap.get(val.$ref));
    }

    // Se o objeto tiver valores aninhados, é uma lista. Processamos cada item.
    if (val.$values) {
      return val.$values.map(resolverERemontar);
    }
    
    // Se for um objeto normal, criamos um novo objeto limpo
    // e processamos cada uma de suas propriedades.
    const objetoLimpo: { [key: string]: any } = {};
    for (const key in val) {
      // Ignoramos as propriedades especiais do serializador.
      if (key !== '$id' && Object.prototype.hasOwnProperty.call(val, key)) {
        objetoLimpo[key] = resolverERemontar(val[key]);
      }
    }
    return objetoLimpo;
  };

  return data.$values.map(resolverERemontar);
}