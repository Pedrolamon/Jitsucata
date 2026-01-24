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