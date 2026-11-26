import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { erro: null };
  }

  static getDerivedStateFromError(erro) {
    return { erro };
  }

  componentDidCatch(erro, informacoes) {
    console.error('Erro na aplicação:', erro, informacoes);
  }

  render() {
    if (this.state.erro) {
      return (
        <main className="fallback">
          <h1>Não foi possível carregar a página</h1>
          <p>Atualize a página. Se o problema continuar, informe a equipe responsável.</p>
        </main>
      );
    }
    return this.props.children;
  }
}
