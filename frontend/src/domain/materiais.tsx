//imagens 
import gusa from "../assets/sucata de gusa.jpg"
import cavacoFundido from "../assets/cavaco-de-ferro-fundido.jfif"
import gusagranulada from "../assets/gusa granulada.webp"
import gusamoida from "../assets/gusa moida.webp"
import briqueteGranulado from "../assets/SUCATA BRIQUETE GRANULADO PRENSADO.webp"
import estampariaFragmentada from "../assets/SUCATA ESTAMPARIA FRAGMENTADA.jfif"
import estampariaPura from "../assets/SUCATA ESTAMPARIA PURA.jfif"
import sucataForjada from "../assets/SUCATA FORJADA.webp"
import pacoteEstampariaPura from "../assets/SUCATA PACOTE DE ESTAMPARIA PURA.jfif"
import pacoteEstampariaRevestida from "../assets/SUCATA PACOTE DE ESTAMPARIA REVESTIDA.webp"
import ferroFundido from "../assets/sucata-de-ferro-fundido.jpg"
import ferroFundidoGraudo from "../assets/SUCATA-FERRO-FUNDIDO-GRAÚDO-A-INDUSTRIALIZAR.jfif"
import borraOxicorte from "../assets/SUCATA BORRA DE OXICORTE.webp"
import briqueteCavaco from "../assets/SUCATA BRIQUETE DE CAVACO.jfif"
import cavacoAçõ from "../assets/SUCATA CAVACO DE AÇO.jpg"
import shereddada from "../assets/SUCATA FRAGMENTADA (SHREDDADA).jfif"
import tesourada from "../assets/tesourada.jpeg"
import chaparia from "../assets/SUCATA PACOTE DE CHAPARIA.jpg"
import sucataMista from "../assets/SUCATA MISTA.webp"
import miudaPesada from "../assets/SUCATA MIÚDA PESADA.jfif"
import oxicortada from "../assets/SUCATA OXICORTADA.jpg"
import paraCorte from "../assets/SUCATA GRAÚDA PARA CORTE.jfif"
import recuperadaAço from "../assets/SUCATA RECUPERADA DE AÇO.webp"
import estampariaRevestida from "../assets/SUCATA ESTAMPARIA REVESTIDA.jpg"




export  const ClassificaçãoMateriais = [
{
Titulo:"SUCATA DE GUSA",
ImagemUrl: gusa,
Descrição:"Material proveniente de refugo do processo de produção de ferro gusa. Não obedecem ao formato tradicional do ferro gusa, apresentando-se normalmente com pequena agregação de escória. Gusa de formato irregular com peças maciças, Cascões de gusa, Granulado devido processamento em planta de separação magnética",
Contaminações: "Escória, terra e areia"
},
{
Titulo:"SUCATA FERRO FUNDIDO",
ImagemUrl: ferroFundido,
Descrição:"Sucata de alto carbono gerado no descarte/obsolescência de peças e componentes, que apresentam seus principais elementos de liga (C, Si, Mn, S,P ) com teores variados em sua composição; tais como: bloco de motores, refugo e canais de fundição, bases de máquinas, tampões, grelhas, rodas ferroviárias, tambores de freios, carcaças de caixas de marchas e diferenciais, etc. - Blocos de motores, Grelhas, Lingoteiras, Panelas de freio, Canais de fundição, tambores de freios, Rodas ferroviárias, Tampões, carcaças de caixas de marchas e diferenciais, Bases de máquinas, Panelas de ferro",
Contaminações:" Terra, carepa e impurezas"
},
{
Titulo:"SUCATA CAVACO DE FERRO FUNDIDO",
ImagemUrl: cavacoFundido,
Descrição: "Sucata de alto teor de carbono gerado no processo de usinagem de peças de ferro fundido,principalmente da indústria automobilística, devendo ter baixo teor de óleo e isenção de impurezas. Porém, em condições normais, pode apresentar areia de fundição como impureza inerente devido à usinagem de peças de ferro fundido. Limalha de ferro fundido, Cavaco de ferro fundido.Contaminações: Terra, carepa, areia, pedra, cimentoborracha, estopa, óleo,  areia de fundição. etc"
},
{
Titulo:"SUCATA FERRO FUNDIDO GRAÚDO A INDUSTRIALIZAR",
ImagemUrl: ferroFundidoGraudo,
Descrição:"Sucata de alto carbono gerado no descarte/obsolescência de peças de ferro fundido de dimensões acima de 0,80m que necessitam de beneficiamento (quebra por boleamento) para permitir o consumo no Forno Elétrico a Arco. Blocos de fofo graúdos, Grelhas, Lingoteiras, Moldes de fundições, Canais de fundição, cilindros de laminação, estruturas de equipamentos e Estampos de indústria automobilística",
Contaminações: "Terra, carepa e impurezas (ex. óleo)"
},
{
Titulo:"SUCATA DE GUSA MOÍDA",
ImagemUrl: gusamoida,
Descrição:"Material proveniente do processamento do refugo do processo de produção de ferro gusa em planta de separação magnética na granulometria acima de 2,5” até 8”. Apresenta-se normalmente com agregação de escória, inerente a este tipo de sucata. Sucata de Gusa recuperada em planta magnética, Pequenos cascões de gusa, Granulado devido processamento em planta de separação magnética.",
Contaminação:" Escória, terra e areia."
},
{
Titulo:'SUCATA DE GUSA GRANULADA',
ImagemUrl: gusagranulada,
Descrição:'Material proveniente do processamento do refugo do processo de produção de ferro gusa em planta de separação magnética na granulometria acima de 3mm até 5mm. Apresenta-se normalmente com agregação e finos de escória, inerente a este tipo de sucata. É comumente chamada de “chumbinho”.',
Contaminação:' Escória, terra e areia.'
},
{
Titulo:'SUCATA BRIQUETE GRANULADO PRENSADO',
ImagemUrl: briqueteGranulado,
Descrição:'Material obtido a partir do processo de briquetagem do refugo de retífica de motores. Formato “sabonete”',
Contaminação:' Terra, carepa, pedras,  Excesso de oxidação'
},
{
Titulo:'SUCATA ESTAMPARIA PURA',
ImagemUrl: estampariaPura,
Descrição:'Material gerado, em sua maioria, no processo de corte e estampagem de chapas de aço carbono com espessura inferior a 3 mm isentas de qualquer tipo de revestimento, composto por estamparia de indústria solta, sem revestimento (metálico ou não) tais como: Zn (Zinco), Cr (Cromo), Cu (Cobre), Sn (Estanho), Pb (Chumbo), Ni (Níquel), esmalte ou galvanização, etc. Admite-se fina camada de oxidação. Retalhos de chapas,  Retalhos de estampagem de chapas, Fitas de embalagens, Serras e Chapas',
Contaminação: 'Estamparia brilhosa com estanho, Fitas cobreadas, Revestimento com verniz, tinta, Excesso de óleo e graxa, Terra, concreto, pedra'
},
{
Titulo:'SUCATA ESTAMPARIA REVESTIDA',
ImagemUrl: estampariaRevestida,
Descrição:"Material gerado, em sua maioria, no processo de corte e estampagem de chapas de aço carbono com espessura inferior a 3 mm com revestimento, composto por estamparia de indústria solta com revestimento de qualquer espécie, metálico ou não, tais como: Zn (Zinco), Cr (Cromo), Cu '(Cobre), Sn (Estanho), Pb (Chumbo), Ni (Níquel), esmalte ou galvanização, etc. Admite-se fina camada de oxidação. Retalhos de chapas revestidas (litografadas, galvaniz., estanhadas, envernizadas, etc.), Chapinhas de refrigerantes, retalhos de chapas destinadas à fabricação de “Latinhas” limpas.",
Contaminações : 'Areia e terra,  Latinhas usadas (óleo ou alimentos), chapas usadas (obsolescência)'
},
{
Titulo:'SUCATA ESTAMPARIA FRAGMENTADA',
ImagemUrl: estampariaFragmentada,
Descrição:' Material composto por estamparia pura e estamparia revestida soltas processado por industrialização em equipamento shredder. Com ou sem revestimento (metálico ou não) tais como: Zn (Zinco), Cr (Cromo), Cu (Cobre), Sn (Estanho), Pb (Chumbo), Ni (Níquel), esmalte ou galvanização, etc. Admite-se fina camada de oxidação.',
Contaminação:' Estamparia brilhosa com estanho,  Fitas cobreadas, Revestimento com verniz, tinta, Excesso de óleo e graxa e Terra, concreto, pedra'
},
{
Titulo:'SUCATA PACOTE DE ESTAMPARIA PURA',
ImagemUrl: pacoteEstampariaPura,
Descrição:'Material gerado a partir do processo de prensagem de sucata estamparia pura em prensa empacotadeira isenta de qualquer tipo de revestimento. Admite-se fina camada de oxidação. Pacote de estamparia preta, Pacote de retalhos de estamparia industrial, Pacote de chapas sem revestimento.',
Contaminação:'Estamparia brilhosa com estanho, Fitas cobreadas, Revestimento com verniz, tinta, Excesso de óleo e graxa, Terra, concreto, pedra'
},
{
Titulo:'SUCATA PACOTE DE ESTAMPARIA REVESTIDA',
ImagemUrl: pacoteEstampariaRevestida,
Descrição: 'Material gerado a partir do processo de prensagem de sucata estamparia revestida em prensa empacotadeira. Admite-se fina camada de oxidação. Os pacotes desestanhados devem ser classificados como P2 uma vez que sempre apresentam uma quantidade residual de Sn. Pacote de retalhos de estamp. c/ revestimento, Pacote de chapas com revestimento, Pacote de latas de aço, (limpas, de indústria),  Pacote de chaparia galvanizada, Rolo de refilo em perfeito estado, Pacote de estamparia da “linha branca”., Rolo de arame galvanizado prensado.',
Contaminação: 'Terra, concreto, areia e pedra, revestimentos de geladeiras, mistura com chaparia mista.'
},
{
Titulo: 'SUCATA FORJADA',
ImagemUrl: sucataForjada,
Descrição: 'Material gerado no processo de forjamento de peças de aço. Possui níveis variáveis de contaminantes, especialmente de cromo e níquel, e admite-se fina camada de oxidação. Virabrequins, Feixe de molas de caminhões, Retalhos de estamparia, forjada gerados na confecção de martelos, machados, eixos, Engrenagens diversas, rolamentos, bolas de moinhos, etc.',
Contaminações:' Terra, pedras e carepa'
},
{
Titulo: 'SUCATA RECUPERADA DE AÇO',
ImagemUrl: recuperadaAço,
Descrição: 'Material proveniente da recuperação do aço contido em escória e perdas de processo gerados em Aciarias (usinas integradas e não integradas). Cascões,  Bodes, Material boleado e/ou processado em planta de separação magnética.',
Contaminações: 'escória agregada., terra, carepa etc.'
},
{
Titulo: 'SUCATA BORRA DE OXICORTE',
ImagemUrl: borraOxicorte,
Descrição: 'Resíduo gerado no processo de oxicorte de peças e chapas de aço. Normalmente, apresenta pedaços de chapas oriundas do processo de corte que devem ser separados e reclassificados para consumo. Borra, carepa.',
Contaminação: 'Terra, carepa, pedras, Excesso de oxidação'
},
{
Titulo: 'SUCATA GRAÚDA PARA CORTE',
ImagemUrl: paraCorte,
Descrição: 'Material com dimensões superiores a 80 cm com a necessidade de corte em tamanhos adequados para o uso nos fornos. Após processada, é transformada em sucata oxicortada ou miúda pesada, devendo ser reclassificada para consumo. Chapas grossas, Vigas, Perfis, Cantoneiras grossas, Chassis, Sucata naval, Tubos e ferros, mecânicos, Sucata ferroviária, - Estruturas metálicas, Implementos agrícolas',
Contaminação:  'Excesso de graxa e óleo, - Terra, concreto,madeira, borracha'
},
{
Titulo: 'SUCATA OXICORTADA',
ImagemUrl: oxicortada,
Descrição: 'Material obtido a partir do processo de oxicorte de peças de comprimento superiores a 80 cm e chapas de aço superiores a 3 mm de espessura. Também pode ser obtida por corte em prensa tesoura (corte de perfis, chapas, etc.), sem mistura com sucatas de obsolescência. A sucata pantográfica enquadra-se nesta classificação. Retalhos de chapas, Vigas, Sucata naval, Trilhos, Pontas de vergalhão, Luvas de tubulação, perfuração (Petrobrás ),  Vagões ferroviários Cortados.',
Contaminações: 'Excesso de graxa e óleo, Terra, concreto'
},
{
Titulo: "SUCATA MIÚDA PESADA",
ImagemUrl: miudaPesada,
Descrição:' Material proveniente do descarte/obsolescêndia de objetos diversos e predominantemente densos (650 – 1.200 kg/m3). Possui composição química variada, composta por aços comuns ou ligados com revestimento de qualquer espécie, metálico ou não, inclusive admite-se camada de oxidação. Engrenagens, Coroa/pinhão, Pontas de vergalhão, Pregos, Porcas e parafusos, Pontas de eixo, Rolamento, Mandíbulas, Sucata naval ou caldeiraria, Pedaços de canos, Rodas de automóveis e caminhões e Bolas de moinhos',
Contaminações: 'Excesso de graxa e óleo, Terra, concreto,madeira,borracha, Presença de amortecedores e/ou recipientes fechados'
},
{
Titulo: 'SUCATA MISTA',
ImagemUrl: sucataMista,
Descrição: 'Sucata de composição mista (aços comuns ao carbono ou ligados) com revestimento de qualquer espécie, (metálico ou não). Material proveniente do descarte/obsolescêndia de objetos diversos e predominantemente leves. Possui composição química variada, admitindo impurezas intrínsecas ao material. É matéria-prima para processamento em equipamentos como shredder e prensas. Fogões, Geladeiras, Armações, Chaparias, automobilísticas, Canos finos, Colunas de ônibus, Tambores, Cabos de aços, Arame emaranhado, Telas',
Contaminações: 'Excesso de graxa e óleo, Terra, concreto,madeira,borracha e presença de amortecedores e/ou recipientes fechados',
},
{
Titulo: 'SUCATA PACOTE DE CHAPARIA',
ImagemUrl: chaparia,
Descrição: 'Material obtido a partir do processo de prensagem de sucata mista em prensa empacotadeira. Admite-se impurezas intrínsecas ao material. Pacote misto comum, Fardos de chaparia',
Contaminações: 'Óleo, graxa, amortecedores, terra, concreto e pedra, Produtos químicos, Presença de amortecedores e/ou recipientes fechados'
},
{
Titulo: 'SUCATA PACOTE DE CHAPARIA GRAÚDO',
ImagemUrl: chaparia,
Descrição: 'Material obtido a partir do processo de prensagem de sucata mista em prensa empacotadeira formando um pacote de grandes dimensões destinado à industrialização em equipamento shredder. Este pacote visa também redução do peso morto que ocorre no transporte da sucata mista solta. Admite-se impurezas intrínsecas ao material. Os pacotes de chaparia e mistos de dimensões inferiores ao mínimo descrito acima, com baixa compactação ou não, destinados ao processamento em equipamento shredder. Pacote misto comum, pacotão de baixa densidade para processamento.',
Contaminações: 'Óleo, graxa, amortecedores, terra, concreto e pedra, produtos químicos, presença de amortecedores e/ou recipientes fechados'
},
{
Titulo:'SUCATA TESOURADA',
ImagemUrl: tesourada,
Descrição:"Sucata de composição mista (aços comuns ao carbono-1010 a 1095) proveniente da industrialização através de prensa tesoura, isenta de impurezas, tais como: terra, areia, pedra, cimento, borracha, madeira, estopa, etc. Também processa-se chapas pesadas e material de corte em prensa tesoura.",
Contaminações: "Óleo, graxa, amortecedores, terra, concreto, pedra, Peças maciças, Cilindro de gás fechado,  material de baixa densidade"
},
{
Titulo:"SUCATA FRAGMENTADA (SHREDDADA)",
ImagemUrl: shereddada,
Descrição: "Material obtido a partir do processo de trituração/fragmentação de sucatas do tipo obsolescência (mista, pacote de mista, tesoura e/ou carga peso) em equipamento Shredder (fragmentador).",
Contaminações: "Óleo, graxa ,Terra, concreto, pedra"
},
{
Titulo: "SUCATA CAVACO DE AÇO",
ImagemUrl: cavacoAçõ,
Descrição:" Material gerado no processo de usinagem de peças de aço carbono com formato de trituração isento de impurezas, tais como: terra, areia, carepa, pedra, cimento, borracha, madeira, estopa, óleo, água, etc . Admite-se baixo teor de óleo. O cavaco de aço costuma vir com cavaco de ferro fundido misturado devido à geração simultânea na fonte geradora. Limalha de ferro, Cavaco triturado e viruta solta",
Contaminações:" Terra, concreto, pedra, óleo, carepa, “póda-china”, estopa, pó de minério, etc"
},
{
Titulo: "SUCATA BRIQUETE DE CAVACO",
ImagemUrl: briqueteCavaco,
Descrição: "Material obtido a partir do processo de briquetagem de sucata de cavaco de aço.",
Contaminações:" Terra, concreto, pedra, óleo, carepa, “póda-china”, estopa, etc"
}
]


export const ClassificaçãoMateriaisNãoferrosos = [
  {
    "Titulo": "SUCATA DE ALUMÍNIO BLOCO",
    "ImagemUrl": "aluminioBloco",
    "Descrição": "Peças fundidas de ligas de alumínio, como cárteres, carcaças de câmbio, blocos de motor e peças automotivas diversas. Deve estar isento de excesso de óleo, graxa, ferro (prisioneiros, válvulas), magnésio e latão.",
    "Contaminações": "Ferro fixo, graxa pesada, buchas de aço, latão, antimônio e terra."
  },
  {
    "Titulo": "SUCATA DE ALUMÍNIO BORRA",
    "ImagemUrl": "borraAluminio",
    "Descrição": "Subproduto resultante da fusão do alumínio em fornos (escória). Contém óxidos de alumínio e metal recuperável em diferentes concentrações.",
    "Contaminações": "Sais de fundição, óxidos, terra e outros metais não ferrosos."
  },
  {
    "Titulo": "SUCATA DE CABOS COM ALMA DE AÇO",
    "ImagemUrl": "cabosAlmaAco",
    "Descrição": "Condutores elétricos de alumínio que possuem um fio ou cordoalha de aço central para sustentação mecânica. Comum em linhas de transmissão de alta tensão.",
    "Contaminações": "Aço (alma central), graxa de proteção e oxidação severa."
  },
  {
    "Titulo": "SUCATA DE ALUMÍNIO CAVACO",
    "ImagemUrl": "cavacoAluminio",
    "Descrição": "Resíduos provenientes de processos de usinagem (torneamento, fresagem, furação). Deve ser classificado por liga (bloco ou perfil) sempre que possível.",
    "Contaminações": "Óleo de corte (solúvel), umidade, cavaco de ferro, plástico e buchas."
  },
  {
    "Titulo": "SUCATA DE ALUMÍNIO CHAPARIA",
    "Descrição": "Folhas de alumínio limpas, provenientes de sobras de processos industriais ou utensílios. Geralmente ligas da série 1000 ou 3000.",
    "ImagemUrl": "chapariaAluminio",
    "Contaminações": "Papel, plásticos, colas e outros metais."
  },
  {
    "Titulo": "SUCATA DE ALUMÍNIO CHAPARIA MISTA",
    "ImagemUrl": "chapariaMista",
    "Descrição": "Mistura de chapas de alumínio de diferentes espessuras e ligas, podendo conter pintura e vernizes. Inclui utensílios domésticos usados.",
    "Contaminações": "Plástico, parafusos de ferro, restos de alimentos e madeira."
  },
  {
    "Titulo": "SUCATA DE CHAPAS OFFSET",
    "ImagemUrl": "chapasOffset",
    "Descrição": "Chapas de alumínio de alta pureza (série 1000) utilizadas na indústria gráfica. Devem estar limpas e sem excesso de tinta seca.",
    "Contaminações": "Papel, plástico de proteção e resíduos químicos de revelação."
  },
  {
    "Titulo": "SUCATA DE ALUMÍNIO ESTAMPARIA",
    "ImagemUrl": "estampariaAluminio",
    "Descrição": "Retalhos novos e limpos provenientes de processos de corte e estampagem industrial. Material de alta qualidade e liga conhecida.",
    "Contaminações": "Óleo de estampagem leve e eventuais fitas adesivas."
  },
  {
    "Titulo": "SUCATA DE PISTÕES DE ALUMÍNIO",
    "ImagemUrl": "pistoesAluminio",
    "Descrição": "Pistões de motores de combustão interna. Devem preferencialmente estar sem as bielas e anéis de aço.",
    "Contaminações": "Anéis de segmento (aço), pinos de aço, grafite e carvão de queima."
  },
  {
    "Titulo": "SUCATA DE LATAS PRENSADAS",
    "ImagemUrl": "latasPrensadas",
    "Descrição": "Latas de alumínio de bebidas (UBC - Used Beverage Cans) compactadas em fardos de alta densidade.",
    "Contaminações": "Líquidos residuais, areia, pedras e latas de aço (ferrosas)."
  },
  {
    "Titulo": "SUCATA DE LATAS SOLTAS OU ENFARDADAS",
    "ImagemUrl": "latasSoltasEnfardadas",
    "Descrição": "Latas de alumínio de bebidas em estado solto ou em fardos de baixa densidade.",
    "Contaminações": "Plásticos, canudos, terra e umidade."
  },
  {
    "Titulo": "SUCATA DE ALUMÍNIO PANELA",
    "ImagemUrl": "panelaAluminio",
    "Descrição": "Utensílios domésticos de alumínio fundido ou laminado. Devem ser removidos cabos de baquelite ou madeira.",
    "Contaminações": "Cabos de plástico, rebites de ferro, gordura e restos orgânicos."
  },
  {
    "Titulo": "SUCATA DE PERFIL BRANCO",
    "ImagemUrl": "perfilBranco",
    "Descrição": "Perfis de alumínio extrudado (ligas série 6000) sem pintura ou anodizados. Comum em esquadrias e estruturas.",
    "Contaminações": "Borrachas de vedação, parafusos, escovinhas e resíduos de cimento."
  },
  {
    "Titulo": "SUCATA DE PERFIL MISTO",
    "ImagemUrl": "perfilMisto",
    "Descrição": "Mistura de perfis de alumínio limpos, pintados, anodizados e com ou sem ruptura térmica.",
    "Contaminações": "Plásticos, isolantes térmicos, ferro e silicone."
  },
  {
    "Titulo": "SUCATA DE RADIADOR DE ALUMÍNIO",
    "ImagemUrl": "radiadorAluminio",
    "Descrição": "Colmeias de radiadores automotivos compostas inteiramente por alumínio (alhetas e tubos).",
    "Contaminações": "Plástico das caixas laterais, resíduos de aditivo e óleo."
  },
  {
    "Titulo": "SUCATA DE RADIADOR ALUMÍNIO-COBRE",
    "ImagemUrl": "radiadorAluminioCobre",
    "Descrição": "Radiadores (geralmente de ar-condicionado) com tubos de cobre e alhetas de alumínio.",
    "Contaminações": "Ferro das cabeceiras, solda de estanho e poeira industrial."
  },
  {
    "Titulo": "SUCATA DE RETALHO INDUSTRIAL OU CHAPA PARA LATA",
    "ImagemUrl": "retalhoChapaLata",
    "Descrição": "Sobras de bobinas de alumínio utilizadas na fabricação de corpos ou tampas de latas. Material novo e sem uso.",
    "Contaminações": "Papel de separação de bobina e umidade."
  },
  {
    "Titulo": "SUCATA DE TELHAS DE ALUMÍNIO",
    "ImagemUrl": "telhasAluminio",
    "Descrição": "Folhas de alumínio corrugadas ou trapezoidais usadas em coberturas industriais ou residenciais.",
    "Contaminações": "Ganchos de fixação de ferro, resíduos de cal, cimento e isolantes térmicos."
  },
  {
    "Titulo": "SUCATA DE COBRE - 1ª CATEGORIA (MEL)",
    "ImagemUrl": "cobreMel",
    "Descrição": "Cobre limpo ou isolado; barramentos; fios redondos, retangulares e moídos sem contaminação.",
    "Contaminações": "Percentuais de não metálicos (descontados no ato da classificação)."
  },
  {
    "Titulo": "SUCATA DE COBRE - 2ª CATEGORIA (MELA 1ª)",
    "ImagemUrl": "cobreMela1",
    "Descrição": "Pontas de tubos de cobre limpo sem contaminação.",
    "Contaminações": "Isento de contaminações externas, mas classificado abaixo da 1ª categoria por formato."
  },
  {
    "Titulo": "SUCATA DE COBRE - 2ª CATEGORIA (MELA 2ª)",
    "ImagemUrl": "cobreMela2",
    "Descrição": "Fios esmaltados provenientes de processos industriais.",
    "Contaminações": "Verniz (esmalte) isolante."
  },
  {
    "Titulo": "SUCATA DE COBRE - 3ª CATEGORIA (MELBE)",
    "ImagemUrl": "cobreMelbe",
    "Descrição": "Fios estanhados ou de enrolamento com pontas de soldas. Inclui estamparia miúda contaminada, cavacos, calhas, tachos limpos, tubos e serpentinas de aparelhos de destilação e chapas de caldeiras.",
    "Contaminações": "Estanho, solda, verniz e oxidação."
  },
  {
    "Titulo": "SUCATA DE COBRE - 4ª CATEGORIA (MELCE)",
    "ImagemUrl": "cobreMelce",
    "Descrição": "Material classificado sob consulta e mediante análise da composição química.",
    "Contaminações": "Diversas (sujeito a análise técnica)."
  },
  {
    "Titulo": "SUCATA DE TOMBACK (VERMELHA)",
    "ImagemUrl": "tombackVermelha",
    "Descrição": "Estamparia graúda e miúda e tubos graúdos e miúdos de tomback (liga de cobre e zinco com alto teor de cobre).",
    "Contaminações": "Isento de outros metais."
  },
  {
    "Titulo": "ESTAMPARIA DE LATÃO - 1ª CATEGORIA (AMARELA)",
    "ImagemUrl": "lataoAmarela",
    "Descrição": "Estamparia graúda e miúda de latão, sem contaminações.",
    "Contaminações": "Isento de ferro e outros metais."
  },
  {
    "Titulo": "ESTAMPARIA DE LATÃO - 2ª CATEGORIA (BEAMARELA)",
    "ImagemUrl": "lataoBeamarela",
    "Descrição": "Tubos e pontas de tubos de latão, isentos de outros metais.",
    "Contaminações": "Oxidação leve, isento de contaminações metálicas externas."
  },
  {
    "Titulo": "PONTAS DE VERGALHÃO DE LATÃO (PONTAS)",
    "ImagemUrl": "lataoPontas",
    "Descrição": "Rebarbas de forja de vergalhão de latão e tubos de latão que não se enquadram nas categorias superiores.",
    "Contaminações": "Rebarbas e sobras de processo produtivo."
  },
  {
    "Titulo": "CAVACO DE LATÃO (FARELO)",
    "ImagemUrl": "lataoFarelo",
    "Descrição": "Somente cavaco de vergalhão e grosso. A parte fina eventualmente contida será classificada de acordo com sua perda.",
    "Contaminações": "Óleo de corte, umidade e finos."
  },
  {
    "Titulo": "SUCATA LEVE DE LATÃO (SUCALEVE)",
    "ImagemUrl": "sucaleve",
    "Descrição": "Composta de estamparia limpa de latão estanhado.",
    "Contaminações": "Banho de estanho."
  },
  {
    "Titulo": "SUCATA PESADA DE LATÃO - 1ª CATEGORIA (SUCAPESADA)",
    "ImagemUrl": "sucapesada",
    "Descrição": "Tubos niquelados e chapas niqueladas, casquilhos de lâmpadas e peças constituídas de chapas niqueladas em geral, torneiras, flanges e peças fundidas de latão.",
    "Contaminações": "Banho de níquel. Deve ser isento de latão com alumínio ou bronze-alumínio."
  },
  {
    "Titulo": "SUCATA PESADA DE LATÃO - 2ª CATEGORIA (SUCAPEBE)",
    "ImagemUrl": "sucapebe",
    "Descrição": "Retalhos de tubos almirantado arsenical, aluminado, sincronizados e peças de latão que não se enquadram na categoria acima.",
    "Contaminações": "Elementos de liga específicos (Arsênio, Alumínio)."
  },
  {
    "Titulo": "TELAS E LÂMINAS DE BRONZE (TELA)",
    "ImagemUrl": "bronzeTela",
    "Descrição": "Telas de processos industriais e lâminas finas compostas de liga de bronze.",
    "Contaminações": "Resíduos de processo, fibras e oxidação."
  },
  {
    "Titulo": "SUCATA DE BRONZE - 1ª CATEGORIA (ABRONZE)",
    "ImagemUrl": "abronze",
    "Descrição": "Sucata de bronze isenta de latão e de bronze-alumínio. Mancais e lingotes sujeitos a análise.",
    "Contaminações": "Isento de latão. Peças mistas pagas conforme classificação da liga predominante."
  },
  {
    "Titulo": "SUCATA DE BRONZE - 2ª CATEGORIA (BEBRONZE)",
    "ImagemUrl": "bebronze",
    "Descrição": "Composta de registros e outras peças de liga baixa que não se enquadram na 1ª categoria.",
    "Contaminações": "Zinco elevado (ligas baixas), resíduos de vedação."
  },
  {
    "Titulo": "SUCATA DE BRONZE - 3ª CATEGORIA (CEBRONZE)",
    "ImagemUrl": "cebronze",
    "Descrição": "Radiadores de bronze.",
    "Contaminações": "Ferro (será descontado no ato da classificação)."
  },
  {
    "Titulo": "SUCATA DE BRONZE - 4ª CATEGORIA (DEBRONZE)",
    "ImagemUrl": "debronze",
    "Descrição": "Cavaco de bronze, sem mistura de cavaco de latão, alumínio e outros.",
    "Contaminações": "Óleo, umidade. Cavaco misturado será classificado conforme análise."
  }

]