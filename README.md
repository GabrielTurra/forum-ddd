# DDD (Domain-driven design)
Uma forma de transpor um problema, transformar uma necessidade em software. 
Design de software e arquitetura de código são coisas completamente diferentes.

## Dominio 
    - Domain Experts - Pessoas que entendem a fundo a problemática que está sendo abordada
    - Linguagem ubíqua - Linguagem universal a qual todos os envolvidos conseguem se comunicar. Sem vicios de nomenclatura.

## Subdominio
  - Core: O que da dinheiro
  - Supporting: Da suporte para o Core funcionar
  - Generic: São úteis mas não são vitais para a aplicação
  
  Normalmente focamos em desenvolver os Cores da aplicação e tercerizar os outros subdominios para diminuir tempo e custos.

  Cada Subdominio normalmente vira um microserviço caso essa seja a estratégia utilizada na arquitetura. 

  Os subdominios devem ser independentes entre si no código. Desacoplados entre si mas não necessariamente assincronos.

### Exemplos
  Dentro de um E-ccommerce: 
  - Core: Compra, catálogo, pagamento, frete (tudo que envolve dinheiro, se parar a operação para também)
  - Supporting: Estoque
  - Generic: Notificações, envio de emails, promoções, chat

  As importancias de cada sistema variam de um para o outro a depender das necessidades de cada um. 
  As notificações em um E-ccommerce podem ser Generics porém dentro de um fórum tem uma importancia maior, como Supporting. 





