# Kosovo Learn – Udhëzuesi i stafit

Mirë se vini në panelin e stafit për platformën **Kosovo Learn**. Ky dokument shpjegon si të kyçeni, si ta organizoni kurrikulën, si të shtoni materiale mësimore dhe si të monitoroni progresin e nxënësve.

## 1. Hyrja dhe llogaritë provë

- Hapni aplikacionin (lokalisht `npm install` → `npm start`, platforma hapet në `http://localhost:3000`).
- Për rolin e stafit përdorni kredencialet demo:
  - **Email:** `admin@kosovolearn.com`
  - **Fjalëkalimi:** `admin123`
- Për testim të perspektivës së nxënësit përdorni `nxenesi@example.com / sekreti123`.

Pas hyrjes, kaloni në seksionin **“Paneli i stafit”** nga switch-i lart majtas.

## 2. Struktura e panelit të stafit

Sidebar-i i stafit përmban pesë seksione kryesore:

1. **Përmbledhje** – Pasqyron bibliotekën ekzistuese të lëndëve dhe mësimeve.
2. **Planifikimi** – Organizoni modulet sipas javëve, kompetencave dhe rezultateve të të nxënit.
3. **Mësimet** – Shfletoni mësimet aktuale për çdo lëndë.
4. **Shto lëndë** – Krijoni lëndë të reja në bibliotekë.
5. **Shto mësim** – Shtoni mësime/tema brenda një lënde ekzistuese.
6. **Chats** – Menaxhoni komunikimin live me nxënësit.

## 3. Planifikimi i kurrikulës

Seksioni **Planifikimi** ruan një plan javë-pas-jave në `localStorage`. Ky plan mbivendos kurrikulën standarte (shkurtimet e Kornizës Bërthamë AMU 2016).

### Çfarë mund të bëni:
- **Java e modulit** – Përdorni dropdown-in “Java X” për të caktuar në cilën javë të vitit hapet moduli. Nxënësit nuk e shohin temën para javës së caktuar (nëse nuk janë staf).
- **Kompetencat** – Klikoni butonat për kompetencat bazë (p.sh. “Të menduarit (kritik/kreativ)”). Mund të përzgjidhni disa kompetenca. Nëse asnjë nuk është aktive, shfaqet një paralajmërim.
- **Rezultatet e të nxënit** – Shkruani nga një rezultat për çdo rresht. Përgatiten paraprakisht nga Korniza Bërthamë dhe mund t’i përshtatni sipas nevojës.
- **Shënime** – Shtoni komente, evidenca ose burime që stafi/mentorët duhet të dinë (p.sh. “Përdorë shembullin e katalogut online”).

Gjithçka ruhet automatikisht sapo fushat humbin fokusin.

## 4. Shtimi i lëndëve dhe mësimeve

### 4.1 Shto lëndë
- Hyni te **Shto lëndë**.
- Plotësoni emrin, përshkrimin, ikonën, ngjyrën dhe klasat që e mbulojnë.
- Klikoni **“Ruaj lëndën”**. Lënda ruhet në `localStorage` dhe bëhet menjëherë e disponueshme për nxënësit dhe për panelin **Mësimet**.

### 4.2 Shto mësim (modul i ri kurrikular)
- Hyni te **Shto mësim** dhe zgjidhni lëndën.
- Plotësoni informacionin bazë: titullin, përmbledhjen, klasën, kohën e parashikuar.
- Vendosni javën e planit, rezultatet e të nxënit (një për rresht), shënimet dhe kompetencat përkatëse.
- Shtoni segmentet e literaturës (butoni **“+ Shto segment tjetër”**), aktivitetet kryesore dhe pyetjet e kuizit (prompt + opsione + shpjegim).
- Ruajeni. Platforma:
  - e shton mësimin në bibliotekën e lëndës,
  - krijon automatikisht një modul të ri në Planifikim (me javën/outcomes që selektuat),
  - e shfaq modulën e re te nxënësit sipas javës së planifikuar.

### 4.3 Leximi i kontrolluar
- Nxënësit klikojnë **“Lexo materialin”** nga “Shto së shpejti” ose nga lista e kuizeve.
- Çdo faqe ka timer minimal (llogaritet nga numri i fjalëve dhe klasa). Butoni “Faqja tjetër” aktivizohet vetëm kur timer-i përfundon.
- Kur mbarojnë faqet, `readingDone` ruhet në profilin e nxënësit dhe platforma i dërgon automatikisht te kuizi i modulit.
- Kuizi nuk lejon dorëzimin pa përfunduar leximin; shfaqet mesazhi “Përfundo leximin…” derisa evidenca të plotësohet.
- Për mësimet e krijuara nga stafi, klikoni **“Menaxho literaturën”** te seksioni **Mësimet** për të përditësuar materialin, rezultatet dhe kompetencat.

## 5. Kuizet dhe evidencat e nxënësve

Nga perspektiva e nxënësit:

1. Kur hapet një kuiz, e shfaq kompetencën/outcome të planifikuar nga stafi.
2. Nxënësi duhet të plotësojë përgjigjet dhe **arsyetimin** (minimum 30 karaktere + referencë konceptuale).
3. Nëse arsyetimi përmban fjalët kyçe (p.sh. “balancim”, “ekuacion”), rezultati ruhet si **evidencë**.
4. Evidencat shfaqen në profilin e nxënësit (timeline, badge “Mendimtar kritik”) dhe ruhet nën kompetencën përkatëse.

Si staf, mund të:
- Hapni seksionin **Chats** për të parë pyetjet që vijnë nga kuizet (platforma dërgon auto-reply, por mund të përgjigjeni manualisht).
- Shikoni panelin **Mësimet** për të kontrolluar statuset “i pa nisur / në progres / komplet”.
- Bëni refresh të planit në “Planifikimi” për të parë evidencat dhe javët aktuale.

## 6. Menaxhimi i nxënësve

- Te paneli i nxënësit (pika “Studentë” në modin student/staf) mund të shtoni nxënës të rinj me **“+ Nxënës i ri”**.
- Formulari kërkon emrin, email-in, klasën, avatarin dhe fjalëkalimin fillestar.
- Llogaritë ruajnë fjalëkalimin e hash-uar (hash-i gjenerohet automatikisht).

## 7. Këshilla për mirëmbajtje

- Nëse dëshironi të resetoni të dhënat lokale gjatë zhvillimit, fshini çelësat `daily-learning-*` nga `localStorage` (DevTools → Application → Local Storage).
- Për të importuar planin zyrtar për klasat VIII–IX, plotesoni `curriculumPlanTemplate` me modulet përkatëse ose përpunoni PDF-në `src/korniza-berthame-2-final_1.pdf` në JSON dhe bashkojeni.
- Mbani mend se çdo ndryshim në plan/lëndë është lokal për shfletuesin aktual. Për shpërndarje në një mjedis tjetër, eksportoni JSON-in nga devtools dhe importojeni manualisht.

## 8. Pyetje të shpeshta

- **Pse një kuiz nuk shfaqet te nxënësi?** – Kontrolloni javën në Planifikim; nëse `week > java aktuale`, kuizi qëndron i bllokuar për nxënësit.
- **Si e di që evidenca u ruajt?** – Hapni profilin e nxënësit, timeline duhet të përditësohet me një hyrje “quiz” dhe badge-et mund të azhurnohen (p.sh. “Mendimtar kritik” pas 5 evidencave në 3 lëndë të ndryshme).
- **Çfarë ndodh nëse kompetencat mbeten bosh?** – Sìgnalet shfaqen në planificues; nën tekste, platforma përdor kompetencat e kurrikulës bazë, por rekomandohet t’i definoni manualisht.

---

**Nëse keni nevojë për zgjerime** (p.sh. import masiv të planit nga PDF, raport PDF për evidencat, sinkronizim të planit midis pajisjeve), hapni tiketë ose kontaktoni ekipin e zhvillimit. Përditësimet e ardhshme do të dokumentohen këtu. Suksese në planifikim! 💡📚✨
