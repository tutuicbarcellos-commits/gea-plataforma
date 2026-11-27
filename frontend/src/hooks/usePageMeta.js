import { useEffect } from 'react';

const BASE_URL = 'https://gea-plataforma.vercel.app';
const NOME_SITE = 'GEA Chapa Connecta';
const DESCRICAO_PADRAO = 'Plataforma digital do Grêmio Estudantil (GEA) da Chapa Connecta.';
const IMAGEM_COMPARTILHAMENTO = `${BASE_URL}/og-image.jpg`;

function definirMeta(nome, conteudo, porPropriedade = false) {
  const atributo = porPropriedade ? 'property' : 'name';
  let elemento = document.head.querySelector(`meta[${atributo}="${nome}"]`);
  if (!elemento) {
    elemento = document.createElement('meta');
    elemento.setAttribute(atributo, nome);
    document.head.appendChild(elemento);
  }
  elemento.setAttribute('content', conteudo);
}

function definirCanonical(url) {
  let elemento = document.head.querySelector('link[rel="canonical"]');
  if (!elemento) {
    elemento = document.createElement('link');
    elemento.setAttribute('rel', 'canonical');
    document.head.appendChild(elemento);
  }
  elemento.setAttribute('href', url);
}

/**
 * Define título, descrição, metadados sociais e indexação de cada página.
 * Páginas privadas recebem noindex, para que buscadores não as listem.
 */
export function usePageMeta({ titulo, descricao = DESCRICAO_PADRAO, privada = false }) {
  useEffect(() => {
    const tituloCompleto = titulo ? `${titulo} | ${NOME_SITE}` : NOME_SITE;
    const url = `${BASE_URL}${window.location.pathname}`;

    document.title = tituloCompleto;
    definirMeta('description', descricao);
    definirMeta('robots', privada ? 'noindex, nofollow' : 'index, follow');
    definirMeta('og:title', tituloCompleto, true);
    definirMeta('og:description', descricao, true);
    definirMeta('og:url', url, true);
    definirMeta('og:type', 'website', true);
    definirMeta('og:site_name', NOME_SITE, true);
    definirMeta('og:image', IMAGEM_COMPARTILHAMENTO, true);
    definirMeta('twitter:card', 'summary_large_image');
    definirMeta('twitter:title', tituloCompleto);
    definirMeta('twitter:description', descricao);
    definirMeta('twitter:image', IMAGEM_COMPARTILHAMENTO);
    definirCanonical(url);
  }, [titulo, descricao, privada]);
}
