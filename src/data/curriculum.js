// Kompetenca: Planifikim mësimor ndër-disiplinor dhe monitorim i evidencave
// Rezultati i të nxënit: Përshtat planin sipas javëve dhe lidh aktivitetet me kompetenca / rezultate
// Evidencë: Objektet e modulit mbajnë rezultate, kritere dhe fushat për regjistrimin e arsyetimeve

export const gradeOptions = ['5', '6', '7', '8', '9'];

export const curriculum = {
  '5': {
    greeting: 'Mirë se erdhe në planin e përditshëm për klasën e 5-të!',
    focusNote:
      'Sot punojmë me thyesa, shkrim krijues dhe ekosistemet. Merr kohë të lexosh me kujdes dhe përfundo kuizin për të kontrolluar kuptimin.',
    modules: [
      {
        id: 'g5-math-fractions',
        subject: 'Matematikë',
        topic: 'Thyesat e përziera',
        timeEstimate: '20 min',
        overview:
          'Rikujto se si kthehen thyesat e thjeshta në thyesa të përziera dhe anasjelltas.',
        reading: [
          'Një thyesë e përzier ka një numër të plotë dhe një thyesë (p.sh. 2 1/3).',
          'Për të kthyer 11/4 në një thyesë të përzier, ndaj 11 me 4: shuma është 2, mbetja 3, pra 2 3/4.',
          'Për të kthyer 1 2/5 në thyesë të papërzier: shumëzo numrin e plotë me emëruesin dhe shto numërtuesin (1×5 + 2 = 7, pra 7/5).',
        ],
        activities: [
          'Kthe 9/2 në thyesë të përzier.',
          'Kthe 3 1/6 në thyesë të papërzier.',
          'Shkruaj një problem të shkurtër nga jeta ku përdor thyesat e përziera.',
        ],
        quiz: {
          questions: [
            {
              id: 'g5-math-q1',
              prompt: 'Cila është forma e thyesës së përzier për 11/3?',
              options: ['3 2/3', '3 1/3', '2 2/3', '2 1/3'],
              answerIndex: 2,
              explanation:
                '11÷3 = 3 me mbetje 2, pra 3 2/3. Alternativat me 2 2/3 janë gabim sepse numri i plotë është 3, jo 2.',
            },
            {
              id: 'g5-math-q2',
              prompt: 'Si kthehet 4 1/5 në thyesë të papërzier?',
              options: ['9/5', '20/5', '21/5', '24/5'],
              answerIndex: 2,
              explanation:
                '4 × 5 = 20; 20 + 1 = 21. Emëruesi mbetet 5, pra 21/5.',
            },
          ],
        },
        tip: 'Nëse numri i plotë del 0, kjo do të thotë që thyesa nuk është e përzier.',
      },
      {
        id: 'g5-language-character',
        subject: 'Gjuha shqipe',
        topic: 'Përshkrimi i personazhit',
        timeEstimate: '15 min',
        overview:
          'Mendo për personazhet që takon në histori dhe përqendrohu te cilësitë kryesore.',
        reading: [
          'Përshkrimi i mirë përdor si pamjen e jashtme ashtu edhe sjelljet.',
          'Përdor mbiemra të përshtatshëm për të krijuar imazhe të qarta (p.sh. “i guximshëm”, “kurioz”).',
          'Shembuj nga teksti ndihmojnë lexuesin të besojë përshkrimin.',
        ],
        activities: [
          'Zgjidh një personazh nga një libër që po lexon dhe përshkruaje me 5 fjali.',
          'Gjej një moment që tregon qartë si sillej ai personazh.',
          'Shkruaj dy pyetje që do t’i bëje personazhit për ta njohur më mirë.',
        ],
        quiz: {
          questions: [
            {
              id: 'g5-language-q1',
              prompt:
                'Cila fjali përdor një shembull konkret nga historia për të treguar guximin e personazhit?',
              options: [
                'Ai ishte gjithmonë shumë guximtar.',
                'Ai u fut në pyll i vetëm për të gjetur mikun e humbur.',
                'Të gjithë mendojnë se ai është i mirë.',
                'Ai kishte flokë të zinj dhe sy të mëdhenj.',
              ],
              answerIndex: 1,
              explanation:
                'Shembulli me hyrjen në pyll tregon një veprim konkret që dëshmon guxim.',
            },
            {
              id: 'g5-language-q2',
              prompt:
                'Kur përshkruan pamjen e jashtme, cilat fjalë janë më të përshtatshme?',
              options: [
                'Kureshtar, i dashur, i zgjuar',
                'I gjatë, me flokë kaçurrela, sy blu',
                'I sjellshëm me të gjithë',
                'E do të lexojë shumë',
              ],
              answerIndex: 1,
              explanation:
                'Fjalët që përmendin gjatësinë, flokët dhe sytë përshkruajnë pamjen e jashtme.',
            },
          ],
        },
        tip: 'Mbaj shënime për personazhet gjatë leximit që ta kesh më lehtë të shkruash më pas.',
      },
      {
        id: 'g5-science-ecosystems',
        subject: 'Shkencë',
        topic: 'Ekosistemet lokale',
        timeEstimate: '20 min',
        overview:
          'Vëzhgo elementet e një ekosistemi dhe si bashkëveprojnë bimët, kafshët dhe klima.',
        reading: [
          'Ekosistemi është komuniteti i gjallesave dhe mjedisi i tyre (p.sh. liqeni, pylli, livadhi).',
          'Çdo organizëm ka rol: prodhues (bimët), konsumatorë (kafshët), dekompozues (krimbat, kërpudhat).',
          'Ndryshimet në një pjesë të ekosistemit mund të ndikojnë të gjithë ekosistemin.',
        ],
        activities: [
          'Bëj një listë me 5 organizma që jetojnë në një park pranë shtëpisë.',
          'Trego se cili është burimi kryesor i energjisë për secilin (p.sh. dielli për bimët).',
          'Shpjego çfarë mund të ndodhë nëse mungojnë insektet në atë ekosistem.',
        ],
        quiz: {
          questions: [
            {
              id: 'g5-science-q1',
              prompt: 'Cili është roli i bimëve në një ekosistem?',
              options: [
                'Të pastrojnë ujin',
                'Të prodhojnë ushqim përmes fotosintezës',
                'Të hanë kafshët e tjera',
                'Të shpërbëjnë lëndët organike',
              ],
              answerIndex: 1,
              explanation:
                'Bimët janë prodhuesit kryesorë sepse krijojnë ushqim me fotosintezë.',
            },
            {
              id: 'g5-science-q2',
              prompt:
                'Çfarë mund të ndodhë nëse mungojnë dekompozuesit në një pyll?',
              options: [
                'Do të shtohet sasia e lëndëve organike të pashpërbëra.',
                'Deriçka, sepse ato nuk kanë rol.',
                'Bimët nuk do të rriten për shkak të mungesës së dritës.',
                'Kafshët grabitqare nuk do të gjejnë ushqim.',
              ],
              answerIndex: 0,
              explanation:
                'Pa dekompozues, mbetjet organike nuk shpërbëhen dhe ushqyesit nuk rikthehen në tokë.',
            },
          ],
        },
        tip: 'Vëzhgo për disa ditë të njëjtin vend dhe shëno ndryshimet.',
      },
    ],
    enrichment: [
      'Lexo për 15 minuta një kapitull nga libri yt i preferuar.',
      'Bëj një pushim aktiv 5-minutësh me shtrirje të lehta.',
    ],
  },
  '6': {
    greeting: 'Mirë se erdhe në planin e klasës së 6-të!',
    focusNote:
      'Tema e ditës përfshin përqindjet në matematikë, ndërtimin e paragrafëve dhe ciklin e ujit.',
    modules: [
      {
        id: 'g6-math-percent',
        subject: 'Matematikë',
        topic: 'Përqindjet në situata reale',
        timeEstimate: '25 min',
        overview:
          'Kupto si përdoren përqindjet për zbritje çmimesh dhe rritje sasish.',
        reading: [
          'Përqindja është një pjesë e një sasie të tërë; 25% do të thotë 25 nga 100.',
          'Për të gjetur 30% të 80, shumëzo 0.30 × 80 = 24.',
          'Kur çmimi ulet me 15%, shumëzo çmimin me 0.85 (100% - 15%).',
        ],
        activities: [
          'Gjej 40% të 120 nxënësve: sa nxënës marrin pjesë?',
          'Një bluzë kushton 25 €. Me zbritje 20%, sa do të paguash?',
          'Shkruaj një shembull ku përdor rritje përqindje (p.sh. rritja e popullatës).',
        ],
        quiz: {
          questions: [
            {
              id: 'g6-math-q1',
              prompt: 'Sa është 15% e 200?',
              options: ['10', '15', '25', '30'],
              answerIndex: 3,
              explanation:
                '0.15 × 200 = 30. Përqindja shndërrohet në numër dhjetor para shumëzimit.',
            },
            {
              id: 'g6-math-q2',
              prompt:
                'Një libër kushton 12 €. Libraria ofron 25% zbritje. Cili është çmimi i ri?',
              options: ['9 €', '9.50 €', '10 €', '10.50 €'],
              answerIndex: 0,
              explanation:
                '12 × 0.75 = 9 €. Zbritja prej 25% lë 75% të çmimit fillestar.',
            },
          ],
        },
        tip: 'Kontrollo nëse përgjigjja është logjike: për një zbritje, çmimi duhet të jetë më i ulët.',
      },
      {
        id: 'g6-language-paragraph',
        subject: 'Gjuhë shqipe',
        topic: 'Struktura e paragrafit',
        timeEstimate: '15 min',
        overview:
          'Mëso të ndërtosh paragrafë me fjali tematike, shembuj dhe përfundim.',
        reading: [
          'Fjalia tematike prezanton idenë kryesore të paragrafit.',
          'Fjalitë mbështetëse japin shembuj, të dhëna ose shpjegime.',
          'Fjalia përmbyllëse forcon idenë ose kalon tek paragrafi tjetër.',
        ],
        activities: [
          'Shkruaj një paragraf për një hobi tëndin, duke ndjekur strukturën 3-fjalish.',
          'Nënvizo fjalinë tematike dhe të përmbylljes.',
          'Kontrollo nëse fjalitë mbështetëse janë me të vërtetë të lidhura me idenë kryesore.',
        ],
        quiz: {
          questions: [
            {
              id: 'g6-language-q1',
              prompt:
                'Cila fjali do të ishte më e përshtatshme si fjali tematike për një paragraf mbi futbollin?',
              options: [
                'Unë shkoj në stërvitje çdo të martë.',
                'Futbolli është sporti im i preferuar sepse më sfidon fizikisht dhe mendërisht.',
                'Në ndeshjen e fundit shënova një gol.',
                'Këpucët e mia të futbollit janë të reja.',
              ],
              answerIndex: 1,
              explanation:
                'Fjalia prezanton qartë idenë kryesore të paragrafit dhe lejon shembuj mbështetës.',
            },
            {
              id: 'g6-language-q2',
              prompt:
                'Cila fjali shërben si përfundim për paragraf mbi përfitimet e leximit?',
              options: [
                'Librat më të fundit që kam lexuar janë aventurat.',
                'Shpesh lexoj para gjumit.',
                'Prandaj, leximi më ndihmon të relaksohem dhe të zhvilloj imagjinatën.',
                'Kam një bibliotekë të vogël në shtëpi.',
              ],
              answerIndex: 2,
              explanation:
                'Fjalia përmbledh përfitimet dhe mbyll idenë e paragrafit.',
            },
          ],
        },
        tip: 'Lexoje paragrafën me zë gjatë rishikimit për të siguruar rrjedhshmëri.',
      },
      {
        id: 'g6-math-algebra-basics',
        subject: 'Matematikë',
        topic: 'Algjebra bazë: shprehje dhe ekuacione',
        week: 2,
        timeEstimate: '20 min',
        overview:
          'Përsërit shprehjet algebrike dhe zgjidh ekuacionet lineare përmes balancimit të anëve.',
        competencies: ['Të menduarit (kritik/kreativ)', 'Të mësuarit për të nxënë'],
        outcomes: [
          'Arsyeton hapat e thjeshtimit të shprehjeve dhe vërteton zgjidhjen e ekuacioneve lineare.',
          'Përdor prova numerike për të justifikuar zgjidhjen dhe e lidh me situata reale.'
        ],
        assessmentCriteria: [
          'Shpjegimi përmend thjeshtimin ose balancimin si koncept kyç.',
          'Zgjidhja mbështetet me shembull numerik ose krahasim të anëve të ekuacionit.'
        ],
        reasoningKeywords: ['thjeshtim', 'ekuacion', 'balancim', 'zgjidhje'],
        locked: false,
        reading: [
          'Shprehjet algebrike kombinohen duke mbledhur terma të njëjtë (p.sh. 2x + 3x = 5x).',
          'Për të zgjidhur një ekuacion linear, kryej të njëjtën veprim në të dy anët.',
          'Verifikimi bëhet duke zëvendësuar vlerën e gjetur në ekuacionin fillestar.'
        ],
        activities: [
          'Thjeshto shprehjen: 4x + 7 - 2x + 3.',
          'Zgjidh ekuacionin: 3x - 5 = 13.',
          'Shkruaj një situatë reale ku duhet të gjesh vlerën e një vargu të panjohur (p.sh. shpenzimet e javës).'
        ],
        quiz: {
          reasoningPrompt:
            'Shpjego pse hapat e tua janë të sakta. Përdor fjalë si “balancim”, “thjeshtim” ose “ekuacion”.',
          questions: [
            {
              id: 'g6-algebra-q1',
              prompt: 'Cila shprehje tregon rezultatin e thjeshtimit të 5y + 2 - 3y + 6?',
              options: ['2y + 8', '8y + 2', '8y + 6', '3y + 7'],
              answerIndex: 0,
              explanation:
                'Mbledh termat me y: 5y - 3y = 2y dhe numrat: 2 + 6 = 8, pra 2y + 8.'
            },
            {
              id: 'g6-algebra-q2',
              prompt: 'Zgjidh ekuacionin 4x - 6 = 2x + 10. Sa është x?',
              options: ['4', '6', '8', '16'],
              answerIndex: 2,
              explanation:
                'Hiq 2x nga të dyja anët për të marrë 2x - 6 = 10, shto 6 për të marrë 2x = 16 dhe pjesëto me 2: x = 8.'
            },
            {
              id: 'g6-algebra-q3',
              prompt:
                'Nëse një biletë muzeu kushton 3 € dhe një guidë audio 1.5 €, cili ekuacion përfaqëson koston totale C për n udhëtarë bashkë me 2 guida?',
              options: [
                'C = 3n + 3',
                'C = 3n + 1.5',
                'C = 3n + 1.5n',
                'C = 4.5n'
              ],
              answerIndex: 0,
              explanation:
                'Çdo udhëtar paguan 3 €, ndërsa dy guida kushtojnë 3 € shtesë: C = 3n + 3.'
            }
          ]
        },
        tip: 'Kontrollo zgjidhjen duke e zëvendësuar rezultatin në ekuacionin fillestar për të parë nëse anët barazohen.'
      },
      {
        id: 'g6-science-water-cycle',
        subject: 'Shkencë',
        topic: 'Cikli i ujit',
        timeEstimate: '20 min',
        overview:
          'Njihu me fazat e ciklit të ujit dhe si energjia e diellit e drejton atë.',
        reading: [
          'Avullimi ndodh kur dielli ngroh ujin dhe ai shndërrohet në avull.',
          'Kondensimi formon re kur avulli ftohet dhe kthehet në pika.',
          'Reshjet bien kur pikat bëhen të rënda dhe kthehen në tokë.',
        ],
        activities: [
          'Vizato ciklin e ujit dhe shëno fazat kryesore.',
          'Shpjego me fjalët e tua ku ndodh avullimi në natyrë.',
          'Lidh ciklin e ujit me motin që ke vërejtur këtë javë.',
        ],
        quiz: {
          questions: [
            {
              id: 'g6-science-q1',
              prompt: 'Cila fazë e ciklit të ujit ndodh e para?',
              options: ['Kondensimi', 'Avullimi', 'Reshjet', 'Rrjedhja'],
              answerIndex: 1,
              explanation:
                'Avullimi është hapi i parë ku uji bëhet avull për shkak të nxehtësisë së diellit.',
            },
            {
              id: 'g6-science-q2',
              prompt:
                'Çfarë ndodh me avullin e ujit kur ngjitet në atmosferë dhe ftohet?',
              options: [
                'Kthehet në akull menjëherë.',
                'Vazhdon të rritet si avull.',
                'Kondensohet dhe formon re.',
                'Zhduket.',
              ],
              answerIndex: 2,
              explanation:
                'Avulli ftohet dhe kondensohet, duke formuar pika uji që krijojnë retë.',
            },
          ],
        },
        tip: 'Lidh çdo fazë me shembuj konkretë nga natyra që ke parë personalisht.',
      },
    ],
    enrichment: [
      'Puno 10 minuta në një aplikacion matematikor për ushtrime shtesë.',
      'Regjistro një përmbledhje të shkurtër zanore të asaj që mësove sot.',
    ],
  },
  '7': {
    greeting: 'Plan i ri për klasën e 7-të - vazhdo me ritëm!',
    focusNote:
      'Sot trajtojmë kënde të shumëkëndëshave, figurën e stilit personifikim dhe qelizat bimore.',
    modules: [
      {
        id: 'g7-math-angles',
        subject: 'Matematikë',
        topic: 'Këndet në shumëkëndësha',
        timeEstimate: '25 min',
        overview:
          'Përdor formulën (n - 2) × 180° për të gjetur shumën e këndeve të brendshme.',
        reading: [
          'Shuma e këndeve të brendshme të një trekëndëshi është 180°.',
          'Për një katërkëndësh: (4 - 2) × 180° = 360°.',
          'Këndet e jashtme të një shumëkëndëshi konveks gjithmonë mbledhin 360°.',
        ],
        activities: [
          'Llogarit shumën e këndeve të brendshme për një gjashtëkëndësh.',
          'Gjej madhësinë e çdo këndi në një pesëkëndësh të rregullt.',
          'Zhyt një figurë reale (p.sh. dritare, tabelë) dhe identifiko shumëkëndëshin.',
        ],
        quiz: {
          questions: [
            {
              id: 'g7-math-q1',
              prompt: 'Sa është shuma e këndeve të brendshme të një tetëkëndëshi?',
              options: ['900°', '1080°', '1260°', '1440°'],
              answerIndex: 1,
              explanation:
                '(8 - 2) × 180° = 6 × 180° = 1080°. Kujto formulën (n - 2) × 180°.',
            },
            {
              id: 'g7-math-q2',
              prompt:
                'Cili është madhësia e çdo këndi të jashtëm në një gjashtëkëndësh të rregullt?',
              options: ['45°', '50°', '60°', '90°'],
              answerIndex: 2,
              explanation:
                'Këndet e jashtme formojnë gjithsej 360°, pra 360° ÷ 6 = 60°.',
            },
          ],
        },
        tip: 'Skico figurën çdo herë që nuk je i sigurt - të ndihmon të shohësh raportet.',
      },
      {
        id: 'g7-language-personification',
        subject: 'Gjuhë shqipe',
        topic: 'Personifikimi në poezi',
        timeEstimate: '15 min',
        overview:
          'Personifikimi u jep tipare njerëzore objekteve ose dukurive jo të gjalla.',
        reading: [
          'Shembull: “Era më pëshpëriti sekretin e detit.” Era nuk flet, por merr tipar njerëzor.',
          'Personifikimi krijon gjallëri dhe ndjenjë në tekst.',
          'Krahasoje me metaforën: metafora barazon dy gjëra, personifikimi i jep tipare humaine.',
        ],
        activities: [
          'Gjej dy shembuj personifikimi në një poezi që ke lexuar.',
          'Shkruaj dy fjali të reja me personifikim mbi natyrën.',
          'Krahaso një shembull personifikimi me një metaforë nga i njëjti tekst.',
        ],
        quiz: {
          questions: [
            {
              id: 'g7-language-q1',
              prompt:
                'Cila fjali përmban personifikim?',
              options: [
                'Dielli ndriçon qiellin e mëngjesit.',
                'Dielli u zhvesh nga rrezet e arta dhe u fsheh pas maleve.',
                'Male të larta rrethojnë qytetin.',
                'Qielli ishte i kaltër sot.',
              ],
              answerIndex: 1,
              explanation:
                'Dielli nuk “zhvishet” ose “fshihet” si njeri; kjo është personifikim.',
            },
            {
              id: 'g7-language-q2',
              prompt:
                'Pse përdoret personifikimi në poezi?',
              options: [
                'Për të shpjeguar termat shkencorë.',
                'Për të bërë tekstin më të gjallë dhe emocionues.',
                'Për të rritur numrin e fjalëve.',
                'Për të shmangur metaforat.',
              ],
              answerIndex: 1,
              explanation:
                'Personifikimi i jep jetë dhe emocion objekteve të pajeta, gjë që e bën tekstin më tërheqës.',
            },
          ],
        },
        tip: 'Lexo me zë që të ndjesh ritmin dhe figurën e gjuhës.',
      },
      {
        id: 'g7-science-cells',
        subject: 'Biologji',
        topic: 'Qeliza bimore kundrejt qelizës shtazore',
        timeEstimate: '20 min',
        overview:
          'Krahaso organelat kyçe: muri qelizor, kloroplastet dhe vakuolat.',
        reading: [
          'Qelizat bimore kanë mur qelizor prej celuloze që u jep formë të qëndrueshme.',
          'Kloroplastet kryejnë fotosintezën dhe janë vetëm në qelizat bimore.',
          'Qelizat shtazore kanë vakuola të vogla; qelizat bimore zakonisht kanë një vakuolë të madhe qendrore.',
        ],
        activities: [
          'Plotëso një tabelë krahasimi midis qelizës bimore dhe asaj shtazore.',
          'Skico një qelizë bimore dhe shëno organelat kryesore.',
          'Shpjego pse kafshët nuk kanë kloroplaste.',
        ],
        quiz: {
          questions: [
            {
              id: 'g7-science-q1',
              prompt: 'Cila organelë gjendet vetëm në qelizat bimore?',
              options: ['Mitokondria', 'Kloroplastet', 'Bërthama', 'Ribozomet'],
              answerIndex: 1,
              explanation:
                'Kloroplastet janë të pranishme vetëm në qelizat bimore dhe fotosintezojnë.',
            },
            {
              id: 'g7-science-q2',
              prompt:
                'Pse qelizat bimore kanë mur qelizor?',
              options: [
                'Për të prodhuar energji.',
                'Për të kontrolluar ADN-në.',
                'Për të dhënë strukturë dhe për të mbrojtur qelizën.',
                'Për të ndihmuar ndarjen qelizore.',
              ],
              answerIndex: 2,
              explanation:
                'Muri qelizor i bën qelizat më të forta dhe ruan formën e tyre.',
            },
          ],
        },
        tip: 'Mendo për funksionin e çdo organeli si “mjeti” i qelizës.',
      },
    ],
    enrichment: [
      'Shiko një video edukative 5-minutëshe për astronominë.',
      'Praktiko 10 minuta instrumentin tënd muzikor ose dëgjo një pjesë klasike.',
    ],
  },
  '8': {
    greeting: 'Klasë e 8-të, gati për një ditë të re mësimore!',
    focusNote:
      'Matematikë me sisteme linearë, analizë e teksteve argumentuese dhe energjia në fizikë.',
    modules: [
      {
        id: 'g8-math-systems',
        subject: 'Matematikë',
        topic: 'Sistemet lineare me dy të panjohura',
        timeEstimate: '30 min',
        overview:
          'Zgjidh sistemet me metoda të ndryshme: zëvendësim dhe eleminim.',
        reading: [
          'Sistemi linear ka dy ose më shumë ekuacione me të njëjtat të panjohura.',
          'Metoda e zëvendësimit: izoloni një variabël në një ekuacion, pastaj zëvendësoni në tjetrin.',
          'Metoda e eleminimit: shto ose zbrit ekuacionet për të eliminuar një variabël.',
        ],
        activities: [
          'Zgjidh sistemin: x + y = 12 dhe x - y = 4.',
          'Zgjidh sistemin: 2x + 3y = 18 dhe x - y = 1 duke përdorur zëvendësimin.',
          'Krijo vetë një sistem që ka zgjidhje (3, 2).',
        ],
        quiz: {
          questions: [
            {
              id: 'g8-math-q1',
              prompt:
                'Zgjidh sistemin: 2x + y = 11 dhe x - y = 1. Sa është x?',
              options: ['3', '4', '5', '6'],
              answerIndex: 1,
              explanation:
                'Nga x - y = 1 rrjedh y = x - 1. Zëvendëso: 2x + (x - 1) = 11 → 3x = 12 → x = 4.',
            },
            {
              id: 'g8-math-q2',
              prompt:
                'Për sistemin x + 2y = 10 dhe 3x - 2y = 2, sa është y?',
              options: ['1', '2', '3', '4'],
              answerIndex: 2,
              explanation:
                'Shto ekuacionet: 4x = 12 → x = 3. Zëvendëso: 3 + 2y = 10 → 2y = 7 → y = 3.5 (opsion 3).',
            },
          ],
        },
        tip: 'Kontrollo zgjidhjen duke i vendosur vlerat në të dyja ekuacionet.',
      },
      {
        id: 'g8-language-argument',
        subject: 'Gjuhë shqipe',
        topic: 'Teksti argumentues',
        timeEstimate: '20 min',
        overview:
          'Ndërto argumente të qarta me prova dhe kundër-argumente.',
        reading: [
          'Një tekst argumentues ka tezën, arsyet mbështetëse dhe shembujt.',
          'Prova mund të jenë statistika, fakte ose përvoja personale të besueshme.',
          'Përfshi një kundër-argument të shkurtër dhe shpjego pse teza jote mbetet e fortë.',
        ],
        activities: [
          'Zgjidh një tezë (p.sh. “Nxënësit duhet të kenë më shumë orë arti”) dhe shkruaj dy arsye.',
          'Gjej një kundër-argument të mundshëm dhe përgatis një përgjigje.',
          'Përdor lidhëza logjike si “për më tepër”, “përfundimisht”.',
        ],
        quiz: {
          questions: [
            {
              id: 'g8-language-q1',
              prompt:
                'Cili element është thelbësor në një tekst argumentues?',
              options: [
                'Vetëm përshkrimi i personazheve',
                'Një tezë e qartë e mbështetur me prova',
                'Sa më shumë mbiemra të bukur',
                'Një fund i paqartë',
              ],
              answerIndex: 1,
              explanation:
                'Pa tezë dhe prova, teksti nuk është argumentues. Përshkrimi dhe mbiemrat janë dytësorë.',
            },
            {
              id: 'g8-language-q2',
              prompt:
                'Pse është i dobishëm kundër-argumenti në ese?',
              options: [
                'Për të ndryshuar plotësisht temën.',
                'Për të treguar se ke konsideruar edhe pikëpamjet e tjera.',
                'Për të zgjatur tekstin.',
                'Për të shmangur prova të qarta.',
              ],
              answerIndex: 1,
              explanation:
                'Pohimi i pikëpamjeve të tjera e bën argumentin më të besueshëm.',
            },
          ],
        },
        tip: 'Lexo tezën me zë: a është e diskutueshme? Nëse jo, riformuloje.',
      },
      {
        id: 'g8-science-energy',
        subject: 'Fizikë',
        topic: 'Transformimet e energjisë',
        timeEstimate: '25 min',
        overview:
          'Eksploro si energjia kalon nga një formë në tjetrën.',
        reading: [
          'Energjia ruhet: ajo nuk krijohet apo shkatërrohet, vetëm transformohet.',
          'Shembull: energjia potenciale gravitacionale shndërrohet në energji kinetike kur një objekt bie.',
          'Makineritë përdorin energjinë kimike të karburantit për të prodhuar energji mekanike.',
        ],
        activities: [
          'Përshkruaj transformimin e energjisë në një roller coaster.',
          'Identifiko 3 shembuj të transformimeve të energjisë në shtëpi.',
          'Shpjego pse energjia elektrike shndërrohet në nxehtësi në një ngrohës.',
        ],
        quiz: {
          questions: [
            {
              id: 'g8-science-q1',
              prompt:
                'Kur ndez një llambë, cila shndërrim energjie ndodh kryesisht?',
              options: [
                'Kimike në termike',
                'Elektrike në dritë dhe nxehtësi',
                'Potenciale në bërthamore',
                'Kinetike në kimike',
              ],
              answerIndex: 1,
              explanation:
                'Energjia elektrike shndërrohet në dritë dhe pak nxehtësi nga fije llambës.',
            },
            {
              id: 'g8-science-q2',
              prompt:
                'Objekti bie nga një lartësi. Cili transformim ndodh gjatë rënies?',
              options: [
                'Kinetike në potenciale',
                'Potenciale në kinetike',
                'Termike në kimike',
                'Elektrike në termike',
              ],
              answerIndex: 1,
              explanation:
                'Energjia potenciale gravitacionale kthehet në energji kinetike gjatë rënies.',
            },
          ],
        },
        tip: 'Vizualizo me një diagram rrjedhën e energjisë nga burimi tek produkti.',
      },
    ],
    enrichment: [
      'Diskuto me një shok një argument tëndin për 5 minuta.',
      'Bëj 10 ushtrime fleksibiliteti ose pushime aktive.',
    ],
  },
  '9': {
    greeting: 'Plan i avancuar për klasën e 9-të - vazhdo të sfidosh veten!',
    focusNote:
      'Punojmë me funksione kuadratike, analizë letrare dhe gjenetikën bazë.',
    modules: [
      {
        id: 'g9-math-quadratic',
        subject: 'Matematikë',
        topic: 'Funksionet kuadratike',
        timeEstimate: '30 min',
        overview:
          'Analizo format y = ax² + bx + c, gjej kulmin dhe prerjet me boshtet.',
        reading: [
          'Vertex (kulmi) i funksionit kuadratik gjendet me formulën: x = -b / (2a).',
          'Diskriminanti Δ = b² - 4ac tregon numrin e zgjidhjeve reale.',
          'Forma e plotësimit të katrorit shndërron funksionin në a(x - h)² + k.',
        ],
        activities: [
          'Gjej kulmin e funksionit y = x² - 4x + 1.',
          'Llogarit diskriminantin për y = 2x² + 3x - 2 dhe përcakto numrin e rrënjëve reale.',
          'Vizato grafikun e y = -x² + 6x - 5 dhe shëno pikët kyçe.',
        ],
        quiz: {
          questions: [
            {
              id: 'g9-math-q1',
              prompt:
                'Për funksionin y = x² - 6x + 8, sa është vlera e x në kulm?',
              options: ['2', '3', '4', '5'],
              answerIndex: 1,
              explanation:
                'a = 1, b = -6 → x = -(-6) / (2×1) = 6 / 2 = 3.',
            },
            {
              id: 'g9-math-q2',
              prompt:
                'Çfarë tregon një diskriminant negativ?',
              options: [
                'Funksioni nuk ka kulm.',
                'Funksioni ka dy rrënjë reale të dallueshme.',
                'Funksioni ka një rrënjë reale të përsëritur.',
                'Funksioni nuk ka rrënjë reale.',
              ],
              answerIndex: 3,
              explanation:
                'Δ < 0 do të thotë që nuk ka vlera reale të x-it që e bëjnë ekuacionin 0.',
            },
          ],
        },
        tip: 'Kontrollo grafikun me një mjet online për të parë nëse koordinatat e kulmit janë të sakta.',
      },
      {
        id: 'g9-language-analysis',
        subject: 'Letërsi',
        topic: 'Analizë e karakterit',
        timeEstimate: '20 min',
        overview:
          'Zhvillo analiza të thelluara duke lidhur motivimet, konfliktet dhe transformimet.',
        reading: [
          'Identifiko çfarë e shtyn personazhin: frika, dëshira, presioni shoqëror.',
          'Krahaso personazhin në fillim dhe në fund të veprës për të parë zhvillimin.',
          'Cito fragmente që mbështesin analizën tënde.',
        ],
        activities: [
          'Zgjidh një personazh nga një roman i lexuar dhe përshkruaj konfliktin e tij kryesor.',
          'Shpjego si ndikon mjedisi në veprimet e personazhit.',
          'Cito dy fragmente që tregojnë zhvillimin e karakterit.',
        ],
        quiz: {
          questions: [
            {
              id: 'g9-language-q1',
              prompt:
                'Cili faktor ndihmon më shumë për të kuptuar motivimin e personazhit?',
              options: [
                'Numri i faqeve të librit',
                'Veprimet dhe zgjedhjet që ai bën',
                'Vendi ku është botuar libri',
                'Koha e leximit',
              ],
              answerIndex: 1,
              explanation:
                'Veprimet dhe zgjedhjet pasqyrojnë motivimet e brendshme të personazhit.',
            },
            {
              id: 'g9-language-q2',
              prompt:
                'Pse është e rëndësishme të përdorësh citime në analizë?',
              options: [
                'Sepse pa to teksti është shumë i shkurtër.',
                'Citimet japin prova direkte nga teksti dhe e bëjnë analizën të besueshme.',
                'Për të treguar se e ke lexuar librin shumë shpejt.',
                'Sepse të gjitha analizat duhet të kenë vargje poetike.',
              ],
              answerIndex: 1,
              explanation:
                'Pa citime, analiza duket si opinion personal pa mbështetje.',
            },
          ],
        },
        tip: 'Zgjidh citime të shkurtra dhe komento menjëherë pas tyre.',
      },
      {
        id: 'g9-science-genetics',
        subject: 'Biologji',
        topic: 'Bazat e gjenetikës',
        timeEstimate: '25 min',
        overview:
          'Kupto ADN-në, gjenet dhe tiparet e trashëguara.',
        reading: [
          'Gjenet janë segmente të ADN-së që përmbajnë informacion për tipare specifike.',
          'Alelët janë variacione të të njëjtit gjen; ato mund të jenë dominant ose recesiv.',
          'Tabela e Punetit tregon kombinimet e mundshme të aleleve te pasardhësit.',
        ],
        activities: [
          'Ndërto një tabelë Punet për dy prindër me alele Aa dhe Aa.',
          'Shpjego ndryshimin midis tiparit fenotipik dhe gjenotipik.',
          'Gjej një shembull të një tipari dominant te njerëzit.',
        ],
        quiz: {
          questions: [
            {
              id: 'g9-science-q1',
              prompt:
                'Nëse dy prindër kanë gjenotipe Aa dhe Aa, cila është gjasësia për fëmijë me gjenotip aa?',
              options: ['25%', '50%', '75%', '100%'],
              answerIndex: 0,
              explanation:
                'Tabela e Punetit jep kombinimet: AA, Aa, aA, aa. Vetëm një nga katër është aa.',
            },
            {
              id: 'g9-science-q2',
              prompt:
                'Çfarë do të thotë që një alel është dominant?',
              options: [
                'Ai nuk shfaqet kurrë në fenotip.',
                'Ai mbulon shfaqjen e alelit recesiv në fenotip.',
                'Ai shfaqet vetëm te speciet bimore.',
                'Ai nuk trashëgohet.',
              ],
              answerIndex: 1,
              explanation:
                'Alelët dominantë shfaqen në fenotip edhe kur janë të pranishëm me një alel recesiv.',
            },
          ],
        },
        tip: 'Përdor ngjyra të ndryshme për të shënuar alelet në tabelën Punet.',
      },
    ],
    enrichment: [
      'Shkruaj një reflektim 10-fjalësh për çdo temë të ditës.',
      'Bëj një shëtitje 15-minutëshe për të çlodhur mendjen.',
    ],
  },
};
