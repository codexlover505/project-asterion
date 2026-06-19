(() => {
  "use strict";

  const canvas = document.querySelector("#game");
  const ctx = canvas.getContext("2d", { alpha: false });
  const minimapCanvas=document.querySelector("#minimap");
  const minimapCtx=minimapCanvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;

  const $ = (selector) => document.querySelector(selector);
  const screens = [...document.querySelectorAll(".screen")];
  const hud = $("#hud");
  const ui = {
    chapterKicker: $("#chapter-kicker"), chapterName: $("#chapter-name"),
    objective: $("#objective"), message: $("#message"),
    health: $("#health-fill"), healthNumber: $("#health-number"),
    stamina: $("#stamina-fill"), weapon: $("#weapon-name"), ammo: $("#ammo"),
    bossUI: $("#boss-ui"), bossName: $("#boss-name"), bossFill: $("#boss-fill"),
    damage: $("#damage-flash")
  };

  const chapters = [
    {
      roman: "I", name: "ЗАМОК ЧЁРНОЙ РОЗЫ", kicker: "КРОВЬ · ПОТЕРЯ СЫНА",
      boss: "ГРАФИНЯ ВАЛЬДОРА", phases: ["БАГРОВАЯ ГРАФИНЯ", "КРОВАВАЯ МАТЬ", "ИСТИННАЯ ВАЛЬДОРА"],
      enemy: "Кровавый слуга", relic: "Роза Вальдоры", weapon: "РЖАВОЕ КОПЬЁ",
      enemyTypes: [{name:"Кровавый слуга",hp:.8,speed:1.05,damage:.8,shape:"servant"},{name:"Вампир-аристократ",hp:1.3,speed:1.25,damage:1.2,shape:"vampire"}],
      zones: ["ВХОДНОЙ ДВОР","ГЛАВНЫЙ ЗАЛ","БИБЛИОТЕКА","ВОСТОЧНОЕ КРЫЛО","ПОКОИ АДРИАНА","ВИННЫЕ ПОГРЕБА","БАШНЯ ВАЛЬДОРЫ","КРЫША ЗАМКА"],
      miniBossAt: 4, miniBoss: "АДРИАН ВАЛЬДОР", unlocks: {0:"axe",2:"sword",3:"crossbow",6:"revolver"},
      wall: [92, 76, 82], wallAlt: [111, 67, 61], sky: [44, 41, 58], floor: [46, 36, 33], floorAlt: [67, 45, 40], fog: [72, 66, 76], light: [205, 132, 78], enemyColor: [126, 43, 55], accent: "#b33b43",
      seed: 1129, enemyCount: 8, bossHp: 350, damage: 28, range: 1.75,
      intro: ["Разбитая карета отца стоит у ворот.", "За окнами замка — один только туман.", "Кто-то внутри играет на расстроенном пианино."],
      notes: [
        ["ЗАПИСКА ОТЦА №1", "Они живут внутри замка. Они не прячутся. Они ждут."],
        ["ДНЕВНИК ВАЛЬДОРЫ", "Я обещала Адриану, что смерть его не найдёт. Теперь он просит позволить ему умереть."]
      ],
      victory: "На камне остаётся чёрная роза, влажная от чужой крови."
    },
    {
      roman: "II", name: "ВЕДЬМИН БОР", kicker: "ПРИРОДА · ПОТЕРЯ СЕБЯ",
      boss: "ЧЕРНОБОР", phases: ["ХОЗЯИН ЧАЩИ", "ЗВЕРЬ ИЗ КОРНЕЙ", "СЕРДЦЕ ЛЕСА"],
      enemy: "Лесной одичалый", relic: "Рог Чернобора", weapon: "ЛУК ОХОТНИКА",
      enemyTypes: [{name:"Заражённый волк",hp:.75,speed:1.5,damage:.8,shape:"wolf"},{name:"Корневое существо",hp:1.45,speed:.72,damage:1.3,shape:"root"},{name:"Заражённый охотник",hp:1.25,speed:.9,damage:1.2,shape:"hunter"}],
      zones: ["ЛЕСНАЯ ТРОПА","БОЛОТО","ПОЛЯНА ТОТЕМОВ","СЕРДЦЕ ЛЕСА","ПЕЩЕРА КОРНЕЙ","ДРЕВНИЙ ДУБ","АРЕНА ЧЕРНОБОРА"],
      miniBossAt: -1, miniBoss: null, unlocks: {1:"bow"},
      wall: [54, 79, 50], wallAlt: [79, 57, 42], sky: [33, 51, 55], floor: [38, 54, 34], floorAlt: [60, 70, 38], fog: [63, 86, 70], light: [153, 162, 75], enemyColor: [100, 122, 66], accent: "#799861",
      seed: 2273, enemyCount: 9, bossHp: 480, damage: 32, range: 4.4,
      intro: ["Тропа всё время возвращает Ардена к одному и тому же дереву.", "Между стволами стоят люди. При приближении они становятся пнями.", "Из глубины леса слышится тяжёлое дыхание."],
      notes: [
        ["ЗАПИСКА ОХОТНИКА", "Не отмечай путь на деревьях. К утру метки окажутся на твоей коже."],
        ["ЗАПИСКА ОТЦА №3", "Чернобор — не зверь. Это лес, который однажды научился ненавидеть."]
      ],
      victory: "Лес затихает. Среди корней лежит тяжёлый чёрный рог."
    },
    {
      roman: "III", name: "ЗАТОНУВШЕЕ АББАТСТВО", kicker: "ВОДА · РЕЛИГИОЗНОЕ БЕЗУМИЕ",
      boss: "АББАТ МОРКАН", phases: ["ПОСЛЕДНИЙ АББАТ", "УТОПЛЕННЫЙ ПРОРОК", "ПАСТЬ БЕЗДНЫ"],
      enemy: "Утопленник", relic: "Крест Моркана", weapon: "ДЛИННЫЙ МЕЧ",
      enemyTypes: [{name:"Рыбочеловек",hp:1.1,speed:1,damage:1,shape:"fishman"},{name:"Болотный ползун",hp:.7,speed:1.25,damage:.85,shape:"leech"},{name:"Амфибия",hp:1.35,speed:.9,damage:1.25,shape:"amphibian"}],
      zones: ["ЗАТОПЛЕННАЯ ДЕРЕВНЯ","ПРИЧАЛ МЕЛУЗИНЫ","ШЛЮЗ №1","ШЛЮЗ №2","ВНУТРЕННИЙ ДВОР АББАТСТВА","СОБОР АББАТСТВА","КОЛОКОЛЬНЯ","ГЛАВНАЯ ПЛОЩАДЬ","АРЕНА МОРКАНА"],
      miniBossAt: 1, miniBoss: "МЕЛУЗИНА", unlocks: {},
      wall: [67, 85, 96], wallAlt: [82, 65, 72], sky: [39, 60, 76], floor: [31, 60, 70], floorAlt: [46, 77, 80], fog: [71, 99, 112], light: [111, 174, 191], enemyColor: [61, 111, 127], accent: "#70a8b8",
      seed: 3413, enemyCount: 10, bossHp: 580, damage: 38, range: 1.55,
      intro: ["Серая вода скрывает улицы и пороги домов.", "Дна не видно даже там, где вода доходит лишь до колен.", "Женское пение раздаётся прямо за спиной."],
      notes: [
        ["МОЛИТВА УТОНУВШЕГО", "Мы погрузили колокола в воду. Теперь они звонят для тех, кто под нами."],
        ["ЗАПИСКА ОТЦА №5", "Моркан молился не богу. Он молился глубине — и глубина ответила."]
      ],
      victory: "Вода отступает на один вдох. В иле блестит почерневший крест."
    },
    {
      roman: "IV", name: "КАМЕННЫЙ ГОРОД", kicker: "ВЕЧНОСТЬ · ГОРДЫНЯ",
      boss: "ГОРН", phases: ["КАМЕННЫЙ КОРОЛЬ", "ЖИВАЯ СТАТУЯ", "ГОРОД ВО ПЛОТИ"],
      enemy: "Каменный житель", relic: "Молот Горна", weapon: "ПАРНЫЕ КЛИНКИ",
      enemyTypes: [{name:"Ожившая статуя",hp:1.45,speed:.65,damage:1.2,shape:"statue"},{name:"Каменный солдат",hp:1.7,speed:.58,damage:1.45,shape:"stoneSoldier"}],
      zones: ["ГЛАВНЫЕ ВОРОТА","УЛИЦА ПИЛИГРИМОВ","ТЕАТР","ПЛОЩАДЬ СТАТУЙ","РЫНОК","СОБОР КАМНЯ","МАСТЕРСКАЯ СКУЛЬПТОРОВ","КВАРТАЛ АРИСТОКРАТОВ","ПОДЗЕМНЫЙ СКЛЕП","ТРОННЫЙ ЗАЛ ГОРНА","АРЕНА ГОРНА"],
      miniBossAt: -1, miniBoss: null, unlocks: {3:"blades"},
      wall: [110, 106, 97], wallAlt: [82, 94, 111], sky: [62, 67, 80], floor: [57, 55, 51], floorAlt: [76, 70, 60], fog: [94, 96, 99], light: [188, 164, 112], enemyColor: [95, 108, 126], accent: "#aaa48f",
      seed: 4517, enemyCount: 11, bossHp: 700, damage: 42, range: 1.35,
      intro: ["В городе нет ветра, воды, птиц или насекомых.", "На каждом углу стоят статуи с человеческими лицами.", "Когда Арден отворачивается, их позы меняются."],
      notes: [
        ["НАДПИСЬ В ТЕАТРЕ", "Горн обещал нам вечность. Он не сказал, что мы проведём её неподвижно."],
        ["ЗАПИСКА ОТЦА №6", "Не смотри статуям в глаза. Хуже всего — узнать среди них знакомое лицо."]
      ],
      victory: "Горн рассыпается. Среди обломков остаётся молот, тяжёлый, как приговор."
    },
    {
      roman: "V", name: "ШАХТА БАГРОВОЙ РУДЫ", kicker: "ЖАДНОСТЬ · ЦЕНА ЗНАНИЯ",
      boss: "ВАРЕК", phases: ["ХОЗЯИН ШАХТЫ", "БАГРОВЫЙ ИСПОЛИН", "СЕРДЦЕ ГЛУБИНЫ"],
      enemy: "Одержимый шахтёр", relic: "Кирка Варека", weapon: "ДВУРУЧНЫЙ ТОПОР",
      enemyTypes: [{name:"Слепой шахтёр",hp:1.15,speed:.92,damage:1.1,shape:"miner"},{name:"Кристаллический мутант",hp:1.8,speed:.62,damage:1.55,shape:"crystal"}],
      zones: ["ГОРНЫЙ ПЕРЕВАЛ","ГРУЗОВОЙ ЛИФТ","ВЕРХНЯЯ ШАХТА","ЛАГЕРЬ ШАХТЁРОВ","КРИСТАЛЬНАЯ ПЕЩЕРА","ШАХТНЫЙ КОНВЕЙЕР","ТУННЕЛЬ БУРИЛЬЩИКА","МАШИННЫЙ ЗАЛ","СЕРДЦЕ ШАХТЫ","ТРОН ВАРЕКА","АРЕНА ВАРЕКА"],
      miniBossAt: 7, miniBoss: "СТАРШИЙ БУРИЛЬЩИК", unlocks: {4:"greataxe"},
      wall: [98, 57, 47], wallAlt: [120, 43, 57], sky: [38, 22, 32], floor: [53, 31, 25], floorAlt: [80, 37, 29], fog: [79, 45, 49], light: [225, 84, 53], enemyColor: [151, 62, 43], accent: "#ce5348",
      seed: 5689, enemyCount: 12, bossHp: 850, damage: 52, range: 1.55,
      intro: ["Клеть опускается туда, где заканчивается камень.", "Багровая руда пульсирует в стенах, как живая плоть.", "Из тоннеля голос отца зовёт Ардена по имени."],
      notes: [
        ["ЖУРНАЛ ШАХТЁРА", "Мы добывали руду, пока руда не начала добывать нас."],
        ["ЗАПИСКА ОТЦА №8", "Под Астерионом бьётся Сердце. Лорды — лишь его долгие сны."]
      ],
      victory: "Последняя жила гаснет. Кирка Варека всё ещё тёплая."
    },
    {
      roman: "VI", name: "НЕБЕСНЫЙ ГОРОД", kicker: "ЛОЖНОЕ СПАСЕНИЕ · СОВЕРШЕНСТВО",
      boss: "ИМПЕРАТРИЦА МОРВА", phases: ["СВЯТАЯ ИМПЕРАТРИЦА", "ПАДШИЙ АРХАНГЕЛ", "АВАТАР СЕРДЦА"],
      enemy: "Ложный ангел", relic: "Последний Довод", weapon: "МЕЧ БЕРСЕРКА",
      enemyTypes: [{name:"Мраморный страж",hp:1.75,speed:.58,damage:1.5,shape:"marble"},{name:"Ложный ангел",hp:1.3,speed:1.12,damage:1.25,shape:"falseAngel"}],
      zones: ["НЕБЕСНЫЕ ВОРОТА","БЕЛАЯ ПЛОЩАДЬ","САД АНГЕЛОВ","АРХИВ АСТЕРИОНА","ОБСЕРВАТОРИЯ","МОСТ ЛЮЦИФЕРА","ВЕЛИКИЙ СОБОР","ЗАЛ РЕЛИКВИЙ","ТРОННЫЙ ЗАЛ МОРВЫ","АРЕНА МОРВЫ"],
      miniBossAt: 5, miniBoss: "АРХАНГЕЛ ЛЮЦИФЕР", unlocks: {7:"berserker"},
      wall: [207, 192, 163], wallAlt: [153, 178, 205], sky: [111, 151, 186], floor: [140, 126, 111], floorAlt: [169, 151, 113], fog: [184, 185, 177], light: [255, 211, 112], enemyColor: [178, 136, 105], accent: "#e1ca70",
      seed: 6803, enemyCount: 13, bossHp: 1100, damage: 66, range: 1.7,
      intro: ["Белый мрамор сияет над облаками.", "Под его гладкой поверхностью проступают человеческие вены.", "В обсерватории ждёт отец. В револьвере после выстрела остаётся один патрон."],
      notes: [
        ["ДНЕВНИК МОРВЫ", "Смерть существует лишь потому, что человечество несовершенно."],
        ["ПОСЛЕДНЯЯ ЗАПИСКА ОТЦА", "Если ты дошёл сюда — значит, я уже не смогу вернуться. Не дай Сердцу выбрать новый сосуд."]
      ],
      victory: "Последний выстрел достигает Сердца. Небеса начинают падать."
    }
  ];

  const weapons = {
    spear: { name:"РЖАВОЕ КОПЬЁ", damage:60, range:1.9, cooldown:.34, melee:true, tint:[138,125,105] },
    axe: { name:"ОБЫЧНЫЙ ТОПОР", damage:90, range:1.25, cooldown:.48, melee:true, tint:[149,136,113] },
    sword: { name:"ДЛИННЫЙ МЕЧ", damage:100, range:1.55, cooldown:.3, melee:true, tint:[172,179,181] },
    crossbow: { name:"АРБАЛЕТ", damage:250, range:10, cooldown:1.8, reload:1.8, projectileSpeed:9, ammo:"bolt", ammoName:"БОЛТЫ", tint:[121,91,62] },
    bow: { name:"ЛУК ОХОТНИКА", damage:170, range:9, cooldown:.9, reload:.9, projectileSpeed:7, ammo:"arrow", ammoName:"СТРЕЛЫ", tint:[111,136,72] },
    blades: { name:"ПАРНЫЕ КЛИНКИ", damage:50, range:1.3, cooldown:.18, melee:true, tint:[157,170,181] },
    greataxe: { name:"ДВУРУЧНЫЙ ТОПОР", damage:160, range:1.45, cooldown:.72, melee:true, tint:[165,90,67] },
    berserker: { name:"МЕЧ БЕРСЕРКА", damage:220, range:1.7, cooldown:.9, melee:true, tint:[219,193,127] },
    revolver: { name:"ПОСЛЕДНИЙ ДОВОД", damage:500, range:12, cooldown:1.1, reload:1.1, projectileSpeed:12, ammo:"bullet", ammoName:"ПАТРОНЫ", tint:[190,160,93] }
  };

  const difficultyPresets={
    easy:{name:"ЛЁГКАЯ",enemyHp:.8,bossHp:.8,enemyDamage:.7},
    normal:{name:"НОРМАЛЬНАЯ",enemyHp:1,bossHp:1,enemyDamage:1},
    hard:{name:"ТЯЖЁЛАЯ",enemyHp:1.8,bossHp:2,enemyDamage:1.35},
    nightmare:{name:"КОШМАР",enemyHp:3.5,bossHp:4,enemyDamage:1.8}
  };
  const SAVE_VERSION=4;
  let selectedDifficulty="normal";

  const weaponOrder=["spear","axe","sword","crossbow","bow","blades","greataxe","berserker","revolver"];
  const decorDescriptions={
    carriage:"Разбитая карета отца. На дверце остались следы длинных когтей.",deadTree:"Мёртвое дерево. Кора напоминает высохшую кожу.",candelabra:"Свечи зажжены недавно, но в замке никто не должен жить.",chandelier:"Люстра медленно качается, хотя ветра здесь нет.",banner:"Герб Вальдоры почти полностью пропитан кровью.",barrel:"Старые винные бочки. Из щелей пахнет железом.",bookPile:"Книги раскрыты на описаниях болезни Адриана.",gargoyle:"Гаргулья смотрит не на арену, а прямо на Ардена.",brokenSpire:"Молния расколола шпиль изнутри.",fern:"Листья поворачиваются вслед за Арденом.",mushroom:"Бледные грибы растут из чего-то похожего на кость.",stump:"На срезе дерева видны кольца, похожие на отпечатки пальцев.",roots:"Корни едва заметно пульсируют под землёй.",algae:"Водоросли обвивают затонувшие человеческие волосы.",reeds:"В камыше кто-то дышит в такт Ардену.",sunkenCross:"Крест установлен вверх ногами не водой, а чьими-то руками.",statue:"Каменное лицо кажется знакомым.",column:"В трещине колонны видна влажная человеческая кожа.",rubble:"Под обломками шевелятся каменные пальцы.",timber:"Крепь покрыта царапинами с внутренней стороны.",crystal:"В глубине кристалла застыло человеческое лицо.",ore:"Багровая руда тёплая и пульсирует.",marbleColumn:"Под белым мрамором проступают тонкие вены.",angelStatue:"У статуи настоящие зубы.",fountain:"Вода пахнет кровью, хотя остаётся прозрачной."
  };
  const zoneDecorSets=[
    [["deadTree","carriage","candelabra"],["chandelier","banner","candelabra"],["chandelier","bookPile","candelabra"],["banner","candelabra","bookPile"],["bookPile","candelabra","rubble"],["barrel","barrel","candelabra"],["banner","candelabra","rubble"],["gargoyle","brokenSpire","gargoyle"]],
    [["roots","stump","fern"],["reeds","roots","stump"],["totem","skullPile","totem"],["deadTree","roots","fern"],["roots","roots","mushroom"],["ancientTree","roots","mushroom"],["ancientTree","totem","roots"]],
    [["sunkenCross","reeds","algae"],["reeds","sunkenCross","algae"],["timber","chain","algae"],["chain","timber","reeds"],["statue","sunkenCross","algae"],["pew","sunkenCross","candelabra"],["bell","rubble","sunkenCross"],["sunkenCross","algae","rubble"],["sunkenCross","reeds","algae"]],
    [["statue","column","rubble"],["statue","statue","column"],["statue","statue","banner"],["statue","column","rubble"],["marketStall","statue","rubble"],["statue","column","pew"],["unfinishedStatue","statue","rubble"],["statue","deadTree","column"],["coffin","statue","rubble"],["throne","column","statue"],["statue","rubble","column"]],
    [["timber","rubble","ore"],["timber","chain","rubble"],["timber","ore","ore"],["barrel","timber","ore"],["crystal","crystal","ore"],["conveyor","ore","timber"],["timber","ore","chain"],["timber","conveyor","ore"],["heartMass","crystal","ore"],["throne","crystal","ore"],["crystal","heartMass","ore"]],
    [["marbleColumn","angelStatue","fountain"],["statue","marbleColumn","fountain"],["angelStatue","deadTree","fountain"],["bookPile","marbleColumn","angelStatue"],["telescope","marbleColumn","fountain"],["marbleColumn","angelStatue","rubble"],["pew","angelStatue","marbleColumn"],["relicPedestal","relicPedestal","marbleColumn"],["throne","marbleColumn","angelStatue"],["throne","angelStatue","fountain"]]
  ];

  const storyIntro = {
    kicker: "ПРОЛОГ · АРДЕН",
    title: "ПИСЬМО ИЗ ТУМАНА",
    lines: [
      "Полгода назад отец Ардена исчез во время экспедиции в руины Астериона.",
      "Сегодня пришла посылка: карта, компас и записка без подписи.",
      "«Не верь той, что на небесах.»",
      "Арден отправляется на поиски отца."
    ]
  };

  const keys = Object.create(null);
  let mode = "title";
  let chapterIndex = 0;
  let zoneIndex = 0;
  let inHub = false;
  let pendingChapter = 0;
  let pendingZone = 0;
  let map = [];
  let cells = [];
  let entities = [];
  let notes = [];
  let boss = null;
  let miniBoss = null;
  let relic = null;
  let zoneExit = null;
  let player = null;
  let lastTime = performance.now();
  let attackCooldown = 0;
  let attackAnim = 0;
  let messageUntil = 0;
  let interactionHint = "";
  let gameStartedAt = Date.now();
  let ambientAt = 0;
  let audio = null;
  let ambientNodes=[];
  let ambientTheme=-99;
  let mouseTurn = 0;
  let finalShotReady = false;
  let lastAutosaveAt = 0;
  let stats = { kills: 0, notes: 0, deaths: 0 };
  let campaign = { weapons:["spear"], ammo:{bolt:5,arrow:0,bullet:0}, relics:[], journal:[], silver:0, currentWeapon:"spear",difficulty:"normal" };
  const zBuffer = new Float32Array(canvas.width);

  function showScreen(id) {
    screens.forEach((screen) => screen.classList.toggle("active", screen.id === id));
  }

  function hideScreens() { screens.forEach((screen) => screen.classList.remove("active")); }

  function initAudio() {
    if (audio) {if(audio.state==="suspended")audio.resume?.();return;}
    try { audio = new (window.AudioContext || window.webkitAudioContext)(); }
    catch { audio = null; }
  }

  function sound(kind, strength = 1) {
    if (!audio) return;
    const now = audio.currentTime;
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    const filter = audio.createBiquadFilter();
    const table = {
      attack: [72, "sawtooth", .09, .035], hit: [48, "square", .13, .055],
      hurt: [36, "sawtooth", .24, .07], note: [220, "sine", .65, .045],
      relic: [110, "sine", 1.4, .06], step: [32, "triangle", .05, .015],
      shot: [42, "sawtooth", .7, .22], death: [46, "sine", 1.4, .08],
      reload: [96, "square", .28, .028], bow: [165, "triangle", .22, .035], whisper: [72, "sawtooth", 1.1, .018], bell:[116,"sine",2.4,.035],
      ambient: [55 + Math.random() * 28, "sine", 1.8, .012]
    };
    const [freq, type, duration, volume] = table[kind] || table.ambient;
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(18, freq * .45), now + duration);
    filter.type = "lowpass";
    filter.frequency.value = kind === "shot" ? 900 : 360;
    gain.gain.setValueAtTime(volume * strength, now);
    gain.gain.exponentialRampToValueAtTime(.0001, now + duration);
    osc.connect(filter).connect(gain).connect(audio.destination);
    osc.start(now); osc.stop(now + duration + .02);
  }

  function stopAmbientSound(){for(const node of ambientNodes){try{node.stop?.();node.disconnect?.();}catch{}}ambientNodes=[];ambientTheme=-99;}

  function startAmbientSound(theme=chapterIndex){
    if(!audio)return;if(ambientTheme===theme&&ambientNodes.length)return;stopAmbientSound();ambientTheme=theme;
    const freqs=[43,34,51,29,24,71,38],filters=[520,330,720,260,180,1100,410],volumes=[.026,.022,.03,.018,.026,.02,.022];
    const master=audio.createGain();master.gain.value=volumes[theme]??.02;master.connect(audio.destination);
    const noiseBuffer=audio.createBuffer(1,audio.sampleRate*3,audio.sampleRate),data=noiseBuffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*(.45+Math.sin(i*.0007)*.15);
    const noise=audio.createBufferSource();noise.buffer=noiseBuffer;noise.loop=true;const filter=audio.createBiquadFilter();filter.type=theme===2?"bandpass":"lowpass";filter.frequency.value=filters[theme]??400;filter.Q.value=theme===2?5:1.4;noise.connect(filter).connect(master);noise.start();
    const drone=audio.createOscillator(),droneGain=audio.createGain();drone.type=theme===5?"sine":"sawtooth";drone.frequency.value=freqs[theme]??40;droneGain.gain.value=.28;drone.connect(droneGain).connect(master);drone.start();
    const upper=audio.createOscillator(),upperGain=audio.createGain();upper.type="sine";upper.frequency.value=(freqs[theme]??40)*1.503;upper.detune.value=-17;upperGain.gain.value=.14;upper.connect(upperGain).connect(master);upper.start();
    const lfo=audio.createOscillator(),lfoGain=audio.createGain();lfo.frequency.value=theme===4?.19:.08;lfoGain.gain.value=.12;lfo.connect(lfoGain).connect(droneGain.gain);lfo.start();ambientNodes=[noise,filter,drone,droneGain,upper,upperGain,lfo,lfoGain,master];
  }

  function rngFactory(seed) {
    let t = seed >>> 0;
    return () => {
      t += 0x6D2B79F5;
      let r = Math.imul(t ^ (t >>> 15), 1 | t);
      r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }

  function generateMaze(seed, style = 0) {
    const size = 21;
    const grid = Array.from({ length: size }, () => Array(size).fill(1));
    const random = rngFactory(seed);
    const stack = [[1, 1]];
    grid[1][1] = 0;
    while (stack.length) {
      const [cx, cy] = stack[stack.length - 1];
      const dirs = [[2,0],[-2,0],[0,2],[0,-2]].sort(() => random() - .5);
      const options = dirs.filter(([dx,dy]) => {
        const nx = cx + dx, ny = cy + dy;
        return nx > 0 && ny > 0 && nx < size - 1 && ny < size - 1 && grid[ny][nx] === 1;
      });
      if (!options.length) { stack.pop(); continue; }
      const [dx, dy] = options[0];
      grid[cy + dy / 2][cx + dx / 2] = 0;
      grid[cy + dy][cx + dx] = 0;
      stack.push([cx + dx, cy + dy]);
    }
    // Each region gets a different spatial rhythm: rooms, clearings, plazas or tunnels.
    const roomCount=[8,1,6,7,2,9,5][style]??5;
    for (let room = 0; room < roomCount; room++) {
      const rx = 2 + Math.floor(random() * 15), ry = 2 + Math.floor(random() * 15);
      const span=style===5?4:3;
      for (let y = ry; y < Math.min(size - 1, ry + span); y++) {
        for (let x = rx; x < Math.min(size - 1, rx + span); x++) grid[y][x] = 0;
      }
    }
    if(style===1){
      for(let y=2;y<size-2;y++)for(let x=2;x<size-2;x++)if(grid[y][x]&&random()<.035)grid[y][x]=0;
    }else if(style===2){
      for(const y of [5,11,15])for(let x=1;x<size-1;x++)grid[y][x]=0;
    }else if(style===3){
      for(let y=7;y<=13;y++)for(let x=7;x<=13;x++)grid[y][x]=0;
      for(let i=1;i<size-1;i++){grid[10][i]=0;grid[i][10]=0;}
    }else if(style===5){
      for(let i=1;i<size-1;i++){grid[5][i]=0;grid[15][i]=0;grid[i][10]=0;}
    }else if(style===6){
      for(let i=1;i<size-1;i++){grid[10][i]=0;grid[i][10]=0;}
    }
    return grid;
  }

  function applyZoneLayout(grid, chapter, zone) {
    const size=grid.length, variant=zone%5;
    const carve=(x1,y1,x2,y2)=>{for(let y=Math.max(1,y1);y<=Math.min(size-2,y2);y++)for(let x=Math.max(1,x1);x<=Math.min(size-2,x2);x++)grid[y][x]=0;};
    if(variant===0){carve(2,8,18,12);carve(8,2,12,18);}
    else if(variant===1){carve(3,3,8,8);carve(12,12,17,17);carve(7,7,13,13);}
    else if(variant===2){carve(4,4,16,6);carve(4,14,16,16);carve(9,5,11,15);}
    else if(variant===3){carve(3,7,8,13);carve(12,7,17,13);carve(7,9,13,11);}
    else {carve(5,5,15,15);for(let i=5;i<=15;i++){if(i>7&&i<13)continue;grid[5][i]=1;grid[15][i]=1;grid[i][5]=1;grid[i][15]=1;}carve(9,1,11,19);}
    if(chapter===1){ // In the forest every remaining wall is rendered as a dense mass of trunks, never masonry.
      for(let y=2;y<size-2;y++)for(let x=2;x<size-2;x++)if(grid[y][x]===1&&(x+y+zone)%7===0)grid[y][x]=0;
    }
    return grid;
  }

  function getReachableCells(grid) {
    const queue = [[1, 1, 0]];
    const seen = new Set(["1,1"]);
    const result = [];
    while (queue.length) {
      const [x, y, d] = queue.shift();
      result.push({ x: x + .5, y: y + .5, d });
      for (const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
        const nx = x + dx, ny = y + dy, key = `${nx},${ny}`;
        if (grid[ny]?.[nx] === 0 && !seen.has(key)) {
          seen.add(key); queue.push([nx, ny, d + 1]);
        }
      }
    }
    return result.sort((a,b) => a.d - b.d);
  }

  function isWall(x, y) {
    return map[Math.floor(y)]?.[Math.floor(x)] !== 0;
  }

  function canStand(x, y, radius = .2) {
    return !isWall(x-radius,y-radius) && !isWall(x+radius,y-radius) &&
      !isWall(x-radius,y+radius) && !isWall(x+radius,y+radius);
  }

  function lineOfSight(ax, ay, bx, by) {
    const dist = Math.hypot(bx - ax, by - ay);
    const steps = Math.ceil(dist / .12);
    for (let i = 1; i < steps; i++) {
      const t = i / steps;
      if (isWall(ax + (bx-ax)*t, ay + (by-ay)*t)) return false;
    }
    return true;
  }

  function startChapter(index, startAtZone = 0) {
    inHub=false;
    chapterIndex = Math.max(0, Math.min(chapters.length - 1, index));
    zoneIndex = Math.max(0, startAtZone|0);
    const c = chapters[chapterIndex];
    player = {
      x:1.5,y:1.5,a:0,hp:100,stamina:100,herbs:campaign.herbs ?? 1,
      evidence:0,step:0,hurtCooldown:0,bob:0,reloadUntil:0,lastAttackHeavy:false,attackSide:0
    };
    if(!campaign.weapons.length) campaign.weapons=["spear"];
    campaign.ammo=campaign.ammo||{bolt:5,arrow:0,bullet:0};
    campaign.relics=campaign.relics||[];
    campaign.journal=campaign.journal||[];
    campaign.silver=campaign.silver||0;
    campaign.difficulty=campaign.difficulty||selectedDifficulty;
    campaign.armor=campaign.armor||0;
    if(!campaign.weapons.includes(campaign.currentWeapon)) campaign.currentWeapon=campaign.weapons[0];
    startZone(zoneIndex, false);
  }

  function startZone(index, preservePlayer = true) {
    inHub=false;
    zoneIndex=Math.max(0,index|0);
    const c=chapters[chapterIndex];
    const old=player;
    map = applyZoneLayout(generateMaze(c.seed + zoneIndex*137,chapterIndex),chapterIndex,zoneIndex);
    if(chapterIndex===0&&zoneIndex===7)for(let y=1;y<map.length-1;y++)for(let x=1;x<map[y].length-1;x++)map[y][x]=0;
    cells = getReachableCells(map);
    const random = rngFactory(c.seed + zoneIndex*211 + 99);
    const far = cells[cells.length - 1];
    player={
      x:1.5,y:1.5,a:0,hp:preservePlayer?old.hp:old?.hp??100,stamina:100,
      herbs:preservePlayer?old.herbs:old?.herbs??2,evidence:old?.evidence??0,
      step:0,hurtCooldown:0,bob:0,reloadUntil:0,lastAttackHeavy:false,attackSide:0
    };
    notes=[];
    const noteSlot=zoneIndex===1?0:zoneIndex===c.zones.length-2?1:-1;
    if(noteSlot>=0){
      const spot=cells[Math.floor(cells.length*.52)];
      const entry=c.notes[noteSlot];
      notes.push({type:"note",x:spot.x,y:spot.y,title:entry[0],text:entry[1],picked:false});
    }
    entities = [];
    const candidates = cells.filter((cell) => cell.d > 8 && cell.d < far.d - 3);
    const isFinal=zoneIndex===c.zones.length-1;
    const isMini=zoneIndex===c.miniBossAt;
    const enemyCount=Math.min(30,14+chapterIndex*3+Math.floor(zoneIndex/2));
    const spawnPool=candidates.length?candidates:cells.filter(cell=>cell.d>2);
    for (let i = 0; i < enemyCount; i++) {
      const spot = spawnPool[Math.floor(random() * spawnPool.length)] || cells[(3+i)%Math.max(1,cells.length)] || {x:2.5,y:2.5};
      entities.push(makeEnemy(spot.x + (random()-.5)*.25, spot.y + (random()-.5)*.25, false,false,i%c.enemyTypes.length));
    }
    boss=null;miniBoss=null;zoneExit=null;
    if(isFinal){boss=makeEnemy(far.x,far.y,true,false);entities.push(boss);}
    else if(isMini){miniBoss=makeEnemy(far.x,far.y,true,true);boss=miniBoss;entities.push(miniBoss);}
    else zoneExit={type:"exit",x:far.x,y:far.y,picked:false};
    relic = null;
    for (let i = 0; i < (zoneIndex%6===0?1:0); i++) {
      const spot = candidates[Math.floor(random() * candidates.length)];
      if (spot) entities.push({ type: "herb", x: spot.x, y: spot.y, picked: false });
    }
    for (let i = 0; i < 2; i++) {
      const spot = candidates[Math.floor(random() * candidates.length)];
      if (spot) entities.push({ type: "ghost", x: spot.x, y: spot.y, alpha: .2 + random()*.2 });
    }
    const decorKinds=zoneDecorSets[chapterIndex]?.[zoneIndex]||["rubble","column","candelabra"];
    const decorCount=chapterIndex===1?42:22;
    for(let i=0;i<decorCount;i++){
      const spot=candidates[Math.floor(random()*candidates.length)];
      if(spot)entities.push({type:"decor",kind:decorKinds[i%decorKinds.length],x:spot.x+(random()-.5)*.22,y:spot.y+(random()-.5)*.22,picked:false,sway:random()*8});
    }
    const unlockId=c.unlocks[zoneIndex];
    if(unlockId){
      const spot=cells[Math.floor(cells.length*.34)];
      if(!campaign.weapons.includes(unlockId)) entities.push({type:"weapon",weaponId:unlockId,x:spot.x,y:spot.y,picked:false});
      else addAmmoPickup(spot.x,spot.y,unlockId);
    }
    const ammoSpot=candidates[Math.floor(random()*candidates.length)];
    if(ammoSpot){
      const ranged=chapterIndex===0?"crossbow":chapterIndex>=1?"bow":null;
      if(ranged) addAmmoPickup(ammoSpot.x,ammoSpot.y,ranged);
    }
    const silverSpot=candidates[Math.floor(random()*candidates.length)];
    if(silverSpot)entities.push({type:"silver",x:silverSpot.x,y:silverSpot.y,amount:5+chapterIndex*2,picked:false});

    finalShotReady = false;
    attackCooldown = 0;
    attackAnim = 0;
    mode = "playing";
    hideScreens();
    hud.classList.remove("hidden");
    ui.chapterKicker.textContent = `ГЛАВА ${c.roman} · ЗОНА ${zoneIndex+1}/${c.zones.length}`;
    ui.chapterName.textContent = c.zones[zoneIndex];
    updateWeaponHUD();
    ui.bossUI.classList.add("hidden");
    updateObjective();
    showMessage(`${c.zones[zoneIndex]} — ${zoneIndex===0?c.intro[0]:c.kicker}`, 3300);
    if(chapterIndex===0&&zoneIndex===0)setTimeout(()=>mode==="playing"&&showMessage("Подбираемый предмет всегда имеет свечение и подсказку «E — взять». Остальное можно осмотреть.",4200),3500);
    saveGame();
    lastTime = performance.now();
    ambientAt = performance.now() + 2500;
    startAmbientSound(chapterIndex);
  }

  function startHub(nextChapter){
    inHub=true;chapterIndex=Math.max(0,Math.min(chapters.length-1,nextChapter));zoneIndex=-1;
    campaign.weapons=campaign.weapons||["spear"];campaign.ammo=campaign.ammo||{bolt:5,arrow:0,bullet:0};campaign.relics=campaign.relics||[];campaign.journal=campaign.journal||[];campaign.silver=campaign.silver||0;campaign.currentWeapon=campaign.currentWeapon||"spear";campaign.armor=campaign.armor||0;
    const c=chapters[chapterIndex];map=generateMaze(9001+chapterIndex*97,6);cells=getReachableCells(map);
    const far=cells[cells.length-1];player={x:1.5,y:1.5,a:0,hp:100,stamina:100,herbs:campaign.herbs??1,evidence:0,step:0,hurtCooldown:0,bob:0,reloadUntil:0,lastAttackHeavy:false,attackSide:0};
    notes=[];entities=[];boss=null;miniBoss=null;relic=null;zoneExit={type:"exit",x:far.x,y:far.y,picked:false};
    const merchantSpot=cells[Math.min(cells.length-1,18)];if(merchantSpot)entities.push({type:"merchant",x:merchantSpot.x,y:merchantSpot.y,picked:false,name:"Странник"});
    campaign.relics.forEach((name,i)=>{const spot=cells[Math.floor(cells.length*(.22+Math.min(.55,i*.11)))];if(spot)entities.push({type:"relicDisplay",name,x:spot.x,y:spot.y,picked:false});});
    for(let i=0;i<4;i++){const spot=cells[Math.floor(cells.length*(.18+i*.16))];if(spot)entities.push({type:"ghost",x:spot.x,y:spot.y,alpha:.12});}
    mode="playing";hideScreens();hud.classList.remove("hidden");ui.chapterKicker.textContent="ХАБ · АСТЕРИОН";ui.chapterName.textContent="ПРОКЛЯТАЯ ДОЛИНА";ui.bossUI.classList.add("hidden");updateWeaponHUD();updateObjective();
    showMessage(`Реликвии лордов открывают путь: ${c.name}`,4200);saveGame();lastTime=performance.now();ambientAt=performance.now()+1800;
    startAmbientSound(6);
  }

  function addAmmoPickup(x,y,weaponId){
    const weapon=weapons[weaponId];
    if(!weapon?.ammo)return;
    entities.push({type:"ammo",ammoType:weapon.ammo,amount:weapon.ammo==="bolt"?5:weapon.ammo==="arrow"?10:1,x,y,picked:false});
  }

  function makeEnemy(x, y, isBoss, isMini=false, variant=0) {
    const c = chapters[chapterIndex];
    const difficulty=difficultyPresets[campaign.difficulty]||difficultyPresets.normal;
    const archetype=c.enemyTypes[variant%c.enemyTypes.length];
    const baseHp=1200+chapterIndex*350+Math.max(0,zoneIndex)*75;
    const maxHp = isBoss ? Math.round(c.bossHp*(isMini?12:24)*difficulty.bossHp) : Math.round(baseHp*archetype.hp*difficulty.enemyHp);
    return {
      type: "enemy", x, y, boss: isBoss, mini:isMini, variant,isBoss,shape:isBoss?(chapterIndex===5?"angel":"boss"):archetype.shape,name:isBoss?(isMini?c.miniBoss:c.boss):archetype.name, hp: maxHp, maxHp,
      speed: isBoss ? .52 + chapterIndex*.025 : (.62 + chapterIndex*.025)*archetype.speed,
      damage: Math.round((isBoss ? 14 + chapterIndex*2 : (7 + chapterIndex)*archetype.damage)*difficulty.enemyDamage),
      alive: true, active:true, attackAt: 0, hitAt: 0, phaseSpawned: false, sway: Math.random()*9
    };
  }

  function showStory(index) {
    pendingChapter = Math.max(0, index);
    mode = "story";
    hud.classList.add("hidden");
    showScreen("story-screen");
    const data = index < 0 ? storyIntro : {
      kicker: `ГЛАВА ${chapters[index].roman} · ${chapters[index].kicker}`,
      title: chapters[index].name,
      lines: chapters[index].intro
    };
    $("#story-kicker").textContent = data.kicker;
    $("#story-title").textContent = data.title;
    $("#story-body").innerHTML = data.lines.map((line, i) =>
      `<p class="${line.includes("«") || i === data.lines.length - 1 ? "quote" : ""}">${line}</p>`
    ).join("");
    $("#story-continue").textContent = index < 0 ? "ОТПРАВИТЬСЯ В АСТЕРИОН" : "ВОЙТИ В ТУМАН";
  }

  function captureRuntime(){
    if(!player||["title","story","dead","ending"].includes(mode))return null;
    return{
      player:{x:player.x,y:player.y,a:player.a,hp:player.hp,stamina:player.stamina,herbs:player.herbs,evidence:player.evidence,step:0,hurtCooldown:0,bob:player.bob,reloadUntil:0,lastAttackHeavy:false,attackSide:0},
      entities,notes,relic,zoneExit,finalShotReady
    };
  }

  function saveGame() {
    if(player)campaign.herbs=player.herbs;
    try{
      const runtime=captureRuntime();
      if(!runtime)return;
      const payload={version:SAVE_VERSION,chapter:chapterIndex,zone:inHub?0:zoneIndex,hub:inHub,campaign,stats,started:gameStartedAt,savedAt:Date.now(),runtime};
      localStorage.setItem("asterion-save",JSON.stringify(payload));
      $("#continue-game").classList.remove("hidden");
    }catch(error){console.warn("Asterion save failed",error);}
  }

  function loadSave() {
    try { return JSON.parse(localStorage.getItem("asterion-save")); }
    catch { return null; }
  }

  function clearSave() {
    localStorage.removeItem("asterion-save");
    $("#continue-game").classList.add("hidden");
  }

  function restoreRuntime(runtime){
    if(!runtime||!player)return;
    if(runtime.player){Object.assign(player,runtime.player);player.hp=Math.max(1,player.hp||1);player.stamina=Math.max(0,player.stamina??100);}
    if(Array.isArray(runtime.entities))entities=runtime.entities;
    if(Array.isArray(runtime.notes))notes=runtime.notes;
    relic=runtime.relic||null;zoneExit=runtime.zoneExit||null;finalShotReady=!!runtime.finalShotReady;
    boss=entities.find(e=>e.type==="enemy"&&e.boss&&!e.mini)||entities.find(e=>e.type==="enemy"&&e.boss)||null;
    miniBoss=entities.find(e=>e.type==="enemy"&&e.boss&&e.mini)||null;
    mode="playing";hideScreens();hud.classList.remove("hidden");updateWeaponHUD();updateObjective();ui.bossUI.classList.add("hidden");lastTime=performance.now();lastAutosaveAt=performance.now();
    showMessage("Прогресс восстановлен.",1800);
  }

  function migrateLegacyRuntime(runtime){
    if(!runtime?.player||!player)return;
    const old=runtime.player;
    player.a=Number.isFinite(old.a)?old.a:player.a;
    player.hp=Math.max(1,old.hp||100);
    player.herbs=Math.max(0,old.herbs??campaign.herbs??1);
    player.evidence=old.evidence||0;
    if(Number.isFinite(old.x)&&Number.isFinite(old.y)&&canStand(old.x,old.y)){player.x=old.x;player.y=old.y;}
    campaign.herbs=player.herbs;
    updateWeaponHUD();updateObjective();
    showMessage("Локация обновлена: новые враги, окружение и баланс применены.",3600);
    saveGame();
  }

  function showMessage(text, duration = 2200) {
    ui.message.textContent = text;
    ui.message.classList.add("show");
    messageUntil = performance.now() + duration;
  }

  function updateObjective() {
    if (!player) return;
    const c = chapters[chapterIndex];
    if(inHub)ui.objective.textContent=`Откройте дорогу: ${c.name}`;
    else if (chapterIndex === 5 && finalShotReady) ui.objective.textContent = "Выберите Последний Довод (9) и стреляйте";
    else if (boss?.alive) ui.objective.textContent = `Победите: ${boss.name}`;
    else if (relic) ui.objective.textContent = `Заберите реликвию: ${c.relic}`;
    else if (zoneExit) ui.objective.textContent = `Найдите путь дальше: ${zoneIndex+1}/${c.zones.length}`;
    else ui.objective.textContent = "Исследуйте зону";
  }

  function updateWeaponHUD(){
    const weapon=weapons[campaign.currentWeapon]||weapons.spear;
    ui.weapon.textContent=weapon.name;
    const reloading=player?.reloadUntil>performance.now()?" · ПЕРЕЗАРЯДКА":"";
    const ammo=weapon.ammo?`${weapon.ammoName} ${campaign.ammo[weapon.ammo]||0}${reloading}`:"ЛКМ БЫСТРО · ПКМ СИЛЬНО";
    ui.ammo.textContent=`${ammo} · ТРАВЫ ${player?.herbs??0} · СЕРЕБРО ${campaign.silver}`;
  }

  function selectWeapon(slot){
    const id=weaponOrder[slot];
    if(!id||!campaign.weapons.includes(id))return;
    campaign.currentWeapon=id;updateWeaponHUD();showMessage(weapons[id].name,1200);saveGame();
  }

  function updateDifficultyButton(){const button=$("#difficulty-button");if(button)button.textContent=`СЛОЖНОСТЬ: ${difficultyPresets[selectedDifficulty].name}`;}

  function safeDropPosition(x,y){
    if(canStand(x,y,.16))return{x,y};
    let best=null,bestDist=Infinity;
    for(const cell of cells){const dist=Math.hypot(cell.x-x,cell.y-y);if(dist<bestDist&&canStand(cell.x,cell.y,.16)){best=cell;bestDist=dist;}}
    return best?{x:best.x,y:best.y}:{x:player.x,y:player.y};
  }

  function collectRelic(){
    if(!relic||relic.picked||mode!=="playing")return false;
    relic.picked=true;sound("relic");completeChapter();return true;
  }

  function interact() {
    if (mode !== "playing") return;
    let nearest = null, nearestDist = Infinity;
    for (const item of [...notes, ...entities, ...(zoneExit?[zoneExit]:[]), ...(relic ? [relic] : [])]) {
      if (item.picked || item.alive === false || item.type==="enemy" || item.type==="ghost" || item.type==="relicDisplay" || item.type==="corpse" || item.type==="projectile") continue;
      const d = Math.hypot(item.x - player.x, item.y - player.y);
      const reach=item.type==="relic"?2.25:item.type==="exit"?1.8:item.type==="decor"||item.type==="merchant"?1.65:1.4;
      const score=d+(item.type==="decor" ? .55 : 0);
      if (d < reach&&score < nearestDist) { nearest = item; nearestDist = score; }
    }
    if (!nearest) return;
    if (nearest.type === "note") {
      nearest.picked = true;
      player.evidence++;
      stats.notes++;
      campaign.journal.push({title:nearest.title,text:nearest.text,chapter:chapters[chapterIndex].name});
      sound("note");
      showMessage(`${nearest.title}: «${nearest.text}»`, 6500);
      updateObjective();
    } else if (nearest.type === "herb") {
      nearest.picked = true;
      player.herbs++;
      sound("note", .5);
      showMessage("Найдена лечебная трава.");
    } else if (nearest.type === "relic") {
      collectRelic();
    } else if(nearest.type==="exit"){
      nearest.picked=true;sound("relic",.45);
      if(inHub){pendingZone=0;showStory(chapterIndex);}else startZone(zoneIndex+1,true);
    } else if(nearest.type==="weapon"){
      nearest.picked=true;
      if(!campaign.weapons.includes(nearest.weaponId))campaign.weapons.push(nearest.weaponId);
      campaign.currentWeapon=nearest.weaponId;
      if(nearest.weaponId==="crossbow")campaign.ammo.bolt+=15;
      if(nearest.weaponId==="bow")campaign.ammo.arrow+=20;
      if(nearest.weaponId==="revolver")campaign.ammo.bullet=10;
      sound("relic");showMessage(`Новое оружие: ${weapons[nearest.weaponId].name}`,3500);updateWeaponHUD();saveGame();
    } else if(nearest.type==="ammo"){
      nearest.picked=true;campaign.ammo[nearest.ammoType]=(campaign.ammo[nearest.ammoType]||0)+nearest.amount;
      sound("note",.5);showMessage(`Боеприпасы: +${nearest.amount}`);updateWeaponHUD();
    } else if(nearest.type==="silver"){
      nearest.picked=true;campaign.silver+=nearest.amount;sound("note",.4);showMessage(`Серебро: +${nearest.amount}`);updateWeaponHUD();
    } else if(nearest.type==="decor"){
      showMessage(decorDescriptions[nearest.kind]||"Это часть окружения. Здесь нечего брать.",3600);
    } else if(nearest.type==="merchant"){
      openShop();
    }
    if(mode==="playing")saveGame();
  }

  function useHerb() {
    if (mode !== "playing" || player.herbs < 1 || player.hp >= 100) return;
    player.herbs--;
    player.hp = Math.min(100, player.hp + 48);
    sound("note", .7);
    showMessage("Горькая трава останавливает кровь.");
    updateWeaponHUD();
    saveGame();
  }

  function attack(heavy=false) {
    if (mode !== "playing" || attackCooldown > 0) return;
    const weaponId=campaign.currentWeapon;
    const weapon=weapons[weaponId]||weapons.spear;
    const now=performance.now();
    if(weapon.reload&&player.reloadUntil>now){showMessage("Оружие ещё перезаряжается.",700);return;}
    if(weapon.ammo){
      const available=campaign.ammo[weapon.ammo]||0;
      if(available<=0){showMessage(`${weapon.ammoName}: нет боеприпасов`);return;}
      if(weaponId==="revolver"&&chapterIndex<5&&available<=1){showMessage("Последний патрон нельзя тратить впустую.");return;}
      campaign.ammo[weapon.ammo]--;
      player.reloadUntil=now+weapon.reload*1000;
      attackCooldown=weapon.cooldown;
      attackAnim=1;player.lastAttackHeavy=false;
      entities.push({type:"projectile",projectileType:weaponId,weaponId,x:player.x+Math.cos(player.a)*.35,y:player.y+Math.sin(player.a)*.35,a:player.a,speed:weapon.projectileSpeed,damage:weapon.damage,range:weapon.range,traveled:0,picked:false});
      sound(weaponId==="revolver"?"shot":weaponId==="bow"?"bow":"attack",weaponId==="revolver"?1.2:.9);if(weaponId==="crossbow")setTimeout(()=>sound("reload",.8),220);updateWeaponHUD();saveGame();return;
    }
    player.lastAttackHeavy=!!heavy;player.attackSide=player.attackSide?0:1;
    attackCooldown = weapon.cooldown*(heavy?2.35:1);
    attackAnim = 1;
    sound("attack",heavy?1.3:.8);
    updateWeaponHUD();
    let target = null, best = weapon.range;
    for (const enemy of entities) {
      if (enemy.type !== "enemy" || !enemy.alive) continue;
      const dist = Math.hypot(enemy.x-player.x, enemy.y-player.y);
      const angle = Math.abs(normalizeAngle(Math.atan2(enemy.y-player.y, enemy.x-player.x)-player.a));
      if (dist < best && angle < .14 + .11 / Math.max(.5, dist) && lineOfSight(player.x,player.y,enemy.x,enemy.y)) {
        target = enemy; best = dist;
      }
    }
    if (!target) return;
    if (target.boss && !target.active) {
      showMessage("Нечто удерживает оружие. Сначала нужно понять это место.");
      return;
    }
    let damage = weapon.damage*(heavy?2.05:1)*(.88+Math.random()*.24);
    target.hp -= damage;
    target.hitAt = performance.now();
    target.active = true;
    sound("hit");
    if(chapterIndex===5&&target===boss&&target.hp/target.maxHp<=.1){
      target.hp=Math.max(1,target.hp);finalShotReady=true;
      showMessage("Ядро Сердца открыто. Нужен Последний Довод — клавиша 9.",4400);updateObjective();return;
    }
    if (target.hp <= 0) killEnemy(target);
  }

  function updateProjectile(projectile,dt){
    if(projectile.picked)return;
    const step=projectile.speed*dt;projectile.x+=Math.cos(projectile.a)*step;projectile.y+=Math.sin(projectile.a)*step;projectile.traveled+=step;
    if(isWall(projectile.x,projectile.y)||projectile.traveled>projectile.range){projectile.picked=true;return;}
    for(const enemy of entities){
      if(enemy.type!=="enemy"||!enemy.alive)continue;
      if(Math.hypot(enemy.x-projectile.x,enemy.y-projectile.y)>.42)continue;
      projectile.picked=true;enemy.hitAt=performance.now();enemy.active=true;
      if(chapterIndex===5&&enemy===boss&&finalShotReady&&projectile.weaponId==="revolver"){setTimeout(()=>{if(boss?.alive){boss.hp=0;killEnemy(boss);}},260);sound("shot",1.4);return;}
      enemy.hp-=projectile.damage*(.9+Math.random()*.2);sound("hit");
      if(chapterIndex===5&&enemy===boss&&enemy.hp/enemy.maxHp<=.1){enemy.hp=Math.max(1,enemy.hp);finalShotReady=true;showMessage("Ядро Сердца открыто. Нужен Последний Довод — клавиша 9.",4400);updateObjective();}
      else if(enemy.hp<=0)killEnemy(enemy);
      return;
    }
  }

  function lastArgument() {
    if (mode !== "playing" || chapterIndex !== 5 || campaign.currentWeapon!=="revolver" || !boss?.alive || !finalShotReady) return;
    finalShotReady = false;
    attackAnim = 1.8;
    sound("shot");
    showMessage("Последний Довод.", 2400);
    setTimeout(() => {
      if (mode !== "playing") return;
      boss.hp = 0;
      killEnemy(boss);
    }, 620);
  }

  function killEnemy(enemy) {
    enemy.alive = false;
    if(!enemy.boss)entities.push({type:"corpse",shape:enemy.shape,name:enemy.name,x:enemy.x,y:enemy.y,picked:false,born:performance.now()});
    stats.kills++;
    sound(enemy.boss ? "death" : "hit", enemy.boss ? 1.3 : .65);
    if (enemy.boss) {
      ui.bossUI.classList.add("hidden");
      if(enemy.mini){
        showMessage(`${enemy.name} повержен. Путь дальше открыт.`,4200);
        zoneExit={type:"exit",x:enemy.x,y:enemy.y,picked:false};
      }else{
        showMessage(chapters[chapterIndex].victory, 5000);
        const drop=safeDropPosition(enemy.x,enemy.y);
        relic = { type: "relic", x: drop.x, y: drop.y, picked: false };
      }
      updateObjective();
    }
    saveGame();
  }

  function completeChapter() {
    const c = chapters[chapterIndex];
    if(!campaign.relics.includes(c.relic))campaign.relics.push(c.relic);
    campaign.silver += [100,75,100,125,150,0][chapterIndex];
    if (chapterIndex === chapters.length - 1) {
      mode = "ending";
      stopAmbientSound();
      hud.classList.add("hidden");
      clearSave();
      const minutes = Math.max(1, Math.round((Date.now() - gameStartedAt) / 60000));
      $("#ending-stats").textContent = `ВРАГОВ ПОВЕРЖЕНО: ${stats.kills} · ЗАПИСЕЙ НАЙДЕНО: ${stats.notes} · ВРЕМЯ: ${minutes} МИН.`;
      showScreen("ending-screen");
      return;
    }
    chapterIndex++;
    zoneIndex=0;pendingZone=0;
    startHub(chapterIndex);
  }

  function hurt(amount) {
    if (player.hurtCooldown > 0 || mode !== "playing") return;
    player.hp = Math.max(0, player.hp - amount*(1-(campaign.armor||0)));
    player.hurtCooldown = .48;
    ui.damage.classList.add("active");
    setTimeout(() => ui.damage.classList.remove("active"), 80);
    sound("hurt");
    if (player.hp <= 0) die();
  }

  function die() {
    stats.deaths++;
    mode = "dead";
    hud.classList.add("hidden");
    document.exitPointerLock?.();
    showScreen("death-screen");
  }

  function pauseGame() {
    if (mode !== "playing") return;
    mode = "paused";
    document.exitPointerLock?.();
    showScreen("pause-screen");
    saveGame();
  }

  function resumeGame() {
    if (mode !== "paused" && mode !== "journal") return;
    mode = "playing";
    hideScreens();
    hud.classList.remove("hidden");
    lastTime = performance.now();
  }

  function openJournal() {
    if (mode !== "playing") return;
    mode = "journal";
    document.exitPointerLock?.();
    const c = chapters[chapterIndex];
    $("#journal-title").textContent = `${c.name} · ГЛАВА ${c.roman}`;
    const found = notes.filter(n => n.picked);
    $("#journal-content").innerHTML = `
      <p>${c.kicker}</p>
      <p>Следы отца: ${found.length}/${notes.length}</p>
      ${campaign.journal.map(n => `<p><strong>${n.title}</strong> · ${n.chapter}<br>«${n.text}»</p>`).join("") || "<p>Записей пока нет.</p>"}
      <p class="relics">Реликвии: ${campaign.relics.join(" · ") || "—"}</p>
      <p>Оружие: ${campaign.weapons.map(id=>weapons[id].name).join(" · ")}</p>`;
    showScreen("journal-screen");
  }

  function refreshShop(){
    $("#shop-silver").textContent=`СЕРЕБРО: ${campaign.silver}`;
    const costs={herb:60,bolts:40,arrows:40,ward:180};
    document.querySelectorAll("[data-shop]").forEach(button=>{button.disabled=campaign.silver<costs[button.dataset.shop]||(button.dataset.shop==="ward"&&campaign.armor>=.25);});
  }

  function openShop(){mode="shop";document.exitPointerLock?.();hud.classList.add("hidden");refreshShop();showScreen("shop-screen");}
  function closeShop(){if(mode!=="shop")return;mode="playing";hideScreens();hud.classList.remove("hidden");lastTime=performance.now();saveGame();}
  function buyShopItem(id){
    const costs={herb:60,bolts:40,arrows:40,ward:180},cost=costs[id];if(!cost||campaign.silver<cost)return;campaign.silver-=cost;
    if(id==="herb")player.herbs++;else if(id==="bolts")campaign.ammo.bolt+=5;else if(id==="arrows")campaign.ammo.arrow+=10;else if(id==="ward")campaign.armor=Math.min(.25,(campaign.armor||0)+.05);
    sound("relic",.45);refreshShop();updateWeaponHUD();saveGame();
  }

  function update(dt, now) {
    if (mode !== "playing") return;
    const c = chapters[chapterIndex];
    attackCooldown = Math.max(0, attackCooldown - dt);
    attackAnim = Math.max(0, attackAnim - dt * 3.5);
    player.hurtCooldown = Math.max(0, player.hurtCooldown - dt);

    let turn = 0;
    if (keys.ArrowLeft) turn -= 1;
    if (keys.ArrowRight) turn += 1;
    player.a = normalizeAngle(player.a + turn * dt * 1.8 + mouseTurn);
    mouseTurn = 0;

    let forward = (keys.KeyW ? 1 : 0) - (keys.KeyS ? 1 : 0);
    let strafe = (keys.KeyD ? 1 : 0) - (keys.KeyA ? 1 : 0);
    const moving = forward || strafe;
    const sprinting = keys.ShiftLeft && forward > 0 && player.stamina > 2;
    const speed = sprinting ? 2.7 : 1.72;
    if (sprinting && moving) player.stamina = Math.max(0, player.stamina - dt * 28);
    else player.stamina = Math.min(100, player.stamina + dt * 15);
    if (moving) {
      const len = Math.hypot(forward, strafe) || 1;
      forward /= len; strafe /= len;
      const vx = (Math.cos(player.a)*forward + Math.cos(player.a+Math.PI/2)*strafe) * speed * dt;
      const vy = (Math.sin(player.a)*forward + Math.sin(player.a+Math.PI/2)*strafe) * speed * dt;
      if (canStand(player.x + vx, player.y)) player.x += vx;
      if (canStand(player.x, player.y + vy)) player.y += vy;
      player.bob += dt * (sprinting ? 13 : 8);
      player.step -= dt;
      if (player.step <= 0) { sound("step", sprinting ? 1 : .7); player.step = sprinting ? .28 : .43; }
    }

    for (const enemy of entities) updateEnemy(enemy, dt, now);
    for (const projectile of entities.filter(e=>e.type==="projectile")) updateProjectile(projectile,dt);

    if(relic&&!relic.picked&&Math.hypot(relic.x-player.x,relic.y-player.y)<.72){collectRelic();return;}

    // Ghosts vanish when examined, preserving the document's statue-or-enemy uncertainty.
    for (const ghost of entities.filter(e => e.type === "ghost")) {
      if (Math.hypot(ghost.x-player.x, ghost.y-player.y) < 1.7) ghost.picked = true;
    }

    interactionHint = "";
    for (const item of [...notes, ...entities, ...(zoneExit?[zoneExit]:[]), ...(relic ? [relic] : [])]) {
      if (item.picked || item.alive === false || item.type === "enemy" || item.type === "ghost" || item.type === "relicDisplay" || item.type === "corpse" || item.type === "projectile") continue;
      const hintReach=item.type==="relic"?2.25:item.type==="exit"?1.8:item.type==="decor"||item.type==="merchant"?1.65:1.4;
      if (Math.hypot(item.x-player.x,item.y-player.y) < hintReach) {
        interactionHint = item.type === "note" ? "E — прочитать" :
          item.type === "herb" ? "E — взять траву" :
          item.type === "exit" ? "E — перейти в следующую зону" :
          item.type === "weapon" ? `E — взять ${weapons[item.weaponId].name}` :
          item.type === "ammo" ? "E — взять боеприпасы" :
          item.type === "silver" ? "E — взять серебро" :
          item.type === "relic" ? `E — взять реликвию: ${chapters[chapterIndex].relic}` :
          item.type === "merchant" ? "E — поговорить с торговцем" :
          item.type === "decor" ? "E — осмотреть" : "E — взаимодействовать";
        break;
      }
    }
    if (now > messageUntil) {
      if (interactionHint) { ui.message.textContent = interactionHint; ui.message.classList.add("show"); }
      else ui.message.classList.remove("show");
    }

    if (now > ambientAt) {
      sound(chapterIndex===2?"bell":Math.random()<.45?"whisper":"ambient");
      ambientAt = now + 3500 + Math.random()*7000;
      if (Math.random() < .32 && player.evidence < notes.length) showMessage("В тумане кто-то шепчет имя Ардена.", 1800);
    }

    ui.health.style.width = `${player.hp}%`;
    ui.healthNumber.textContent = Math.ceil(player.hp);
    ui.stamina.style.width = `${player.stamina}%`;
    updateWeaponHUD();
    if (boss?.alive && boss.active && Math.hypot(boss.x-player.x,boss.y-player.y) < 8.5) {
      ui.bossUI.classList.remove("hidden");
      const ratio = boss.hp / boss.maxHp;
      ui.bossName.textContent = boss.mini?boss.name:c.phases[ratio > .66 ? 0 : ratio > .33 ? 1 : 2];
      ui.bossFill.style.width = `${Math.max(0, ratio*100)}%`;
    } else ui.bossUI.classList.add("hidden");
    if(now-lastAutosaveAt>3000){saveGame();lastAutosaveAt=now;}
  }

  function updateEnemy(enemy, dt, now) {
    if (enemy.type !== "enemy" || !enemy.alive || !enemy.active) return;
    const dx = player.x-enemy.x, dy = player.y-enemy.y;
    const dist = Math.hypot(dx,dy);
    if (dist > 9.5 && !enemy.boss) return;
    if (!lineOfSight(enemy.x,enemy.y,player.x,player.y) && dist > 2) return;
    if (dist > .66) {
      const speedBoost = enemy.boss && enemy.hp/enemy.maxHp < .34 ? 1.35 : 1;
      const vx = dx/dist * enemy.speed*speedBoost*dt;
      const vy = dy/dist * enemy.speed*speedBoost*dt;
      if (canStand(enemy.x+vx,enemy.y,.17)) enemy.x += vx;
      else enemy.x += Math.sign(vy) * enemy.speed * dt * .35;
      if (canStand(enemy.x,enemy.y+vy,.17)) enemy.y += vy;
      else enemy.y -= Math.sign(vx) * enemy.speed * dt * .35;
    } else if (now > enemy.attackAt) {
      enemy.attackAt = now + (enemy.boss ? 780 : 1100);
      hurt(enemy.damage);
    }
    if (enemy.boss && !enemy.phaseSpawned && enemy.hp/enemy.maxHp < .5) {
      enemy.phaseSpawned = true;
      for (let i=0;i<2;i++) {
        const angle = i*Math.PI;
        const x = enemy.x + Math.cos(angle)*.8, y = enemy.y + Math.sin(angle)*.8;
        if (canStand(x,y)) entities.push(makeEnemy(x,y,false));
      }
      showMessage(`${chapters[chapterIndex].phases[1]} пробуждает своих слуг.`, 2600);
    }
  }

  function normalizeAngle(a) {
    while (a > Math.PI) a -= Math.PI*2;
    while (a < -Math.PI) a += Math.PI*2;
    return a;
  }

  function color(rgb, factor = 1) {
    return `rgb(${Math.max(0,Math.min(255,rgb[0]*factor))|0},${Math.max(0,Math.min(255,rgb[1]*factor))|0},${Math.max(0,Math.min(255,rgb[2]*factor))|0})`;
  }

  function blend(a, b, amount) {
    const t = Math.max(0, Math.min(1, amount));
    return [a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t, a[2]+(b[2]-a[2])*t];
  }

  function rgba(rgb, alpha) {
    return `rgba(${rgb[0]|0},${rgb[1]|0},${rgb[2]|0},${alpha})`;
  }

  function render(now) {
    const w = canvas.width, h = canvas.height;
    if (!player || mode === "title" || mode === "story") {
      ctx.fillStyle = "#070706"; ctx.fillRect(0,0,w,h); return;
    }
    const baseChapter = chapters[chapterIndex];
    const moodTints=[[134,60,72],[54,121,63],[43,137,148],[127,119,135],[153,51,55],[219,183,91]];
    const zoneTints=[[195,74,62],[58,139,122],[178,126,61],[101,76,164],[151,166,83]];
    const zoneVariant=Math.max(0,zoneIndex)%5,pulse=.1+zoneVariant*.035;
    const mood=blend(moodTints[chapterIndex]||baseChapter.light,zoneTints[zoneVariant],.42);
    const c=inHub?baseChapter:{...baseChapter,
      sky:blend(baseChapter.sky,mood,.12+pulse),
      floor:blend(baseChapter.floor,mood,.08+pulse*.7),
      floorAlt:blend(baseChapter.floorAlt,mood,.14+pulse),
      fog:blend(baseChapter.fog,mood,.1+pulse*.6),
      light:blend(baseChapter.light,mood,.1+pulse)
    };
    const horizon = h/2 + Math.sin(player.bob)*1.8;
    let grad = ctx.createLinearGradient(0,0,0,horizon);
    grad.addColorStop(0,color(c.sky,.5));
    grad.addColorStop(.64,color(blend(c.sky,c.light,.16),.72));
    grad.addColorStop(1,color(c.fog,.96));
    ctx.fillStyle = grad; ctx.fillRect(0,0,w,horizon);

    // A soft colored glow gives every chapter its own light source.
    const glowX = w*(.67+Math.sin(chapterIndex*1.7)*.12);
    const skyGlow = ctx.createRadialGradient(glowX,horizon*.58,0,glowX,horizon*.58,w*.35);
    skyGlow.addColorStop(0,rgba(c.light,.22)); skyGlow.addColorStop(1,rgba(c.light,0));
    ctx.fillStyle=skyGlow;ctx.fillRect(0,0,w,horizon);

    // Perspective floor bands and converging seams add restrained 3D depth.
    for(let y=Math.ceil(horizon);y<h;y+=2){
      const p=(y-horizon)/(h-horizon);
      const worldBand=(Math.floor(1/(p+.035)*1.45+player.x*.7+player.y*.45)&1);
      const material=blend(c.floor,c.floorAlt,.2+p*.38+(worldBand?.12:0));
      const shade=.72-p*.32;
      ctx.fillStyle=color(material,shade);ctx.fillRect(0,y,w,2);
    }
    const vanishX=w/2-Math.sin(player.a)*w*.055;
    if(chapterIndex!==1&&chapterIndex!==2){
      ctx.strokeStyle=rgba(c.light,.12);ctx.lineWidth=1;
      for(let i=-9;i<=9;i++){
        ctx.beginPath();ctx.moveTo(vanishX+i*1.4,horizon+1);ctx.lineTo(vanishX+i*w/8.5,h);ctx.stroke();
      }
      ctx.strokeStyle=rgba(c.light,.055);
      for(let i=-7;i<=7;i++){
        ctx.beginPath();ctx.moveTo(vanishX+i*1.2,horizon-1);ctx.lineTo(vanishX+i*w/7,0);ctx.stroke();
      }
    }
    drawEnvironmentDetails(c,w,h,horizon,vanishX,now);
    drawZoneSignature(c,w,h,horizon,now);

    const fov = Math.PI/3;
    const maxDepth = chapterIndex === 4 ? 9 : 12;
    for (let x=0;x<w;x+=2) {
      const rayA = player.a - fov/2 + (x/w)*fov;
      const cos = Math.cos(rayA), sin = Math.sin(rayA);
      let dist = .03, hitX = player.x, hitY = player.y;
      while (dist < maxDepth) {
        hitX = player.x + cos*dist; hitY = player.y + sin*dist;
        if (isWall(hitX,hitY)) break;
        dist += .035;
      }
      const corrected = Math.max(.05, dist * Math.cos(rayA-player.a));
      zBuffer[x] = zBuffer[x+1] = dist;
      if (dist < maxDepth) {
        const wallH = Math.min(h*2.2, h*.92/corrected);
        const top = horizon-wallH/2;
        const fx=hitX-Math.floor(hitX), fy=hitY-Math.floor(hitY);
        const vertical=Math.min(fx,1-fx)<Math.min(fy,1-fy);
        const cellX=Math.floor(hitX),cellY=Math.floor(hitY);
        const wallCoord=vertical?fy:fx;
        const baseMaterial=((cellX*17+cellY*31+chapterIndex)&1)?c.wall:c.wallAlt;
        const lampCell=((cellX*7+cellY*11+chapterIndex*3)%13)===0;
        const lamp=lampCell?Math.max(.08,.38-dist/maxDepth*.25):.025;
        const material=blend(baseMaterial,c.light,lamp);
        const grain=.93+Math.sin(wallCoord*48+cellX*3.1+cellY)*.055;
        const sideLight=vertical?.93:.72;
        const distanceLight=Math.max(.25,1-dist/maxDepth*.7);
        const seam=Math.min((wallCoord*4)%1,1-(wallCoord*4)%1)<.045?.72:1;
        const shade=distanceLight*sideLight*grain*seam;
        drawWallColumn({c,x,top,wallH,wallCoord,cellX,cellY,material,shade,dist,maxDepth,now});
      }
    }

    renderSprites(c, fov, horizon, now);
    renderWeapon(c, now);
    ctx.fillStyle = `rgba(${c.fog[0]},${c.fog[1]},${c.fog[2]},.045)`;
    ctx.fillRect(0,0,w,h);
    renderMinimap(c);
  }

  function renderMinimap(c){
    if(!player||!map.length)return;const mw=minimapCanvas.width,mh=minimapCanvas.height,rows=map.length,cols=map[0].length,scale=Math.min(mw/cols,mh/rows),ox=(mw-cols*scale)/2,oy=(mh-rows*scale)/2;
    minimapCtx.clearRect(0,0,mw,mh);minimapCtx.fillStyle="#020607";minimapCtx.fillRect(0,0,mw,mh);
    for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){minimapCtx.fillStyle=map[y][x]?(chapterIndex===1?"#173523":"#151c20"):(chapterIndex===1?"#6f9f55":"#76939a");minimapCtx.fillRect(ox+x*scale,oy+y*scale,Math.ceil(scale),Math.ceil(scale));}
    const loot=[...notes,...entities,...(zoneExit?[zoneExit]:[]),...(relic?[relic]:[])];
    for(const item of loot){if(item.picked||item.alive===false)continue;let col=null,size=2.2;if(item.type==="enemy"){col=item.boss?"#ff4255":"#c52d3b";size=item.boss?3.7:2.3;}else if(item.type==="herb")col="#74b75a";else if(["weapon","ammo","silver","note","relic"].includes(item.type)){col=item.type==="relic"?"#fff09a":"#d8ae59";size=item.type==="relic"?3.6:2.2;}else if(item.type==="exit")col="#67b8d6";else if(item.type==="merchant")col="#b88cff";if(!col)continue;minimapCtx.fillStyle=col;minimapCtx.beginPath();minimapCtx.arc(ox+item.x*scale,oy+item.y*scale,size,0,Math.PI*2);minimapCtx.fill();}
    const px=ox+player.x*scale,py=oy+player.y*scale;minimapCtx.save();minimapCtx.translate(px,py);minimapCtx.rotate(player.a);minimapCtx.fillStyle="#f1eadb";minimapCtx.beginPath();minimapCtx.moveTo(5,0);minimapCtx.lineTo(-4,-3.2);minimapCtx.lineTo(-4,3.2);minimapCtx.closePath();minimapCtx.fill();minimapCtx.restore();
    minimapCtx.strokeStyle="rgba(232,220,183,.78)";minimapCtx.lineWidth=2;minimapCtx.strokeRect(1,1,mw-2,mh-2);
  }

  function drawEnvironmentDetails(c,w,h,horizon,vanishX,now){
    if(inHub){
      const moon=ctx.createRadialGradient(w*.73,h*.18,0,w*.73,h*.18,h*.16);moon.addColorStop(0,"rgba(190,202,207,.48)");moon.addColorStop(.28,"rgba(139,154,165,.22)");moon.addColorStop(1,"rgba(90,105,120,0)");ctx.fillStyle=moon;ctx.fillRect(w*.5,0,w*.46,h*.42);return;
    }
    if(chapterIndex===0){
      const interior=zoneIndex>0&&zoneIndex<7;
      if(interior){
        const ceiling=ctx.createLinearGradient(0,0,0,horizon);ceiling.addColorStop(0,"rgba(12,10,14,.82)");ceiling.addColorStop(1,"rgba(35,27,31,.08)");ctx.fillStyle=ceiling;ctx.fillRect(0,0,w,horizon);
        ctx.strokeStyle="rgba(119,84,62,.25)";ctx.lineWidth=3;for(let i=-6;i<=6;i++){ctx.beginPath();ctx.moveTo(vanishX+i*2,horizon);ctx.lineTo(w*.5+i*w*.12,0);ctx.stroke();}
      }else{
        const moon=ctx.createRadialGradient(w*.72,h*.17,0,w*.72,h*.17,h*.14);moon.addColorStop(0,"rgba(205,215,221,.62)");moon.addColorStop(.2,"rgba(157,174,190,.26)");moon.addColorStop(1,"rgba(100,120,150,0)");ctx.fillStyle=moon;ctx.fillRect(w*.5,0,w*.44,h*.38);
        if(zoneIndex===7&&Math.sin(now*.0027)> .94){ctx.fillStyle="rgba(215,225,255,.2)";ctx.fillRect(0,0,w,h);ctx.strokeStyle="rgba(235,241,255,.88)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(w*.22,0);ctx.lineTo(w*.28,h*.12);ctx.lineTo(w*.24,h*.2);ctx.lineTo(w*.34,h*.34);ctx.stroke();}
      }
    }else if(chapterIndex===1){
      const sunX=w*.7-Math.sin(player.a)*w*.14,sunY=h*.14;
      ctx.fillStyle="rgba(18,43,23,.62)";for(let i=0;i<22;i++){const x=(i*83+zoneIndex*37)%w,r=38+(i%5)*13;ctx.beginPath();ctx.arc(x,-5+(i%3)*17,r,0,Math.PI*2);ctx.fill();}
      const sun=ctx.createRadialGradient(sunX,sunY,0,sunX,sunY,h*.18);sun.addColorStop(0,"rgba(235,210,116,.84)");sun.addColorStop(.18,"rgba(197,184,93,.34)");sun.addColorStop(1,"rgba(135,155,76,0)");ctx.fillStyle=sun;ctx.fillRect(sunX-h*.2,0,h*.4,h*.4);
      ctx.strokeStyle="rgba(121,150,81,.12)";ctx.lineWidth=1;for(let i=0;i<8;i++){const x=(i*127+now*.004)%w;ctx.beginPath();ctx.moveTo(x,horizon);ctx.lineTo(x+40,h);ctx.stroke();}
    }else if(chapterIndex===2){
      ctx.strokeStyle="rgba(125,205,211,.2)";ctx.lineWidth=1;
      for(let y=horizon+6;y<h;y+=8){const wave=Math.sin(now*.003+y*.11+player.x)*7;ctx.beginPath();ctx.moveTo(0+wave,y);ctx.lineTo(w,y);ctx.stroke();}
      const reflection=ctx.createLinearGradient(0,horizon,0,h);reflection.addColorStop(0,"rgba(160,213,216,.18)");reflection.addColorStop(1,"rgba(17,66,70,.05)");ctx.fillStyle=reflection;ctx.fillRect(0,horizon,w,h-horizon);
      ctx.fillStyle="rgba(35,48,57,.46)";for(let i=0;i<7;i++){ctx.beginPath();ctx.ellipse((i*149+67)%w,h*.11+(i%2)*27,95,20,0,0,Math.PI*2);ctx.fill();}
    }else if(chapterIndex===3){
      ctx.fillStyle="rgba(45,47,55,.45)";for(let i=0;i<11;i++){const x=i*w/10-30,hh=25+(i%4)*19;ctx.fillRect(x,horizon-hh,w*.07,hh);ctx.beginPath();ctx.moveTo(x,horizon-hh);ctx.lineTo(x+w*.035,horizon-hh-18);ctx.lineTo(x+w*.07,horizon-hh);ctx.fill();}
    }else if(chapterIndex===4){
      ctx.fillStyle="rgba(9,5,8,.7)";ctx.fillRect(0,0,w,horizon*.48);
      ctx.fillStyle="rgba(42,24,27,.72)";for(let i=0;i<17;i++){const x=i*w/16,r=12+(i%5)*9;ctx.beginPath();ctx.moveTo(x-r,0);ctx.lineTo(x,horizon*(.12+(i%4)*.07));ctx.lineTo(x+r,0);ctx.fill();}
      ctx.strokeStyle="rgba(165,81,52,.2)";ctx.lineWidth=2;for(let i=-4;i<=4;i++){ctx.beginPath();ctx.moveTo(vanishX+i*4,horizon);ctx.lineTo(w*.5+i*w*.18,h);ctx.stroke();}
    }else if(chapterIndex===5){
      const sunX=w*.74,sunY=h*.13;const sun=ctx.createRadialGradient(sunX,sunY,0,sunX,sunY,h*.24);sun.addColorStop(0,"rgba(255,242,181,.95)");sun.addColorStop(.2,"rgba(255,220,117,.5)");sun.addColorStop(1,"rgba(255,220,130,0)");ctx.fillStyle=sun;ctx.fillRect(w*.44,0,w*.56,h*.48);
      ctx.fillStyle="rgba(242,239,225,.48)";for(let i=0;i<10;i++){const x=(i*117+now*.003)%w,y=45+(i%4)*34;ctx.beginPath();ctx.ellipse(x,y,58+(i%3)*19,13+(i%2)*7,0,0,Math.PI*2);ctx.fill();}
    }
  }

  function drawZoneSignature(c,w,h,horizon,now){
    if(inHub)return;
    const variant=zoneIndex%5;
    if(variant===0){
      ctx.strokeStyle=rgba(c.light,.22);ctx.lineWidth=2;
      for(let i=0;i<7;i++){const x=(i+.5)*w/7,swing=Math.sin(now*.0015+i)*8;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x+swing,horizon*(.18+(i%3)*.12));ctx.stroke();}
    }else if(variant===1){
      const mist=ctx.createLinearGradient(0,horizon*.55,0,h);mist.addColorStop(0,rgba(c.fog,0));mist.addColorStop(.45,rgba(c.fog,.18));mist.addColorStop(1,rgba(c.fog,.03));ctx.fillStyle=mist;ctx.fillRect(0,horizon*.5,w,h-horizon*.5);
    }else if(variant===2){
      ctx.fillStyle=rgba(c.wallAlt,.28);for(let i=0;i<6;i++){const x=i%2?i*w/5:w-i*w/5,ww=12+(i%3)*8;ctx.fillRect(x-ww/2,horizon*.15,ww,horizon*.85);}
    }else if(variant===3){
      ctx.fillStyle=rgba(c.light,.34);for(let i=0;i<34;i++){const x=(i*97+now*.009*(1+i%3))%w,y=(i*53+now*.014*(1+i%2))%horizon;ctx.fillRect(x,y,1+(i%3===0),1+(i%4===0));}
    }else{
      ctx.strokeStyle=rgba(c.light,.24);ctx.lineWidth=8;ctx.beginPath();ctx.arc(w*.5,horizon*.8,w*.19,Math.PI,0);ctx.stroke();ctx.fillStyle=rgba(c.fog,.08);ctx.fillRect(w*.31,horizon*.78,w*.38,horizon*.22);
    }
  }

  function drawWallColumn({c,x,top,wallH,wallCoord,cellX,cellY,material,shade,dist,maxDepth,now}){
    const upper=wallH*.18,lower=wallH*.24,ground=top+wallH;
    if(chapterIndex===1&&!inHub){
      const center=.18+(((cellX*13+cellY*7)%7)/7)*.64;
      const trunkDist=Math.abs(wallCoord-center);
      const bark=((cellX+cellY)&1)?[79,57,38]:[61,48,34];
      if(trunkDist<.105){
        const edge=1-trunkDist/.105;ctx.fillStyle=color(bark,shade*(.64+edge*.5));ctx.fillRect(x,top+wallH*.13,2,wallH*.78);
        if(trunkDist<.018){ctx.fillStyle=rgba(c.light,.16);ctx.fillRect(x,top+wallH*.17,1,wallH*.65);}
      }else{
        const leaves=blend(c.wall,[27,61,32],.56);ctx.fillStyle=rgba(leaves,Math.max(.22,shade*.74));ctx.fillRect(x,top,2,wallH*.31);
        ctx.fillStyle=rgba([45,53,31],Math.max(.18,shade*.58));ctx.fillRect(x,ground-wallH*.2,2,wallH*.2);
        if(trunkDist<.28){ctx.fillStyle=rgba(bark,.5);ctx.fillRect(x,top+wallH*.3,2,wallH*.055);}
      }
      return;
    }

    ctx.fillStyle=color(blend(material,c.light,.07),shade*1.14);ctx.fillRect(x,top,2,upper);
    ctx.fillStyle=color(material,shade);ctx.fillRect(x,top+upper,2,wallH-upper-lower);
    ctx.fillStyle=color(blend(material,c.floor,.3),shade*.75);ctx.fillRect(x,ground-lower,2,lower);

    if(chapterIndex===0||inHub){
      const brickRow=Math.max(5,wallH*.12);ctx.fillStyle=rgba([25,20,22],.28);
      for(let y=top+brickRow;y<ground;y+=brickRow)ctx.fillRect(x,y,2,Math.max(1,wallH*.008));
      const feature=(cellX*5+cellY*11+Math.max(0,zoneIndex))%9;
      if(!inHub&&feature===2&&wallCoord>.22&&wallCoord<.78){
        const wy=top+wallH*.2,wh=wallH*.43;ctx.fillStyle=color([39,60,83],Math.max(.38,shade));ctx.fillRect(x,wy,2,wh);
        if(Math.abs(wallCoord-.5)<.025){ctx.fillStyle="#171921";ctx.fillRect(x,wy,2,wh);}
        ctx.fillStyle=rgba([134,165,183],.24);ctx.fillRect(x,wy,1,wh);
      }else if(!inHub&&feature===5&&Math.abs(wallCoord-.5)<.055){
        const cy=top+wallH*.57;ctx.fillStyle=rgba([255,170,55],.32);ctx.fillRect(x,cy-wallH*.09,2,wallH*.18);ctx.fillStyle="#ffd175";ctx.fillRect(x,cy,2,Math.max(2,wallH*.05));
      }
      if((cellX+cellY)%4===0&&wallCoord<.045){ctx.fillStyle=rgba([12,10,12],.38);ctx.fillRect(x,top,1,wallH);}
    }else if(chapterIndex===2){
      ctx.fillStyle=rgba([31,83,70],.34);ctx.fillRect(x,ground-wallH*.26,2,wallH*.26);
      for(let y=top+wallH*.24;y<ground;y+=wallH*.2){ctx.fillStyle=rgba([22,38,44],.25);ctx.fillRect(x,y,2,1);}
      const broken=(cellX*3+cellY*7)%8===1;
      if(broken&&wallCoord>.28&&wallCoord<.72){ctx.fillStyle=color([25,44,59],shade*.7);ctx.fillRect(x,top+wallH*.17,2,wallH*.35);}
    }else if(chapterIndex===3){
      const row=Math.max(6,wallH*.17);for(let y=top+row;y<ground;y+=row){ctx.fillStyle=rgba([35,37,42],.32);ctx.fillRect(x,y,2,Math.max(1,wallH*.011));}
      if((cellX+cellY)%3===0&&Math.abs(wallCoord-.5)<.035){ctx.fillStyle=rgba(c.light,.28);ctx.fillRect(x,top+wallH*.06,1,wallH*.8);}
    }else if(chapterIndex===4){
      const beam=(cellX*7+cellY*3)%5===0;
      if(beam&&(wallCoord<.09||wallCoord>.91)){ctx.fillStyle=color([66,43,30],shade*.85);ctx.fillRect(x,top,2,wallH);}
      if((cellX*11+cellY)%9===0&&wallCoord>.38&&wallCoord<.62){ctx.fillStyle=rgba([220,58,74],.48);ctx.fillRect(x,top+wallH*.24,2,wallH*.36);}
      ctx.fillStyle=rgba([28,17,19],.24);ctx.fillRect(x,ground-wallH*.18,2,wallH*.18);
    }else if(chapterIndex===5){
      const gold=(cellX*5+cellY*7)%6===0;
      if(gold&&(wallCoord<.075||wallCoord>.925)){ctx.fillStyle=color([210,169,69],shade*1.1);ctx.fillRect(x,top,2,wallH);}
      const arch=(cellX+cellY*3)%7===2;
      if(arch&&wallCoord>.25&&wallCoord<.75){ctx.fillStyle=color([99,147,184],Math.max(.45,shade));ctx.fillRect(x,top+wallH*.15,2,wallH*.42);}
      ctx.fillStyle=rgba([255,247,216],.14);ctx.fillRect(x,top+wallH*.06,1,wallH*.74);
    }
    ctx.fillStyle=rgba(c.light,Math.max(.025,.16-dist/maxDepth*.13));ctx.fillRect(x,top,2,Math.max(1,wallH*.018));
  }

  function renderSprites(c, fov, horizon, now) {
    const drawables = [...entities, ...notes, ...(zoneExit?[zoneExit]:[]), ...(relic ? [relic] : [])]
      .filter(e => !e.picked && (e.type !== "enemy" || e.alive))
      .map(e => ({ e, d: Math.hypot(e.x-player.x,e.y-player.y) }))
      .sort((a,b)=>b.d-a.d);
    for (const {e,d} of drawables) {
      if (d < .15 || d > 12.5) continue;
      const angle = normalizeAngle(Math.atan2(e.y-player.y,e.x-player.x)-player.a);
      if (Math.abs(angle)>fov*.67) continue;
      const sx = canvas.width*(.5+angle/fov);
      const zi = Math.max(0,Math.min(canvas.width-1,Math.floor(sx)));
      if (d > zBuffer[zi]+.3) continue;
      const base = Math.min(canvas.height*1.4, canvas.height/d);
      if (e.type === "enemy" || e.type === "ghost") drawCreature(e,sx,horizon,base,d,now,c);
      else if (e.type === "note") drawNote(sx,horizon,base,d,now,c);
      else if (e.type === "herb") drawHerb(sx,horizon,base,d,c);
      else if (e.type === "relic") drawRelic(sx,horizon,base,d,now,c);
      else if (e.type === "relicDisplay") drawRelic(sx,horizon,base*.72,d,now,c);
      else if (["exit","weapon","ammo","silver"].includes(e.type)) drawWorldPickup(e,sx,horizon,base,d,now,c);
      else if(e.type==="decor")drawDecoration(e,sx,horizon,base,d,now,c);
      else if(e.type==="corpse")drawCorpse(e,sx,horizon,base,d,now,c);
      else if(e.type==="projectile")drawProjectile(e,sx,horizon,base,d,c);
      else if(e.type==="merchant")drawMerchant(e,sx,horizon,base,d,now,c);
    }
  }

  function drawCreature(e,sx,horizon,base,d,now,c) {
    const phase=e.boss?(e.hp/e.maxHp>.66?0:e.hp/e.maxHp>.33?1:2):0;
    const bossScale = e.boss ? (e.mini?1.55:1.65+phase*.28) : 1;
    const ghost = e.type === "ghost";
    const height = base*.9*bossScale;
    const broad=["wolf","leech","amphibian","crystal","falseAngel","marble"].includes(e.shape);
    const width = height*(e.boss?.58:broad?.48:.38);
    const y = horizon + base*.42 - height;
    const alpha = ghost ? e.alpha : Math.max(.25,1-d/15);
    ctx.save(); ctx.globalAlpha = alpha;
    if(!ghost)ctx.translate(Math.sin(now*.018+(e.sway||0))*(e.boss?1.2:.65),0);
    ctx.fillStyle="rgba(0,0,0,.38)";ctx.beginPath();ctx.ellipse(sx,horizon+base*.43,width*.52,Math.max(2,base*.065),0,0,Math.PI*2);ctx.fill();
    const hit = e.hitAt && now-e.hitAt<130;
    const body=e.boss?blend(c.enemyColor,c.light,.25):c.enemyColor;
    const bodyGrad=ctx.createLinearGradient(sx-width*.55,0,sx+width*.55,0);
    bodyGrad.addColorStop(0,color(body,.34));bodyGrad.addColorStop(.48,color(body,.9));bodyGrad.addColorStop(1,color(body,.42));
    const fill=hit?color(c.light,1.15):ghost?rgba(c.fog,.46):bodyGrad;
    if(e.boss&&!ghost)drawBossForm(e,sx,y,width,height,phase,fill,body,c,now);
    else drawEnemyForm(e,sx,y,width,height,fill,body,c,ghost,now);
    ctx.restore();
    if (!ghost && e.hitAt && now-e.hitAt<900 && !e.boss) {
      ctx.fillStyle="rgba(0,0,0,.65)";ctx.fillRect(sx-width/2,y-5,width,2);
      ctx.fillStyle=c.accent;ctx.fillRect(sx-width/2,y-5,width*Math.max(0,e.hp/e.maxHp),2);
      ctx.fillStyle="#d8d1c3";ctx.font=`${Math.max(6,width*.085)}px Arial`;ctx.textAlign="center";ctx.fillText(`${e.name||"СУЩЕСТВО"} · ${Math.ceil(e.hp)}/${e.maxHp} HP`,sx,y-9);
    }
  }

  function poly(points,fill){ctx.fillStyle=fill;ctx.beginPath();ctx.moveTo(points[0][0],points[0][1]);for(let i=1;i<points.length;i++)ctx.lineTo(points[i][0],points[i][1]);ctx.closePath();ctx.fill();}
  function limb(x1,y1,x2,y2,width,stroke){ctx.strokeStyle=stroke;ctx.lineWidth=Math.max(1,width);ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.lineCap="butt";}
  function teethMouth(x,y,w,h){ctx.fillStyle="#241012";ctx.fillRect(x-w/2,y-h/2,w,h);ctx.fillStyle="#ded1b7";const count=Math.max(3,Math.floor(w/4));for(let i=0;i<count;i++){const tx=x-w*.43+i*w*.86/(count-1);ctx.beginPath();ctx.moveTo(tx,y-h*.42);ctx.lineTo(tx+1.5,y);ctx.lineTo(tx+3,y-h*.42);ctx.fill();ctx.beginPath();ctx.moveTo(tx,y+h*.42);ctx.lineTo(tx+1.5,y);ctx.lineTo(tx+3,y+h*.42);ctx.fill();}}
  function eyeDot(x,y,r,col="#efe1bd"){ctx.fillStyle=col;ctx.beginPath();ctx.arc(x,y,Math.max(1,r),0,Math.PI*2);ctx.fill();ctx.fillStyle="#171012";ctx.beginPath();ctx.arc(x,y,Math.max(.6,r*.38),0,Math.PI*2);ctx.fill();}
  function antlers(x,y,w,h,stroke){ctx.strokeStyle=stroke;ctx.lineWidth=Math.max(1,w*.045);for(const side of [-1,1]){ctx.beginPath();ctx.moveTo(x+side*w*.12,y);ctx.lineTo(x+side*w*.42,y-h*.45);ctx.lineTo(x+side*w*.62,y-h*.72);ctx.moveTo(x+side*w*.35,y-h*.35);ctx.lineTo(x+side*w*.18,y-h*.7);ctx.moveTo(x+side*w*.48,y-h*.54);ctx.lineTo(x+side*w*.72,y-h*.5);ctx.stroke();}}
  function wing(x,y,w,h,side,fill,eyes=0){poly([[x,y],[x+side*w*.95,y-h*.42],[x+side*w*.72,y+h*.1],[x+side*w*1.04,y+h*.4],[x+side*w*.2,y+h*.25]],fill);for(let i=0;i<eyes;i++)eyeDot(x+side*w*(.36+(i%3)*.2),y-h*.13+(i%2)*h*.2,w*.025,"#e4cf8b");}

  function drawEnemyForm(e,x,y,w,h,fill,body,c,ghost,now){
    if(ghost){poly([[x-w*.2,y+h*.18],[x-w*.45,y+h*.95],[x+w*.45,y+h*.95],[x+w*.2,y+h*.18]],fill);ctx.fillStyle=fill;ctx.beginPath();ctx.arc(x,y+h*.15,w*.23,0,Math.PI*2);ctx.fill();return;}
    const dark=color(body,.34),bone="#d4c6a8",blood="#7d1d29";
    switch(e.shape){
      case "servant":
        poly([[x-w*.15,y+h*.24],[x-w*.22,y+h*.68],[x-w*.12,y+h*.95],[x+w*.13,y+h*.95],[x+w*.2,y+h*.67],[x+w*.14,y+h*.24]],fill);
        limb(x-w*.13,y+h*.34,x-w*.48,y+h*.84,w*.09,dark);limb(x+w*.13,y+h*.34,x+w*.48,y+h*.84,w*.09,dark);
        ctx.fillStyle="#8e776b";ctx.beginPath();ctx.ellipse(x,y+h*.16,w*.2,h*.14,0,0,Math.PI*2);ctx.fill();ctx.fillStyle="#1a1113";ctx.fillRect(x-w*.12,y+h*.11,w*.08,h*.035);ctx.fillRect(x+w*.04,y+h*.11,w*.08,h*.035);teethMouth(x,y+h*.205,w*.24,h*.055);
        ctx.strokeStyle="#b39a85";ctx.lineWidth=1;for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(x-w*.13,y+h*(.39+i*.045));ctx.lineTo(x+w*.13,y+h*(.39+i*.045));ctx.stroke();}break;
      case "vampire":
        poly([[x-w*.18,y+h*.22],[x-w*.44,y+h*.95],[x+w*.44,y+h*.95],[x+w*.18,y+h*.22]],fill);limb(x-w*.13,y+h*.35,x-w*.64,y+h*.72,w*.075,"#e2d9cf");limb(x+w*.13,y+h*.35,x+w*.64,y+h*.72,w*.075,"#e2d9cf");
        ctx.fillStyle="#e5deda";ctx.beginPath();ctx.ellipse(x,y+h*.14,w*.23,h*.14,0,0,Math.PI*2);ctx.fill();eyeDot(x-w*.08,y+h*.12,w*.025,"#8f1825");eyeDot(x+w*.08,y+h*.12,w*.025,"#8f1825");teethMouth(x,y+h*.2,w*.38,h*.06);
        ctx.strokeStyle=bone;ctx.lineWidth=1;for(const side of [-1,1])for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(x+side*w*.63,y+h*.72);ctx.lineTo(x+side*w*(.72+i*.08),y+h*(.79+i*.025));ctx.stroke();}break;
      case "wolf":
        ctx.fillStyle=fill;ctx.beginPath();ctx.ellipse(x-w*.05,y+h*.68,w*.48,h*.18,0,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.ellipse(x+w*.42,y+h*.58,w*.23,h*.17,-.2,0,Math.PI*2);ctx.fill();
        for(const lx of [-.36,-.12,.22,.4])limb(x+w*lx,y+h*.73,x+w*(lx-.04),y+h*.98,w*.07,dark);ctx.strokeStyle=bone;ctx.lineWidth=Math.max(1,w*.025);for(let i=0;i<5;i++){ctx.beginPath();ctx.arc(x-w*.08+i*w*.09,y+h*.66,w*.24,3.7,5.6);ctx.stroke();}
        limb(x-w*.27,y+h*.52,x-w*.23,y+h*.27,w*.035,"#4b3525");limb(x,y+h*.5,x+w*.05,y+h*.22,w*.035,"#4b3525");teethMouth(x+w*.52,y+h*.61,w*.27,h*.07);break;
      case "root":
        ctx.fillStyle=fill;ctx.fillRect(x-w*.17,y+h*.18,w*.34,h*.62);for(let i=0;i<7;i++){const a=i*.9;limb(x,y+h*.55,x+Math.cos(a)*w*(.55+(i%2)*.2),y+h*(.32+Math.sin(a)*.33),w*.055,dark);}
        ctx.fillStyle="#806e5c";ctx.beginPath();ctx.ellipse(x,y+h*.48,w*.16,h*.12,0,0,Math.PI*2);ctx.fill();eyeDot(x-w*.06,y+h*.45,w*.018,"#b9cc75");eyeDot(x+w*.06,y+h*.45,w*.018,"#b9cc75");teethMouth(x,y+h*.52,w*.18,h*.035);break;
      case "hunter":
        poly([[x-w*.15,y+h*.25],[x-w*.28,y+h*.86],[x+w*.28,y+h*.86],[x+w*.15,y+h*.25]],fill);limb(x-w*.13,y+h*.36,x-w*.5,y+h*.9,w*.08,dark);limb(x+w*.13,y+h*.36,x+w*.5,y+h*.9,w*.08,dark);
        ctx.fillStyle=bone;ctx.beginPath();ctx.ellipse(x,y+h*.15,w*.18,h*.17,0,0,Math.PI*2);ctx.fill();poly([[x-w*.12,y+h*.18],[x+w*.12,y+h*.18],[x,y+h*.3]],bone);antlers(x,y+h*.05,w,h*.3,"#8a765c");for(let i=-1;i<=1;i++)limb(x+i*w*.12,y+h*.32,x+i*w*.17,y+h*.02,w*.035,"#3d5b2e");break;
      case "fishman":
        poly([[x-w*.24,y+h*.3],[x-w*.35,y+h*.9],[x+w*.35,y+h*.9],[x+w*.24,y+h*.3]],fill);ctx.fillStyle=fill;ctx.beginPath();ctx.ellipse(x,y+h*.18,w*.34,h*.18,0,0,Math.PI*2);ctx.fill();eyeDot(x-w*.14,y+h*.13,w*.065,"#f1eee4");eyeDot(x+w*.14,y+h*.13,w*.065,"#f1eee4");teethMouth(x,y+h*.225,w*.43,h*.065);for(let i=0;i<4;i++){ctx.strokeStyle="#a6c1b9";ctx.beginPath();ctx.moveTo(x+w*.25,y+h*(.28+i*.035));ctx.lineTo(x+w*.4,y+h*(.26+i*.04));ctx.stroke();}break;
      case "leech":
        ctx.fillStyle=fill;ctx.beginPath();ctx.ellipse(x,y+h*.68,w*.58,h*.2,0,0,Math.PI*2);ctx.fill();ctx.fillStyle="#321419";ctx.beginPath();ctx.arc(x+w*.48,y+h*.65,w*.22,0,Math.PI*2);ctx.fill();for(let i=0;i<14;i++){const a=i*Math.PI*2/14;ctx.fillStyle=bone;ctx.beginPath();ctx.moveTo(x+w*.48+Math.cos(a)*w*.18,y+h*.65+Math.sin(a)*w*.18);ctx.lineTo(x+w*.48+Math.cos(a)*w*.06,y+h*.65+Math.sin(a)*w*.06);ctx.lineTo(x+w*.48+Math.cos(a+.12)*w*.18,y+h*.65+Math.sin(a+.12)*w*.18);ctx.fill();}break;
      case "amphibian":
        ctx.fillStyle=fill;ctx.beginPath();ctx.ellipse(x,y+h*.61,w*.42,h*.28,0,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.ellipse(x,y+h*.32,w*.31,h*.2,0,0,Math.PI*2);ctx.fill();for(const side of [-1,1]){limb(x+side*w*.28,y+h*.55,x+side*w*.58,y+h*.85,w*.11,dark);limb(x+side*w*.2,y+h*.7,x+side*w*.47,y+h*.98,w*.13,dark);}eyeDot(x-w*.14,y+h*.26,w*.055,"#d7d8ae");eyeDot(x+w*.14,y+h*.26,w*.055,"#d7d8ae");teethMouth(x,y+h*.39,w*.3,h*.05);break;
      case "statue":
        poly([[x-w*.2,y+h*.25],[x-w*.35,y+h*.9],[x+w*.35,y+h*.9],[x+w*.2,y+h*.25]],fill);ctx.fillStyle=fill;ctx.beginPath();ctx.arc(x,y+h*.16,w*.23,0,Math.PI*2);ctx.fill();ctx.strokeStyle="#33363a";ctx.lineWidth=1;for(let i=0;i<6;i++){ctx.beginPath();ctx.moveTo(x+(i-3)*w*.07,y+h*.3);ctx.lineTo(x+(i-2)*w*.1,y+h*(.45+i*.06));ctx.stroke();}ctx.fillStyle="#25262a";ctx.fillRect(x-w*.11,y+h*.12,w*.06,h*.035);ctx.fillRect(x+w*.05,y+h*.12,w*.06,h*.035);break;
      case "stoneSoldier":
        ctx.fillStyle=fill;ctx.fillRect(x-w*.3,y+h*.27,w*.6,h*.6);ctx.fillRect(x-w*.37,y+h*.34,w*.74,h*.16);ctx.beginPath();ctx.arc(x,y+h*.17,w*.27,Math.PI,0);ctx.fill();ctx.fillRect(x-w*.27,y+h*.16,w*.54,h*.12);eyeDot(x-w*.09,y+h*.21,w*.025,"#d4c4a7");eyeDot(x+w*.09,y+h*.21,w*.025,"#d4c4a7");break;
      case "miner":
        poly([[x-w*.25,y+h*.3],[x-w*.36,y+h*.88],[x+w*.34,y+h*.88],[x+w*.18,y+h*.28]],fill);limb(x-w*.2,y+h*.42,x-w*.55,y+h*.83,w*.11,dark);limb(x+w*.18,y+h*.42,x+w*.57,y+h*.72,w*.14,dark);ctx.fillStyle="#8f6b59";ctx.beginPath();ctx.ellipse(x,y+h*.18,w*.25,h*.15,.2,0,Math.PI*2);ctx.fill();ctx.fillStyle="#9f3447";ctx.fillRect(x-w*.18,y+h*.1,w*.36,h*.055);for(let i=-2;i<=2;i++)poly([[x+i*w*.07,y+h*.2],[x+(i+.3)*w*.07,y+h*.34],[x+(i+.6)*w*.07,y+h*.2]],"#b94758");break;
      case "crystal":
        poly([[x-w*.22,y+h*.27],[x-w*.39,y+h*.9],[x+w*.38,y+h*.9],[x+w*.22,y+h*.27]],fill);ctx.fillStyle="#b43d55";for(let i=-3;i<=3;i++){ctx.beginPath();ctx.moveTo(x+i*w*.11,y+h*.65);ctx.lineTo(x+i*w*.14,y+h*(.04+Math.abs(i)*.07));ctx.lineTo(x+(i+.7)*w*.11,y+h*.67);ctx.fill();if(i%2===0){eyeDot(x+i*w*.12,y+h*(.33+Math.abs(i)*.05),w*.02,"#d8b5a2");ctx.fillStyle="#36151b";ctx.fillRect(x+i*w*.12-2,y+h*(.38+Math.abs(i)*.05),4,1);}}break;
      case "marble":
        ctx.fillStyle="#ddd7c9";ctx.beginPath();ctx.ellipse(x,y+h*.5,w*.3,h*.42,0,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(x,y+h*.15,w*.22,0,Math.PI*2);ctx.fill();ctx.fillStyle="#7a1e32";ctx.beginPath();ctx.ellipse(x,y+h*.48,w*.13,h*.19,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle="#aa4054";ctx.lineWidth=1;for(let i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(x,y+h*.48);ctx.lineTo(x+i*w*.14,y+h*(.24+Math.abs(i)*.16));ctx.stroke();}break;
      case "falseAngel":
        poly([[x-w*.17,y+h*.28],[x-w*.3,y+h*.86],[x+w*.3,y+h*.86],[x+w*.17,y+h*.28]],fill);for(const side of [-1,1]){wing(x,y+h*.42,w*.68,h*.42,side,"#d7cfbb",6);wing(x,y+h*.55,w*.55,h*.35,side,"#c8bea6",4);}ctx.fillStyle="#eadfcd";ctx.beginPath();ctx.arc(x,y+h*.17,w*.22,0,Math.PI*2);ctx.fill();eyeDot(x-w*.07,y+h*.14,w*.025);eyeDot(x+w*.07,y+h*.14,w*.025);teethMouth(x,y+h*.21,w*.24,h*.04);break;
      default: poly([[x-w*.2,y+h*.2],[x-w*.4,y+h*.95],[x+w*.4,y+h*.95],[x+w*.2,y+h*.2]],fill);ctx.fillStyle=fill;ctx.beginPath();ctx.arc(x,y+h*.15,w*.22,0,Math.PI*2);ctx.fill();
    }
  }

  function drawBossForm(e,x,y,w,h,phase,fill,body,c,now){
    if(e.mini){drawMiniBoss(e,x,y,w,h,phase,fill,body,c);return;}
    const bone="#d8ccb4",blood="#8e1d31",dark="#171116";
    if(chapterIndex===0){
      poly([[x-w*.13,y+h*.22],[x-w*.42,y+h*.96],[x+w*.42,y+h*.96],[x+w*.13,y+h*.22]],"#ddd8cf");for(let i=-3;i<=3;i++)limb(x+i*w*.05,y+h*.12,x+i*w*.12,y+h*.94,w*.025,"#151319");ctx.fillStyle="#e3d9d2";ctx.beginPath();ctx.ellipse(x,y+h*.15,w*.2,h*.12,0,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle="#8f2336";ctx.lineWidth=1;for(let i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(x,y+h*.17);ctx.quadraticCurveTo(x+i*w*.12,y+h*.34,x+i*w*.17,y+h*.62);ctx.stroke();}
      if(phase>0)for(let i=0;i<(phase===1?2:6);i++){const side=i%2?-1:1,rank=Math.floor(i/2);wing(x,y+h*.42,w*(.58+rank*.12),h*.35,side,blood,0);}
      if(phase===2){ctx.fillStyle=dark;ctx.fillRect(x-w*.2,y+h*.12,w*.4,h*.1);for(const a of [-.35,-.12,.12,.35]){ctx.strokeStyle="#d8c9bd";ctx.lineWidth=Math.max(1,w*.07);ctx.beginPath();ctx.moveTo(x,y+h*.17);ctx.lineTo(x+w*a,y+h*(.02+Math.abs(a)*.15));ctx.stroke();}teethMouth(x,y+h*.2,w*.32,h*.05);}else{eyeDot(x-w*.07,y+h*.14,w*.025,"#9e2233");eyeDot(x+w*.07,y+h*.14,w*.025,"#9e2233");}
    }else if(chapterIndex===1){
      ctx.fillStyle="#4f3d29";ctx.fillRect(x-w*.2,y+h*.24,w*.4,h*.62);for(let i=0;i<4+phase*5;i++){const a=i*(Math.PI*2/(4+phase*5));limb(x,y+h*.5,x+Math.cos(a)*w*(.55+(i%3)*.14),y+h*(.5+Math.sin(a)*.42),w*.06,"#4d3d2a");}
      ctx.fillStyle=bone;ctx.beginPath();ctx.ellipse(x,y+h*.15,w*.23,h*.14,0,0,Math.PI*2);ctx.fill();poly([[x-w*.16,y+h*.16],[x+w*.16,y+h*.16],[x,y+h*.31]],bone);antlers(x,y+h*.06,w,h*.32,"#8b7556");ctx.fillStyle="#9b796a";ctx.beginPath();ctx.ellipse(x,y+h*.5,w*.16,h*.12,0,0,Math.PI*2);ctx.fill();eyeDot(x-w*.055,y+h*.47,w*.018,"#d2b47e");eyeDot(x+w*.055,y+h*.47,w*.018,"#d2b47e");teethMouth(x,y+h*.54,w*.18,h*.035);
      if(phase===2)for(let i=-3;i<=3;i++){ctx.fillStyle="#877766";ctx.beginPath();ctx.ellipse(x+i*w*.12,y+h*(.35+Math.abs(i)*.07),w*.05,h*.045,0,0,Math.PI*2);ctx.fill();eyeDot(x+i*w*.12,y+h*(.34+Math.abs(i)*.07),w*.012,"#dbc898");}
    }else if(chapterIndex===2){
      if(phase<2){poly([[x-w*.16,y+h*.22],[x-w*.42,y+h*.96],[x+w*.42,y+h*.96],[x+w*.16,y+h*.22]],"#171820");ctx.fillStyle="#8ba29d";ctx.beginPath();ctx.ellipse(x,y+h*.16,w*.2,h*.13,0,0,Math.PI*2);ctx.fill();ctx.fillStyle="#14262b";ctx.fillRect(x-w*.12,y+h*.12,w*.07,h*.04);ctx.fillRect(x+w*.05,y+h*.12,w*.07,h*.04);ctx.strokeStyle="#74b0bd";for(let i=-1;i<=1;i++){ctx.beginPath();ctx.moveTo(x+i*w*.07,y+h*.15);ctx.lineTo(x+i*w*.1,y+h*.38);ctx.stroke();}const reach=phase?w*.78:w*.45;limb(x-w*.15,y+h*.34,x-reach,y+h*.76,w*.07,"#7f9e99");limb(x+w*.15,y+h*.34,x+reach,y+h*.76,w*.07,"#7f9e99");if(phase)for(let i=0;i<4;i++){ctx.strokeStyle="#70968b";ctx.beginPath();ctx.moveTo(x+w*.18,y+h*(.3+i*.06));ctx.lineTo(x+w*.34,y+h*(.28+i*.07));ctx.stroke();}}
      else{ctx.fillStyle="#526e6d";ctx.beginPath();ctx.ellipse(x,y+h*.58,w*.68,h*.28,0,0,Math.PI*2);ctx.fill();ctx.fillStyle="#24151b";ctx.beginPath();ctx.arc(x-w*.48,y+h*.56,w*.28,0,Math.PI*2);ctx.fill();for(let i=0;i<18;i++){const a=i*Math.PI*2/18;ctx.fillStyle=bone;ctx.beginPath();ctx.moveTo(x-w*.48+Math.cos(a)*w*.24,y+h*.56+Math.sin(a)*w*.24);ctx.lineTo(x-w*.48+Math.cos(a)*w*.08,y+h*.56+Math.sin(a)*w*.08);ctx.lineTo(x-w*.48+Math.cos(a+.1)*w*.24,y+h*.56+Math.sin(a+.1)*w*.24);ctx.fill();}for(let i=0;i<7;i++)limb(x-w*.05+i*w*.12,y+h*.45,x+i*w*.14,y+h*(.15+(i%2)*.58),w*.045,"#658a80");}
    }else if(chapterIndex===3){
      ctx.fillStyle="#7d7b74";ctx.fillRect(x-w*(.25+phase*.08),y+h*.24,w*(.5+phase*.16),h*.65);ctx.beginPath();ctx.arc(x,y+h*.16,w*(.23+phase*.05),0,Math.PI*2);ctx.fill();ctx.strokeStyle="#2d3033";ctx.lineWidth=Math.max(1,w*.025);for(let i=0;i<10+phase*7;i++){ctx.beginPath();ctx.moveTo(x+(i%5-2)*w*.11,y+h*(.25+(i%3)*.17));ctx.lineTo(x+(i%4-1.5)*w*.18,y+h*(.38+(i%4)*.14));ctx.stroke();}
      if(phase===2){for(let i=-3;i<=3;i++){ctx.fillStyle=i%2?"#919089":"#686762";ctx.fillRect(x+i*w*.17,y+h*(.22+Math.abs(i)*.06),w*.13,h*(.64-Math.abs(i)*.05));ctx.beginPath();ctx.arc(x+i*w*.17,y+h*(.4+Math.abs(i)*.04),w*.07,0,Math.PI*2);ctx.fill();}}
    }else if(chapterIndex===4){
      if(phase<2){poly([[x-w*.22,y+h*.24],[x-w*(.32+phase*.14),y+h*.92],[x+w*(.32+phase*.2),y+h*.92],[x+w*.2,y+h*.24]],fill);ctx.fillStyle="#8d6d60";ctx.beginPath();ctx.ellipse(x,y+h*.16,w*.2,h*.13,0,0,Math.PI*2);ctx.fill();for(const side of [-1,1])eyeDot(x+side*w*.07,y+h*.13,w*.03,"#d04450");ctx.fillStyle="#a63348";for(let i=-2;i<=2;i++)poly([[x+i*w*.1,y+h*.25],[x+(i+.25)*w*.1,y+h*.04],[x+(i+.55)*w*.1,y+h*.28]],"#b23f51");}
      else{ctx.fillStyle="#5e3433";ctx.beginPath();ctx.ellipse(x+w*.12,y+h*.62,w*.72,h*.34,0,0,Math.PI*2);ctx.fill();poly([[x-w*.42,y+h*.85],[x-w*.16,y+h*.22],[x+w*.12,y+h*.33],[x+w*.48,y+h*.92]],fill);for(let i=-4;i<=5;i++){ctx.fillStyle="#b53f52";ctx.beginPath();ctx.moveTo(x+i*w*.12,y+h*.75);ctx.lineTo(x+i*w*.11,y+h*(.12+Math.abs(i)*.05));ctx.lineTo(x+(i+.55)*w*.12,y+h*.77);ctx.fill();if(i%2===0)eyeDot(x+i*w*.11,y+h*(.42+Math.abs(i)*.025),w*.018,"#d0a39c");}}
    }else{
      if(phase===0){poly([[x-w*.14,y+h*.23],[x-w*.36,y+h*.95],[x+w*.36,y+h*.95],[x+w*.14,y+h*.23]],"#eee9dc");for(let i=-3;i<=3;i++)limb(x+i*w*.04,y+h*.11,x+i*w*.1,y+h*.92,w*.022,"#17141b");ctx.fillStyle="#eadfd6";ctx.beginPath();ctx.ellipse(x,y+h*.15,w*.19,h*.12,0,0,Math.PI*2);ctx.fill();ctx.fillStyle="#c9a94f";ctx.beginPath();ctx.moveTo(x-w*.18,y+h*.08);ctx.lineTo(x-w*.1,y-h*.01);ctx.lineTo(x,y+h*.05);ctx.lineTo(x+w*.1,y-h*.01);ctx.lineTo(x+w*.18,y+h*.08);ctx.fill();}
      else if(phase===1){poly([[x-w*.18,y+h*.25],[x-w*.38,y+h*.9],[x+w*.38,y+h*.9],[x+w*.18,y+h*.25]],"#d8d0c1");for(const side of [-1,1])for(let i=0;i<3;i++)wing(x,y+h*(.32+i*.1),w*(.58+i*.12),h*.34,side,i%2?"#4e3a48":"#cbbda4",8);for(let i=-2;i<=2;i++)limb(x,y+h*.38,x+i*w*.28,y+h*(.6+Math.abs(i)*.07),w*.055,"#b99f91");ctx.fillStyle="#e3d7c8";ctx.beginPath();ctx.arc(x,y+h*.16,w*.2,0,Math.PI*2);ctx.fill();teethMouth(x,y+h*.21,w*.25,h*.035);}
      else{const mass=ctx.createRadialGradient(x,y+h*.55,0,x,y+h*.55,w*.75);mass.addColorStop(0,"#9b3347");mass.addColorStop(.48,"#6b4e50");mass.addColorStop(1,"#c4bbac");ctx.fillStyle=mass;ctx.beginPath();ctx.ellipse(x,y+h*.57,w*.72,h*.38,0,0,Math.PI*2);ctx.fill();for(let i=0;i<18;i++){const a=i*Math.PI*2/18;limb(x+Math.cos(a)*w*.25,y+h*.57+Math.sin(a)*h*.13,x+Math.cos(a)*w*.88,y+h*.57+Math.sin(a)*h*.45,w*.04,i%3===0?"#d2c8b8":i%3===1?"#7b2638":"#55422f");eyeDot(x+Math.cos(a)*w*.48,y+h*.57+Math.sin(a)*h*.23,w*.022,"#e7d6ad");}ctx.fillStyle="#ba263e";ctx.beginPath();ctx.ellipse(x,y+h*.54,w*.2,h*.2,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle="#f05a67";ctx.lineWidth=Math.max(1,w*.03);ctx.beginPath();ctx.moveTo(x,y+h*.38);ctx.lineTo(x,y+h*.7);ctx.moveTo(x-w*.17,y+h*.54);ctx.lineTo(x+w*.17,y+h*.54);ctx.stroke();}
    }
  }

  function drawMiniBoss(e,x,y,w,h,phase,fill,body,c){
    const bone="#d8ccb4",blood="#8c2134";
    if(chapterIndex===0){poly([[x-w*.17,y+h*.25],[x-w*.35,y+h*.92],[x+w*.34,y+h*.92],[x+w*.17,y+h*.25]],"#29232c");ctx.fillStyle="#e5dcda";ctx.beginPath();ctx.ellipse(x,y+h*.15,w*.2,h*.12,0,0,Math.PI*2);ctx.fill();eyeDot(x-w*.065,y+h*.13,w*.022,"#a82031");eyeDot(x+w*.065,y+h*.13,w*.022,"#a82031");teethMouth(x,y+h*.2,w*.28,h*.04);limb(x-w*.14,y+h*.36,x-w*.48,y+h*.76,w*.055,"#d8d0cc");limb(x-w*.48,y+h*.76,x-w*.67,y+h*.46,w*.018,"#b8b2ad");
      const mut=phase?1:.35;limb(x+w*.14,y+h*.35,x+w*(.5+mut*.25),y+h*.74,w*(.11+mut*.08),blood);for(let i=0;i<4;i++)limb(x+w*(.52+mut*.22),y+h*.72,x+w*(.78+i*.1),y+h*(.78-i*.04),w*.028,bone);
    }else if(chapterIndex===2){ctx.fillStyle="#839d9c";ctx.beginPath();ctx.moveTo(x-w*.1,y+h*.43);ctx.quadraticCurveTo(x+w*.72,y+h*.5,x+w*.48,y+h*.95);ctx.quadraticCurveTo(x-w*.38,y+h*.86,x-w*.12,y+h*.4);ctx.fill();ctx.fillStyle="#e1d8d2";ctx.beginPath();ctx.ellipse(x-w*.08,y+h*.28,w*.25,h*.24,0,0,Math.PI*2);ctx.fill();ctx.fillRect(x-w*.28,y+h*.3,w*.4,h*.26);eyeDot(x-w*.16,y+h*.24,w*.04,"#09090d");eyeDot(x,y+h*.24,w*.04,"#09090d");teethMouth(x-w*.08,y+h*.36,w*.32,h*.055);for(let i=0;i<8;i++){ctx.fillStyle=i%2?"#526c66":"#856653";ctx.beginPath();ctx.ellipse(x+w*(.12+i*.06),y+h*(.58+(i%3)*.06),w*.045,h*.035,0,0,Math.PI*2);ctx.fill();}}
    else if(chapterIndex===4){poly([[x-w*.3,y+h*.25],[x-w*.48,y+h*.9],[x+w*.45,y+h*.9],[x+w*.26,y+h*.25]],fill);ctx.fillStyle="#835f52";ctx.beginPath();ctx.arc(x,y+h*.17,w*.22,0,Math.PI*2);ctx.fill();ctx.fillStyle="#251317";ctx.fillRect(x-w*.16,y+h*.19,w*.32,h*.09);for(let i=0;i<6;i++)ctx.fillRect(x-w*.22+i*w*.08,y+h*(.04+i*.025),w*.025,h*.18);limb(x-w*.24,y+h*.38,x-w*.57,y+h*.82,w*.13,"#66463b");ctx.fillStyle="#9c4050";ctx.beginPath();ctx.moveTo(x+w*.23,y+h*.37);ctx.lineTo(x+w*.78,y+h*.62);ctx.lineTo(x+w*.25,y+h*.85);ctx.closePath();ctx.fill();ctx.strokeStyle="#d06a66";for(let i=0;i<5;i++){ctx.beginPath();ctx.arc(x+w*.4+i*w*.07,y+h*.61,w*(.15+i*.04),-1,1);ctx.stroke();}}
    else{ctx.fillStyle="#eee8d8";ctx.fillRect(x-w*.29,y+h*.28,w*.58,h*.58);ctx.fillRect(x-w*.38,y+h*.35,w*.76,h*.14);for(const side of [-1,1])for(let i=0;i<3;i++)wing(x,y+h*(.35+i*.1),w*(.58+i*.1),h*.34,side,"#c8a84d",0);ctx.fillStyle=phase<2?"#f2eee0":"#b89c8f";ctx.beginPath();ctx.arc(x,y+h*.17,w*.22,0,Math.PI*2);ctx.fill();if(phase<2){ctx.fillStyle="#e9e4d5";ctx.fillRect(x-w*.2,y+h*.11,w*.4,h*.14);}else{ctx.strokeStyle="#6d574e";ctx.beginPath();ctx.moveTo(x-w*.1,y+h*.13);ctx.lineTo(x+w*.08,y+h*.19);ctx.stroke();eyeDot(x-w*.07,y+h*.14,w*.02,"#8b755e");eyeDot(x+w*.07,y+h*.14,w*.02,"#8b755e");}limb(x+w*.25,y+h*.4,x+w*.72,y+h*.88,w*.07,"#d3b760");}
  }

  function drawNote(sx,horizon,base,d,now,c) {
    const size=Math.max(3,base*.14), y=horizon+base*.35+Math.sin(now*.003)*2;
    ctx.save();ctx.globalAlpha=Math.max(.28,1-d/13);
    const glow=ctx.createRadialGradient(sx,y,0,sx,y,size*2.2);glow.addColorStop(0,rgba(c.light,.33));glow.addColorStop(1,rgba(c.light,0));
    ctx.fillStyle=glow;ctx.fillRect(sx-size*2.2,y-size*2.2,size*4.4,size*4.4);
    ctx.fillStyle="#ead99d";ctx.fillRect(sx-size/2,y-size*.35,size,size*.7);
    ctx.fillStyle="#554b3c";ctx.fillRect(sx-size*.35,y-size*.15,size*.7,1);
    ctx.restore();
  }

  function drawHerb(sx,horizon,base,d,c) {
    const size=Math.max(3,base*.12), y=horizon+base*.43;
    ctx.save();ctx.globalAlpha=Math.max(.25,1-d/13);
    const glow=ctx.createRadialGradient(sx,y-size*.25,0,sx,y-size*.25,size*1.7);glow.addColorStop(0,"rgba(115,190,92,.28)");glow.addColorStop(1,"rgba(80,150,65,0)");
    ctx.fillStyle=glow;ctx.fillRect(sx-size*2,y-size*2,size*4,size*3);
    ctx.strokeStyle="#82ad63";ctx.lineWidth=Math.max(1,size*.1);
    for(let i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(sx,y);ctx.lineTo(sx+i*size*.18,y-size*(.5+Math.abs(i)*.08));ctx.stroke();}
    ctx.fillStyle="#a6d77f";ctx.beginPath();ctx.moveTo(sx,y-size*1.05);ctx.lineTo(sx-size*.16,y-size*.78);ctx.lineTo(sx+size*.16,y-size*.78);ctx.closePath();ctx.fill();
    ctx.restore();
  }

  function drawRelic(sx,horizon,base,d,now,c) {
    const size=Math.max(7,base*.22), y=horizon+base*.33+Math.sin(now*.004)*3;
    ctx.save();ctx.globalAlpha=Math.max(.35,1-d/14);
    const glow=ctx.createRadialGradient(sx,y,0,sx,y,size*1.8);glow.addColorStop(0,c.accent);glow.addColorStop(1,"transparent");
    ctx.fillStyle=glow;ctx.fillRect(sx-size*2,y-size*2,size*4,size*4);
    const beam=ctx.createLinearGradient(0,y-size*4,0,y+size);beam.addColorStop(0,rgba(c.light,0));beam.addColorStop(.7,rgba(c.light,.2));beam.addColorStop(1,rgba(c.light,.42));ctx.fillStyle=beam;ctx.fillRect(sx-size*.28,y-size*4,size*.56,size*5);
    ctx.translate(sx,y);ctx.rotate(now*.001);ctx.fillStyle="#d4c8a6";
    ctx.beginPath();ctx.moveTo(0,-size);ctx.lineTo(size*.6,0);ctx.lineTo(0,size);ctx.lineTo(-size*.6,0);ctx.closePath();ctx.fill();
    ctx.strokeStyle="#fff0bb";ctx.lineWidth=Math.max(1,size*.06);ctx.beginPath();ctx.arc(0,0,size*1.18,0,Math.PI*2);ctx.stroke();
    ctx.restore();
  }

  function drawWorldPickup(e,sx,horizon,base,d,now,c){
    const size=Math.max(5,base*(e.type==="exit"?.34:.15));
    const y=horizon+base*.4+(e.type==="exit"?0:Math.sin(now*.004)*2);
    const tint=e.type==="exit"?c.light:e.type==="weapon"?weapons[e.weaponId].tint:e.type==="ammo"?[184,132,72]:[197,192,177];
    ctx.save();ctx.globalAlpha=Math.max(.34,1-d/14);
    const glow=ctx.createRadialGradient(sx,y,0,sx,y,size*2.1);glow.addColorStop(0,rgba(tint,e.type==="exit"?.34:.24));glow.addColorStop(1,rgba(tint,0));
    ctx.fillStyle=glow;ctx.fillRect(sx-size*2.2,y-size*2.2,size*4.4,size*4.4);
    if(e.type==="exit"){
      ctx.strokeStyle=color(tint,.9);ctx.lineWidth=Math.max(1,size*.08);ctx.beginPath();ctx.ellipse(sx,y-size*.5,size*.58,size,0,0,Math.PI*2);ctx.stroke();
      ctx.fillStyle=rgba(tint,.16);ctx.fill();
    }else if(e.type==="weapon"){
      ctx.translate(sx,y);ctx.rotate(-.45);ctx.fillStyle=color(tint,.9);ctx.fillRect(-size*.08,-size,size*.16,size*1.7);ctx.fillRect(-size*.42,size*.38,size*.84,size*.12);
    }else if(e.type==="ammo"){
      ctx.fillStyle=color(tint,.9);ctx.fillRect(sx-size*.38,y-size*.38,size*.76,size*.76);ctx.fillStyle=color(tint,.42);ctx.fillRect(sx-size*.22,y-size*.18,size*.44,size*.1);
    }else{
      ctx.fillStyle=color(tint,.9);ctx.beginPath();ctx.arc(sx,y,size*.35,0,Math.PI*2);ctx.fill();ctx.fillStyle="#615640";ctx.fillRect(sx-1,y-size*.22,2,size*.44);
    }
    ctx.restore();
  }

  function drawDecoration(e,sx,horizon,base,d,now,c){
    const k=e.kind,s=Math.max(4,base*.18),ground=horizon+base*.43;
    ctx.save();ctx.globalAlpha=Math.max(.3,1-d/14);
    if(k!=="chandelier"){ctx.fillStyle="rgba(0,0,0,.28)";ctx.beginPath();ctx.ellipse(sx,ground,s*.75,Math.max(2,s*.16),0,0,Math.PI*2);ctx.fill();}
    if(k==="chandelier"){
      const y=horizon-base*.4;ctx.strokeStyle="#3d352c";ctx.lineWidth=Math.max(1,s*.06);ctx.beginPath();ctx.moveTo(sx,y-s*1.3);ctx.lineTo(sx,y);ctx.stroke();ctx.beginPath();ctx.ellipse(sx,y,s*.9,s*.22,0,0,Math.PI*2);ctx.stroke();
      for(let i=-2;i<=2;i++){const x=sx+i*s*.35;ctx.fillStyle="#d8c07a";ctx.fillRect(x-1,y-s*.2,2,s*.22);const g=ctx.createRadialGradient(x,y-s*.24,0,x,y-s*.24,s*.4);g.addColorStop(0,"rgba(255,214,107,.85)");g.addColorStop(1,"rgba(255,150,45,0)");ctx.fillStyle=g;ctx.fillRect(x-s*.4,y-s*.64,s*.8,s*.8);}
    }else if(k==="candelabra"){
      ctx.strokeStyle="#786448";ctx.lineWidth=Math.max(1,s*.08);ctx.beginPath();ctx.moveTo(sx,ground);ctx.lineTo(sx,ground-s*1.2);ctx.moveTo(sx-s*.4,ground-s*.8);ctx.lineTo(sx+s*.4,ground-s*.8);ctx.stroke();
      for(let i=-1;i<=1;i++){const x=sx+i*s*.4,y=ground-s*(i===0?1.22:.84);ctx.fillStyle="#e4ce94";ctx.fillRect(x-1,y,2,s*.2);ctx.fillStyle="#ffc85f";ctx.beginPath();ctx.arc(x,y-2,Math.max(1,s*.07),0,Math.PI*2);ctx.fill();}
    }else if(k==="banner"){
      ctx.fillStyle="#44232c";ctx.beginPath();ctx.moveTo(sx-s*.45,ground-s*1.55);ctx.lineTo(sx+s*.45,ground-s*1.55);ctx.lineTo(sx+s*.34,ground-s*.2);ctx.lineTo(sx,ground-s*.45);ctx.lineTo(sx-s*.34,ground-s*.2);ctx.closePath();ctx.fill();ctx.strokeStyle="#a58a5c";ctx.strokeRect(sx-s*.45,ground-s*1.55,s*.9,s*.12);
    }else if(k==="barrel"){
      ctx.fillStyle="#523b2d";ctx.fillRect(sx-s*.45,ground-s*.85,s*.9,s*.85);ctx.strokeStyle="#8b7251";ctx.lineWidth=Math.max(1,s*.06);ctx.strokeRect(sx-s*.45,ground-s*.85,s*.9,s*.85);ctx.beginPath();ctx.moveTo(sx-s*.46,ground-s*.62);ctx.lineTo(sx+s*.46,ground-s*.62);ctx.moveTo(sx-s*.46,ground-s*.2);ctx.lineTo(sx+s*.46,ground-s*.2);ctx.stroke();
    }else if(k==="bookPile"){
      for(let i=0;i<4;i++){ctx.fillStyle=i%2?"#684444":"#4b5360";ctx.fillRect(sx-s*(.55-i*.04),ground-s*(.18+i*.16),s*(1.1-i*.08),s*.14);}
    }else if(k==="deadTree"){
      ctx.strokeStyle="#352c27";ctx.lineWidth=Math.max(2,s*.22);ctx.beginPath();ctx.moveTo(sx,ground);ctx.lineTo(sx,ground-s*1.8);ctx.lineTo(sx-s*.6,ground-s*2.35);ctx.moveTo(sx,ground-s*1.45);ctx.lineTo(sx+s*.75,ground-s*2.05);ctx.stroke();
    }else if(k==="carriage"){
      ctx.fillStyle="#342b28";ctx.fillRect(sx-s*.9,ground-s*.9,s*1.8,s*.72);ctx.fillStyle="#171516";for(const x of [sx-s*.62,sx+s*.62]){ctx.beginPath();ctx.arc(x,ground-s*.05,s*.32,0,Math.PI*2);ctx.fill();ctx.strokeStyle="#756650";ctx.stroke();}
    }else if(k==="fern"||k==="algae"||k==="reeds"){
      const wet=k!=="fern";ctx.strokeStyle=wet?"#3f806e":"#527a45";ctx.lineWidth=Math.max(1,s*.05);
      for(let i=-4;i<=4;i++){ctx.beginPath();ctx.moveTo(sx,ground);ctx.quadraticCurveTo(sx+i*s*.12,ground-s*.45,sx+i*s*.22,ground-s*(.7+Math.abs(i)*.06));ctx.stroke();}
    }else if(k==="mushroom"){
      for(let i=-2;i<=2;i++){const x=sx+i*s*.24,hh=s*(.28+((i+3)%2)*.12);ctx.fillStyle="#c7b9a0";ctx.fillRect(x-1,ground-hh,2,hh);ctx.fillStyle=i%2?"#8e443b":"#b47c55";ctx.beginPath();ctx.arc(x,ground-hh,s*.17,Math.PI,0);ctx.fill();}
    }else if(k==="stump"){
      ctx.fillStyle="#4a3b2b";ctx.fillRect(sx-s*.42,ground-s*.65,s*.84,s*.65);ctx.fillStyle="#80684b";ctx.beginPath();ctx.ellipse(sx,ground-s*.65,s*.43,s*.13,0,0,Math.PI*2);ctx.fill();
    }else if(k==="roots"){
      ctx.strokeStyle="#3e3326";ctx.lineWidth=Math.max(2,s*.12);for(let i=-3;i<=3;i++){ctx.beginPath();ctx.moveTo(sx,ground-s*.6);ctx.quadraticCurveTo(sx+i*s*.24,ground-s*.25,sx+i*s*.5,ground);ctx.stroke();}
    }else if(k==="totem"){
      ctx.fillStyle="#49392c";ctx.fillRect(sx-s*.16,ground-s*1.7,s*.32,s*1.7);for(let i=0;i<4;i++){ctx.fillStyle=i%2?"#7f4935":"#8d7551";ctx.beginPath();ctx.arc(sx,ground-s*(.35+i*.38),s*(.18+i*.025),0,Math.PI*2);ctx.fill();eyeDot(sx-s*.06,ground-s*(.37+i*.38),s*.022,"#c7a96e");eyeDot(sx+s*.06,ground-s*(.37+i*.38),s*.022,"#c7a96e");}
    }else if(k==="skullPile"){
      for(let i=0;i<7;i++){const x=sx+(i%4-1.5)*s*.22,y=ground-s*(.15+Math.floor(i/4)*.22);ctx.fillStyle="#b7aa8f";ctx.beginPath();ctx.arc(x,y,s*.15,0,Math.PI*2);ctx.fill();ctx.fillStyle="#27211d";ctx.fillRect(x-s*.07,y-s*.04,s*.04,s*.04);ctx.fillRect(x+s*.03,y-s*.04,s*.04,s*.04);}
    }else if(k==="ancientTree"){
      ctx.strokeStyle="#352a22";ctx.lineWidth=Math.max(3,s*.4);ctx.beginPath();ctx.moveTo(sx,ground);ctx.lineTo(sx,ground-s*2.2);ctx.stroke();for(let i=-4;i<=4;i++)limb(sx,ground-s*(1.2+Math.abs(i)*.12),sx+i*s*.42,ground-s*(1.7+(i%2)*.25),s*.12,"#403126");
    }else if(k==="sunkenCross"){
      ctx.strokeStyle="#596968";ctx.lineWidth=Math.max(2,s*.14);ctx.beginPath();ctx.moveTo(sx,ground);ctx.lineTo(sx-s*.12,ground-s*1.35);ctx.moveTo(sx-s*.46,ground-s*.92);ctx.lineTo(sx+s*.3,ground-s*1.0);ctx.stroke();
    }else if(k==="gargoyle"){
      ctx.fillStyle="#55565a";ctx.beginPath();ctx.ellipse(sx,ground-s*.55,s*.38,s*.48,0,0,Math.PI*2);ctx.fill();poly([[sx-s*.22,ground-s*.72],[sx-s*.78,ground-s*1.18],[sx-s*.48,ground-s*.43]],"#4b4c50");poly([[sx+s*.22,ground-s*.72],[sx+s*.78,ground-s*1.18],[sx+s*.48,ground-s*.43]],"#4b4c50");eyeDot(sx-s*.12,ground-s*.66,s*.035,"#d4d6d8");eyeDot(sx+s*.12,ground-s*.66,s*.035,"#d4d6d8");
    }else if(k==="brokenSpire"){
      ctx.fillStyle="#3f4145";ctx.beginPath();ctx.moveTo(sx-s*.35,ground);ctx.lineTo(sx-s*.16,ground-s*1.65);ctx.lineTo(sx+s*.06,ground-s*1.2);ctx.lineTo(sx+s*.34,ground);ctx.fill();ctx.strokeStyle="#8b8d92";ctx.beginPath();ctx.moveTo(sx-s*.08,ground-s*.25);ctx.lineTo(sx+s*.15,ground-s*1.0);ctx.stroke();
    }else if(k==="chain"){
      ctx.strokeStyle="#55545a";ctx.lineWidth=Math.max(1,s*.08);for(let i=0;i<7;i++){ctx.beginPath();ctx.ellipse(sx,ground-s*(.2+i*.22),s*.11,s*.17,i%2?0:Math.PI/2,0,Math.PI*2);ctx.stroke();}
    }else if(k==="pew"){
      ctx.fillStyle="#493529";ctx.fillRect(sx-s*.75,ground-s*.55,s*1.5,s*.18);ctx.fillRect(sx-s*.72,ground-s*.9,s*1.44,s*.12);ctx.fillRect(sx-s*.62,ground-s*.5,s*.12,s*.5);ctx.fillRect(sx+s*.5,ground-s*.5,s*.12,s*.5);
    }else if(k==="bell"){
      ctx.fillStyle="#6f6654";ctx.beginPath();ctx.moveTo(sx-s*.42,ground-s*.3);ctx.quadraticCurveTo(sx-s*.25,ground-s*1.35,sx,ground-s*1.45);ctx.quadraticCurveTo(sx+s*.25,ground-s*1.35,sx+s*.42,ground-s*.3);ctx.fill();ctx.fillStyle="#2d2924";ctx.beginPath();ctx.arc(sx,ground-s*.25,s*.11,0,Math.PI*2);ctx.fill();
    }else if(k==="marketStall"){
      ctx.fillStyle="#4b382c";ctx.fillRect(sx-s*.72,ground-s*.75,s*1.44,s*.12);ctx.fillRect(sx-s*.64,ground-s*.72,s*.1,s*.72);ctx.fillRect(sx+s*.54,ground-s*.72,s*.1,s*.72);poly([[sx-s*.82,ground-s*.78],[sx-s*.62,ground-s*1.18],[sx+s*.62,ground-s*1.18],[sx+s*.82,ground-s*.78]],"#62504a");
    }else if(k==="unfinishedStatue"){
      ctx.fillStyle="#777872";ctx.fillRect(sx-s*.28,ground-s*1.2,s*.56,s*1.2);ctx.fillStyle="#4b4d4b";ctx.fillRect(sx,ground-s*1.2,s*.28,s*1.2);ctx.strokeStyle="#9b978b";ctx.beginPath();ctx.moveTo(sx-s*.28,ground-s*.5);ctx.lineTo(sx+s*.28,ground-s*.65);ctx.stroke();
    }else if(k==="coffin"){
      poly([[sx-s*.32,ground],[sx-s*.48,ground-s*.9],[sx,ground-s*1.35],[sx+s*.48,ground-s*.9],[sx+s*.32,ground]],"#595954");ctx.strokeStyle="#959086";ctx.strokeRect(sx-s*.04,ground-s*1.05,s*.08,s*.65);ctx.strokeRect(sx-s*.22,ground-s*.8,s*.44,s*.08);
    }else if(k==="conveyor"){
      ctx.fillStyle="#3e3d40";ctx.fillRect(sx-s*.85,ground-s*.55,s*1.7,s*.24);ctx.strokeStyle="#777175";for(let i=-3;i<=3;i++){ctx.beginPath();ctx.arc(sx+i*s*.24,ground-s*.43,s*.1,0,Math.PI*2);ctx.stroke();}ctx.fillStyle="#8b3945";ctx.fillRect(sx-s*.75,ground-s*.73,s*1.5,s*.12);
    }else if(k==="heartMass"){
      ctx.fillStyle="#79283a";ctx.beginPath();ctx.arc(sx-s*.18,ground-s*.78,s*.38,0,Math.PI*2);ctx.arc(sx+s*.18,ground-s*.78,s*.38,0,Math.PI*2);ctx.lineTo(sx,ground-s*.08);ctx.fill();ctx.strokeStyle="#b64d5d";for(let i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(sx,ground-s*.5);ctx.lineTo(sx+i*s*.35,ground-s*(1.15+Math.abs(i)*.1));ctx.stroke();}
    }else if(k==="telescope"){
      ctx.strokeStyle="#b8aa86";ctx.lineWidth=Math.max(2,s*.2);ctx.beginPath();ctx.moveTo(sx-s*.55,ground-s*1.35);ctx.lineTo(sx+s*.45,ground-s*.72);ctx.stroke();ctx.fillStyle="#6c6c70";ctx.beginPath();ctx.arc(sx-s*.55,ground-s*1.35,s*.22,0,Math.PI*2);ctx.fill();for(const side of [-1,1])limb(sx,ground-s*.65,sx+side*s*.4,ground,s*.07,"#72644f");
    }else if(k==="relicPedestal"){
      ctx.fillStyle="#d0c7b2";ctx.fillRect(sx-s*.35,ground-s*.72,s*.7,s*.72);ctx.fillRect(sx-s*.48,ground-s*.82,s*.96,s*.13);const g=ctx.createRadialGradient(sx,ground-s*1.05,0,sx,ground-s*1.05,s*.6);g.addColorStop(0,"rgba(244,211,112,.5)");g.addColorStop(1,"rgba(244,211,112,0)");ctx.fillStyle=g;ctx.fillRect(sx-s*.7,ground-s*1.75,s*1.4,s*1.4);
    }else if(k==="throne"){
      ctx.fillStyle=chapterIndex===5?"#d8caa3":"#555057";ctx.fillRect(sx-s*.52,ground-s*1.45,s*1.04,s*1.45);ctx.fillRect(sx-s*.78,ground-s*.65,s*.28,s*.65);ctx.fillRect(sx+s*.5,ground-s*.65,s*.28,s*.65);ctx.fillStyle="#9f8247";ctx.fillRect(sx-s*.46,ground-s*1.35,s*.92,s*.08);
    }else if(k==="statue"||k==="angelStatue"){
      ctx.fillStyle=k==="angelStatue"?"#c8c1ad":"#777873";ctx.fillRect(sx-s*.5,ground-s*.15,s, s*.15);ctx.beginPath();ctx.moveTo(sx-s*.28,ground-s*.25);ctx.lineTo(sx-s*.18,ground-s*1.45);ctx.lineTo(sx+s*.18,ground-s*1.45);ctx.lineTo(sx+s*.35,ground-s*.25);ctx.fill();ctx.beginPath();ctx.arc(sx,ground-s*1.62,s*.22,0,Math.PI*2);ctx.fill();
      if(k==="angelStatue"){ctx.strokeStyle="#d8d0b9";ctx.lineWidth=Math.max(1,s*.08);ctx.beginPath();ctx.moveTo(sx,ground-s*1.2);ctx.lineTo(sx-s*.75,ground-s*1.55);ctx.moveTo(sx,ground-s*1.2);ctx.lineTo(sx+s*.75,ground-s*1.55);ctx.stroke();}
    }else if(k==="column"||k==="marbleColumn"){
      const col=k==="marbleColumn"?"#c8bea6":"#77756e";ctx.fillStyle=col;ctx.fillRect(sx-s*.28,ground-s*1.85,s*.56,s*1.85);ctx.fillRect(sx-s*.43,ground-s*1.92,s*.86,s*.16);ctx.fillRect(sx-s*.4,ground-s*.12,s*.8,s*.12);ctx.fillStyle="rgba(255,255,255,.15)";ctx.fillRect(sx-s*.16,ground-s*1.8,s*.08,s*1.6);
    }else if(k==="rubble"||k==="ore"){
      ctx.fillStyle=k==="ore"?"#843f3f":"#686762";for(let i=0;i<6;i++){const x=sx+(i-2.5)*s*.2;ctx.beginPath();ctx.moveTo(x-s*.22,ground);ctx.lineTo(x,ground-s*(.25+(i%3)*.12));ctx.lineTo(x+s*.24,ground);ctx.fill();}
    }else if(k==="crystal"){
      const g=ctx.createRadialGradient(sx,ground-s*.5,0,sx,ground-s*.5,s*1.2);g.addColorStop(0,"rgba(230,65,80,.45)");g.addColorStop(1,"rgba(180,20,45,0)");ctx.fillStyle=g;ctx.fillRect(sx-s*1.3,ground-s*1.8,s*2.6,s*2);
      ctx.fillStyle="#b9495a";for(let i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(sx+i*s*.2,ground);ctx.lineTo(sx+i*s*.12,ground-s*(.65+Math.abs(i)*.2));ctx.lineTo(sx+(i+.45)*s*.2,ground);ctx.fill();}
    }else if(k==="timber"){
      ctx.fillStyle="#493327";ctx.fillRect(sx-s*.58,ground-s*1.75,s*.14,s*1.75);ctx.fillRect(sx+s*.44,ground-s*1.75,s*.14,s*1.75);ctx.fillRect(sx-s*.62,ground-s*1.78,s*1.24,s*.16);
    }else if(k==="fountain"){
      ctx.fillStyle="#bdb6a5";ctx.beginPath();ctx.ellipse(sx,ground-s*.18,s*.82,s*.28,0,0,Math.PI*2);ctx.fill();ctx.fillRect(sx-s*.12,ground-s*.92,s*.24,s*.72);ctx.strokeStyle="#7cc0d5";ctx.lineWidth=Math.max(1,s*.05);for(let i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(sx,ground-s*.9);ctx.quadraticCurveTo(sx+i*s*.3,ground-s*.65,sx+i*s*.35,ground-s*.22);ctx.stroke();}
    }
    ctx.restore();
  }

  function drawCorpse(e,sx,horizon,base,d,now,c){
    const s=Math.max(4,base*.16),y=horizon+base*.43,fade=Math.max(.22,1-d/14);
    ctx.save();ctx.globalAlpha=fade;ctx.fillStyle="rgba(0,0,0,.38)";ctx.beginPath();ctx.ellipse(sx,y,s*.9,s*.18,0,0,Math.PI*2);ctx.fill();
    if(chapterIndex===0){ctx.fillStyle="#651b28";ctx.beginPath();ctx.ellipse(sx,y-s*.05,s*.72,s*.16,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle="#9a7668";for(let i=-3;i<=3;i++){ctx.beginPath();ctx.moveTo(sx+i*s*.13,y-s*.08);ctx.lineTo(sx+i*s*.2,y-s*(.3+Math.abs(i)*.03));ctx.stroke();}}
    else if(chapterIndex===1){ctx.strokeStyle="#493b29";ctx.lineWidth=Math.max(1,s*.1);for(let i=-4;i<=4;i++){ctx.beginPath();ctx.moveTo(sx,y-s*.08);ctx.lineTo(sx+i*s*.2,y-s*(.32+Math.abs(i)*.03));ctx.stroke();}ctx.fillStyle="#5f3b2e";ctx.beginPath();ctx.arc(sx,y-s*.1,s*.22,0,Math.PI*2);ctx.fill();}
    else if(chapterIndex===2){ctx.fillStyle="#415f61";ctx.beginPath();ctx.ellipse(sx,y-s*.08,s*.78,s*.2,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle="#4c8c78";for(let i=-3;i<=3;i++){ctx.beginPath();ctx.moveTo(sx+i*s*.18,y);ctx.lineTo(sx+i*s*.24,y-s*.35);ctx.stroke();}}
    else if(chapterIndex===3){ctx.fillStyle="#74736e";for(let i=-3;i<=3;i++){ctx.beginPath();ctx.moveTo(sx+i*s*.18-s*.16,y);ctx.lineTo(sx+i*s*.18,y-s*(.22+(i%2)*.1));ctx.lineTo(sx+i*s*.18+s*.17,y);ctx.fill();if(i===0)eyeDot(sx,y-s*.16,s*.035,"#d3c2a5");}}
    else if(chapterIndex===4){ctx.fillStyle="#a23248";for(let i=-4;i<=4;i++){ctx.beginPath();ctx.moveTo(sx+i*s*.13-s*.1,y);ctx.lineTo(sx+i*s*.13,y-s*(.35+Math.abs(i)*.08));ctx.lineTo(sx+i*s*.13+s*.12,y);ctx.fill();if(i%3===0){eyeDot(sx+i*s*.13,y-s*.17,s*.025,"#d3aaa0");}}}
    else{ctx.fillStyle="#d6d0c1";for(let i=-3;i<=3;i++){ctx.beginPath();ctx.moveTo(sx+i*s*.18-s*.17,y);ctx.lineTo(sx+i*s*.18,y-s*(.22+(i%2)*.08));ctx.lineTo(sx+i*s*.18+s*.16,y);ctx.fill();}ctx.fillStyle="#7e2338";ctx.beginPath();ctx.ellipse(sx,y-s*.1,s*.34,s*.13,0,0,Math.PI*2);ctx.fill();}
    ctx.restore();
  }

  function drawProjectile(e,sx,horizon,base,d,c){
    const size=Math.max(2,base*.035),y=horizon+base*.12;ctx.save();ctx.globalAlpha=Math.max(.4,1-d/14);ctx.translate(sx,y);ctx.rotate(e.a-player.a);
    ctx.strokeStyle=e.projectileType==="revolver"?"#ffd27b":e.projectileType==="bow"?"#b9d38b":"#d9c7a1";ctx.lineWidth=Math.max(1,size*.22);ctx.beginPath();ctx.moveTo(-size*2.8,0);ctx.lineTo(size*2.8,0);ctx.stroke();ctx.fillStyle="#d7d0c0";ctx.beginPath();ctx.moveTo(size*3.4,0);ctx.lineTo(size*2.2,-size*.5);ctx.lineTo(size*2.2,size*.5);ctx.fill();ctx.restore();
  }

  function drawMerchant(e,sx,horizon,base,d,now,c){
    const h=base*1.05,w=h*.44,y=horizon+base*.43-h;ctx.save();ctx.globalAlpha=Math.max(.35,1-d/14);ctx.fillStyle="rgba(0,0,0,.35)";ctx.beginPath();ctx.ellipse(sx,horizon+base*.43,w*.7,base*.07,0,0,Math.PI*2);ctx.fill();
    const robe=ctx.createLinearGradient(sx-w/2,0,sx+w/2,0);robe.addColorStop(0,"#241c2d");robe.addColorStop(.5,"#5b4368");robe.addColorStop(1,"#201927");ctx.fillStyle=robe;ctx.beginPath();ctx.moveTo(sx-w*.18,y+h*.16);ctx.lineTo(sx-w*.58,y+h*.95);ctx.lineTo(sx+w*.58,y+h*.95);ctx.lineTo(sx+w*.18,y+h*.16);ctx.fill();ctx.fillStyle="#171319";ctx.beginPath();ctx.arc(sx,y+h*.16,w*.3,0,Math.PI*2);ctx.fill();eyeDot(sx-w*.09,y+h*.16,w*.028,"#c6a7db");eyeDot(sx+w*.09,y+h*.16,w*.028,"#c6a7db");ctx.strokeStyle="#b7a06c";ctx.lineWidth=Math.max(1,w*.035);ctx.beginPath();ctx.moveTo(sx+w*.4,y+h*.25);ctx.lineTo(sx+w*.65,y+h*.95);ctx.stroke();ctx.fillStyle="#b88cff";ctx.beginPath();ctx.arc(sx+w*.4,y+h*.24,w*.07+Math.sin(now*.004)*w*.01,0,Math.PI*2);ctx.fill();ctx.restore();
  }

  function renderWeapon(c,now) {
    const w=canvas.width,h=canvas.height;
    const id=campaign.currentWeapon;
    const weapon=weapons[id]||weapons.spear;
    const bobX=Math.cos(player.bob*.5)*5, bobY=Math.abs(Math.sin(player.bob))*4;
    const swingArc=attackAnim>0?Math.sin((1-Math.min(1,attackAnim))*Math.PI):0;
    const swing=swingArc*(player.lastAttackHeavy?96:54),side=player.attackSide?1:-1;
    ctx.save();ctx.translate(w*.63+bobX+(player.lastAttackHeavy?0:side*swing*.75),h+18+bobY-swing*(player.lastAttackHeavy ? .7 : .28));ctx.rotate(-.55+(player.lastAttackHeavy?swing*.014:side*swing*.01));
    const metal=ctx.createLinearGradient(-12,0,12,0);metal.addColorStop(0,color(weapon.tint,.32));metal.addColorStop(.48,color(weapon.tint,1.18));metal.addColorStop(1,color(weapon.tint,.42));
    if(id==="bow"){
      const pull=attackAnim>0?swingArc*26:0;ctx.strokeStyle=color(weapon.tint,.9);ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(0,-145);ctx.quadraticCurveTo(58,-72,0,8);ctx.stroke();
      ctx.strokeStyle="rgba(230,220,190,.82)";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,-145);ctx.lineTo(-pull,-70);ctx.lineTo(0,8);ctx.stroke();
      ctx.fillStyle="#9c8b66";ctx.fillRect(-2,-138,4,150);
    }else if(id==="crossbow"){
      const reloadProgress=Math.max(0,Math.min(1,(player.reloadUntil-performance.now())/(weapon.reload*1000)));
      ctx.fillStyle="#5c402c";ctx.fillRect(-9,-120,18,160);ctx.fillStyle=color(weapon.tint,.85);ctx.fillRect(-61,-104,122,8);
      ctx.strokeStyle="rgba(230,220,190,.78)";ctx.beginPath();ctx.moveTo(-61,-104);ctx.lineTo(0,-77+reloadProgress*38);ctx.lineTo(61,-104);ctx.stroke();
      ctx.fillStyle="#b8a57c";ctx.fillRect(-2,-145,4,90);
    }else if(id==="revolver"){
      ctx.rotate(.48);ctx.fillStyle=metal;ctx.fillRect(-11,-78,22,80);ctx.fillRect(-20,-13,40,28);ctx.beginPath();ctx.arc(0,-16,16,0,Math.PI*2);ctx.fill();
      ctx.fillStyle="#3b2923";ctx.fillRect(-10,8,20,48);ctx.fillStyle=color(weapon.tint,1.12);ctx.fillRect(-6,-76,12,3);
    }else if(id==="axe"||id==="greataxe"){
      const big=id==="greataxe";ctx.fillStyle="#4a3125";ctx.fillRect(-6,-142,12,184);ctx.fillStyle=metal;
      ctx.beginPath();ctx.moveTo(-4,-139);ctx.lineTo(big?-54:-39,big?-132:-128);ctx.lineTo(big?-45:-31,big?-88:-99);ctx.lineTo(-4,-106);ctx.closePath();ctx.fill();
      if(big){ctx.beginPath();ctx.moveTo(4,-139);ctx.lineTo(48,-127);ctx.lineTo(39,-91);ctx.lineTo(4,-106);ctx.closePath();ctx.fill();}
    }else{
      const short=id==="blades", spear=id==="spear";
      ctx.fillStyle=metal;ctx.beginPath();ctx.moveTo(0,spear?-188:short?-118:-171);ctx.lineTo(spear?7:short?10:8,-92);ctx.lineTo(7,8);ctx.lineTo(-7,8);ctx.lineTo(spear?-7:short?-10:-8,-92);ctx.closePath();ctx.fill();
      ctx.strokeStyle=rgba(c.light,.45);ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-1,spear?-181:short?-112:-164);ctx.lineTo(-2,2);ctx.stroke();
      ctx.fillStyle=color(c.wallAlt,.64);ctx.fillRect(-23,-5,46,7);ctx.fillStyle="#241d1a";ctx.fillRect(-9,1,18,44);
      if(id==="blades"){
        ctx.save();ctx.translate(-w*.26,10);ctx.rotate(1.05);ctx.fillStyle=metal;ctx.beginPath();ctx.moveTo(0,-116);ctx.lineTo(9,-70);ctx.lineTo(7,20);ctx.lineTo(-7,20);ctx.lineTo(-9,-70);ctx.closePath();ctx.fill();ctx.restore();
      }
    }
    ctx.restore();
  }

  function loop(now) {
    const dt=Math.min(.04,(now-lastTime)/1000||0);lastTime=now;
    update(dt,now);render(now);requestAnimationFrame(loop);
  }

  addEventListener("keydown", (event) => {
    keys[event.code]=true;
    if (["Space","ArrowLeft","ArrowRight","Tab"].includes(event.code)) event.preventDefault();
    if (event.code==="Space") attack();
    if (event.code==="KeyE" && !event.repeat) interact();
    if (event.code==="KeyH" && !event.repeat) useHerb();
    if (/^Digit[1-9]$/.test(event.code) && !event.repeat) selectWeapon(Number(event.code.slice(5))-1);
    if (event.code==="Tab" && !event.repeat) mode==="playing"?openJournal():mode==="journal"&&resumeGame();
    if (event.code==="Escape" && !event.repeat) {
      if (mode==="playing") pauseGame(); else if (mode==="paused"||mode==="journal") resumeGame(); else if(mode==="shop")closeShop();
    }
  });
  addEventListener("keyup", (event) => { keys[event.code]=false; });
  addEventListener("blur", () => { Object.keys(keys).forEach(k=>keys[k]=false); if(mode==="playing") pauseGame(); });
  addEventListener("mousemove", (event) => {
    if (mode==="playing" && document.pointerLockElement===canvas) mouseTurn += event.movementX*.0024;
  });
  canvas.addEventListener("mousedown", (event) => {
    if (mode!=="playing") return;
    initAudio();
    if (document.pointerLockElement!==canvas) canvas.requestPointerLock?.();
    if (event.button===0) attack();
    if (event.button===2) attack(true);
  });
  canvas.addEventListener("contextmenu", e=>e.preventDefault());
  canvas.addEventListener("wheel",event=>{
    if(mode!=="playing")return;event.preventDefault();
    const owned=weaponOrder.filter(id=>campaign.weapons.includes(id));
    const current=Math.max(0,owned.indexOf(campaign.currentWeapon));
    campaign.currentWeapon=owned[(current+(event.deltaY>0?1:-1)+owned.length)%owned.length];updateWeaponHUD();
  },{passive:false});

  $("#new-game").addEventListener("click",()=>{
    initAudio();clearSave();stats={kills:0,notes:0,deaths:0};campaign={weapons:["spear"],ammo:{bolt:5,arrow:0,bullet:0},relics:[],journal:[],silver:0,currentWeapon:"spear",herbs:1,difficulty:selectedDifficulty};pendingZone=0;gameStartedAt=Date.now();showStory(-1);
  });
  $("#continue-game").addEventListener("click",()=>{
    initAudio();const save=loadSave();if(save){stats=save.stats||stats;campaign=save.campaign||campaign;selectedDifficulty=campaign.difficulty||"normal";updateDifficultyButton();pendingZone=save.zone||0;gameStartedAt=save.started||Date.now();if(save.hub)startHub(save.chapter||0);else startChapter(save.chapter||0,save.zone||0);if((save.version||0)>=SAVE_VERSION){restoreRuntime(save.runtime);saveGame();}else migrateLegacyRuntime(save.runtime);}
  });
  $("#difficulty-button").addEventListener("click",()=>{const order=["easy","normal","hard","nightmare"],index=order.indexOf(selectedDifficulty);selectedDifficulty=order[(index+1)%order.length];updateDifficultyButton();});
  $("#story-continue").addEventListener("click",()=>startChapter(pendingChapter,pendingZone));
  $("#controls-button").addEventListener("click",()=>showScreen("controls-screen"));
  $("#controls-back").addEventListener("click",()=>showScreen("title-screen"));
  $("#resume-game").addEventListener("click",resumeGame);
  $("#journal-close").addEventListener("click",resumeGame);
  $("#shop-close").addEventListener("click",closeShop);
  document.querySelectorAll("[data-shop]").forEach(button=>button.addEventListener("click",()=>buyShopItem(button.dataset.shop)));
  $("#restart-chapter").addEventListener("click",()=>startChapter(chapterIndex,0));
  $("#retry").addEventListener("click",()=>startChapter(chapterIndex,zoneIndex));
  $("#return-title").addEventListener("click",returnToTitle);
  $("#death-title").addEventListener("click",returnToTitle);
  $("#ending-title").addEventListener("click",returnToTitle);

  function returnToTitle(){saveGame();stopAmbientSound();mode="title";hud.classList.add("hidden");document.exitPointerLock?.();showScreen("title-screen");}

  addEventListener("pagehide",()=>saveGame());
  addEventListener("beforeunload",()=>saveGame());
  document.addEventListener?.("visibilitychange",()=>{if(document.visibilityState==="hidden")saveGame();});
  updateDifficultyButton();
  if(loadSave()) $("#continue-game").classList.remove("hidden");
  requestAnimationFrame(loop);
})();
