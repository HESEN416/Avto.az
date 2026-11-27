import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "az" | "en" | "ru";
export const LANGS: Lang[] = ["az", "en", "ru"];
const KEY = "avto-lang";

/** Keys are the Azerbaijani source strings; AZ is the default and the fallback. */
const DICT: Record<string, [en: string, ru: string]> = {
  // nav / header / footer
  "Ana səhifə": ["Home", "Главная"],
  Kataloq: ["Catalog", "Каталог"],
  Markalar: ["Brands", "Марки"],
  Müqayisə: ["Compare", "Сравнение"],
  "Öz nömrəm": ["My plate", "Мой номер"],
  "Əsas menyu": ["Main menu", "Главное меню"],
  "Dil seçimi": ["Language", "Язык"],
  "Tünd rejimə keç": ["Switch to dark mode", "Тёмная тема"],
  "İşıqlı rejimə keç": ["Switch to light mode", "Светлая тема"],
  "Məlumat və texniki ensiklopediya kataloqu. Göstəricilər təxminidir və versiyadan asılı dəyişə bilər.": [
    "An information and technical encyclopedia catalog. Figures are approximate and may vary by version.",
    "Информационный и технический каталог-энциклопедия. Показатели приблизительны и зависят от версии.",
  ],
  "Fotolar: Wikimedia Commons": ["Photos: Wikimedia Commons", "Фото: Wikimedia Commons"],
  "Müqayisəyə bax": ["View comparison", "К сравнению"],
  "Maksimum {n} avtomobil müqayisə etmək olar": ["You can compare up to {n} cars", "Можно сравнить не более {n} авто"],
  "Yenisini əlavə etmək üçün birini çıxarın.": ["Remove one to add another.", "Удалите одно, чтобы добавить новое."],
  // hero
  "Qlobal avtomobil ensiklopediyası": ["Global car encyclopedia", "Глобальная автоэнциклопедия"],
  "Avtomobili tanı.": ["Know the car.", "Узнай автомобиль."],
  "Tarixini oxu.": ["Read its story.", "Прочитай его историю."],
  "10 məşhur markanın klassik və yeni nəsil modelləri: real zavod fotoları, mühərrik və performans göstəriciləri, ölçülər və hər modelin qısa tarixçəsi — bir yerdə.": [
    "Classic and new-generation models from 10 famous brands: real factory photos, engine and performance figures, dimensions and a short history of every model — in one place.",
    "Классические и новые модели 10 известных марок: реальные заводские фото, характеристики двигателя и динамики, габариты и краткая история каждой модели — в одном месте.",
  ],
  "Kataloqa bax": ["Browse catalog", "Открыть каталог"],
  "Markaları kəşf et": ["Explore brands", "Обзор марок"],
  Marka: ["Brand", "Марка"],
  "Model və nəsil": ["Models & generations", "Модели и поколения"],
  Dövr: ["Period", "Период"],
  "Seçilmiş model": ["Featured model", "Избранная модель"],
  "Seçilmiş modellər": ["Featured models", "Избранные модели"],
  "Ətraflı bax": ["Details", "Подробнее"],
  "ətraflı bax": ["details", "подробнее"],
  İstehsal: ["Production", "Выпуск"],
  Güc: ["Power", "Мощность"],
  "Maks. sürət": ["Top speed", "Макс. скорость"],
  Mühərrik: ["Engine", "Двигатель"],
  Yanacaq: ["Fuel", "Топливо"],
  // about
  Haqqımızda: ["About us", "О нас"],
  "Avto.az haqqında": ["About Avto.az", "Об Avto.az"],
  "Avto.az — qlobal avtomobil sənayesinin klassik və müasir modellərini bir araya gətirən məlumat kataloqu və texniki ensiklopediyadır. Layihə heç bir satış və reklam yönümlü məqsəd daşımadan dəqiq texniki göstəriciləri, nəsilləri və zavod foto arxivini təqdim edir.": [
    "Avto.az is an information catalog and technical encyclopedia bringing together classic and modern models of the global car industry. With no sales or advertising goals, it presents accurate technical figures, generations and a factory photo archive.",
    "Avto.az — информационный каталог и техническая энциклопедия, объединяющая классические и современные модели мирового автопрома. Без каких-либо продаж и рекламы проект представляет точные характеристики, поколения и архив заводских фото.",
  ],
  "Dəqiq zavod göstəriciləri": ["Accurate factory figures", "Точные заводские данные"],
  "Klassik və müasir arxiv": ["Classic & modern archive", "Классический и современный архив"],
  "100% məlumat yönümlü": ["100% information-focused", "100% информационный"],
  Əlaqə: ["Contact", "Контакты"],
  "Təklif, texniki qeyd və ya məlumat dəqiqləşdirməsi üçün bizimlə əlaqə saxlayın.": [
    "Get in touch for suggestions, technical notes or data corrections.",
    "Свяжитесь с нами для предложений, технических замечаний или уточнения данных.",
  ],
  "E-poçt": ["Email", "E-mail"],
  Yerləşmə: ["Location", "Расположение"],
  Status: ["Status", "Статус"],
  "Bakı, Azərbaycan": ["Baku, Azerbaijan", "Баку, Азербайджан"],
  "Məlumat və texniki kataloq layihəsi": ["Information & technical catalog project", "Информационно-технический каталог"],
  // catalog
  "Texniki kataloq": ["Technical catalog", "Технический каталог"],
  "Klassik və yeni nəsil modelləri filtrləyin, karta klikləyərək tam məlumat səhifəsini açın.": [
    "Filter classic and new-generation models; click a card to open its full page.",
    "Фильтруйте классические и новые модели; нажмите на карточку, чтобы открыть полную страницу.",
  ],
  "{n} nəticə": ["{n} results", "Результатов: {n}"],
  Sıralama: ["Sort", "Сортировка"],
  "Marka üzrə": ["By brand", "По марке"],
  "Ən yeni": ["Newest", "Новейшие"],
  "Ən köhnə": ["Oldest", "Старейшие"],
  "Ən güclü": ["Most powerful", "Самые мощные"],
  "Ən sürətli (0–100)": ["Quickest (0–100)", "Самые быстрые (0–100)"],
  "Uyğun avtomobil tapılmadı": ["No matching cars", "Подходящих авто не найдено"],
  "Filtrləri genişləndirin və ya sıfırlayın.": ["Widen or reset the filters.", "Расширьте или сбросьте фильтры."],
  "Filtrləri sıfırla": ["Reset filters", "Сбросить фильтры"],
  "Daha çox göstər ({n})": ["Show more ({n})", "Показать ещё ({n})"],
  // filters
  Filtrlər: ["Filters", "Фильтры"],
  "Bütün markalar": ["All brands", "Все марки"],
  "Bütün modellər": ["All models", "Все модели"],
  "Əvvəlcə marka seçin": ["Choose a brand first", "Сначала выберите марку"],
  "İl / Nəsil": ["Year / Generation", "Год / Поколение"],
  "Bütün nəsillər": ["All generations", "Все поколения"],
  "Əvvəlcə model seçin": ["Choose a model first", "Сначала выберите модель"],
  Kateqoriya: ["Category", "Категория"],
  Hamısı: ["All", "Все"],
  Köhnə: ["Classic", "Старые"],
  Yeni: ["New", "Новые"],
  Axtarış: ["Search", "Поиск"],
  "Model və ya nəsil…": ["Model or generation…", "Модель или поколение…"],
  "Ban növü": ["Body type", "Тип кузова"],
  "Bütün ban növləri": ["All body types", "Все кузова"],
  "Yanacaq növü": ["Fuel type", "Тип топлива"],
  "Bütün yanacaq növləri": ["All fuel types", "Все виды топлива"],
  "At gücü aralığı": ["Horsepower range", "Диапазон мощности"],
  Sıfırla: ["Reset", "Сбросить"],
  Sedan: ["Sedan", "Седан"],
  Hetçbek: ["Hatchback", "Хэтчбек"],
  Kupe: ["Coupe", "Купе"],
  Liftbek: ["Liftback", "Лифтбек"],
  Krossover: ["Crossover", "Кроссовер"],
  SUV: ["SUV", "Внедорожник"],
  Benzin: ["Petrol", "Бензин"],
  Dizel: ["Diesel", "Дизель"],
  Hibrid: ["Hybrid", "Гибрид"],
  Elektrik: ["Electric", "Электро"],
  // card / detail
  Sərfiyyat: ["Consumption", "Расход"],
  "Maks.": ["Max", "Макс."],
  Klassik: ["Classic", "Классика"],
  "Yeni nəsil": ["New generation", "Новое поколение"],
  "{n} foto": ["{n} photos", "{n} фото"],
  Müqayisədədir: ["In comparison", "В сравнении"],
  "Müqayisə et": ["Compare", "Сравнить"],
  "Kataloqa qayıt": ["Back to catalog", "Назад в каталог"],
  "Əvvəlki foto": ["Previous photo", "Предыдущее фото"],
  "Növbəti foto": ["Next photo", "Следующее фото"],
  "Müqayisədən çıxar": ["Remove from comparison", "Убрать из сравнения"],
  "Müqayisəyə əlavə et": ["Add to comparison", "Добавить в сравнение"],
  "Qısa tarixçə": ["Short history", "Краткая история"],
  Mərkəz: ["Headquarters", "Штаб-квартира"],
  "Təsis ili": ["Founded", "Год основания"],
  "{b} — digər modellər": ["{b} — other models", "{b} — другие модели"],
  "Tarixçə mətni Azərbaycan dilindədir.": ["History text is in Azerbaijani.", "Текст истории на азербайджанском языке."],
  // specs
  "Mühərrik və Performans": ["Engine & Performance", "Двигатель и динамика"],
  "Mühərrik həcmi": ["Displacement", "Объём двигателя"],
  "At gücü": ["Horsepower", "Мощность"],
  "Fırlanma momenti": ["Torque", "Крутящий момент"],
  "0–100 km/saat": ["0–100 km/h", "0–100 км/ч"],
  "Maksimal sürət": ["Top speed", "Максимальная скорость"],
  "Yanacaq və Məsafə": ["Fuel & Range", "Топливо и запас хода"],
  "Sərfiyyat (orta)": ["Consumption (avg.)", "Расход (средний)"],
  "Yanacaq çəni": ["Fuel tank", "Топливный бак"],
  Batareya: ["Battery", "Батарея"],
  "Məsafə (təxmini)": ["Range (approx.)", "Запас хода (прибл.)"],
  "Ölçülər və Çəki": ["Dimensions & Weight", "Габариты и масса"],
  Uzunluq: ["Length", "Длина"],
  En: ["Width", "Ширина"],
  Hündürlük: ["Height", "Высота"],
  "Təkər bazası": ["Wheelbase", "Колёсная база"],
  Çəki: ["Weight", "Масса"],
  "Baqaj həcmi": ["Trunk volume", "Объём багажника"],
  "Transmissiya və Şassi": ["Transmission & Chassis", "Трансмиссия и шасси"],
  "Sürətlər qutusu": ["Gearbox", "Коробка передач"],
  Ötürücü: ["Drive", "Привод"],
  "Asqı / şassi": ["Suspension / chassis", "Подвеска / шасси"],
  "İstehsal illəri": ["Production years", "Годы выпуска"],
  // compare
  "Müqayisə aləti": ["Comparison tool", "Инструмент сравнения"],
  "Yan-yana müqayisə": ["Side-by-side comparison", "Сравнение бок о бок"],
  "İstənilən marka və ildən {a}–{b} avtomobil seçin. Ən yaxşı göstərici yaşıl rənglə işarələnir.": [
    "Pick {a}–{b} cars of any brand and year. The best figure is highlighted in green.",
    "Выберите {a}–{b} авто любой марки и года. Лучший показатель выделен зелёным.",
  ],
  "Hamısını təmizlə": ["Clear all", "Очистить всё"],
  "{a} / {b} seçilib": ["{a} / {b} selected", "Выбрано {a} / {b}"],
  "Avtomobil əlavə et": ["Add a car", "Добавить авто"],
  "Müqayisə üçün ən azı {n} avtomobil seçin — kataloqdakı “Müqayisə et” düyməsi və ya yuxarıdakı “Avtomobil əlavə et” siyahısı ilə.": [
    "Select at least {n} cars — with the “Compare” button in the catalog or the “Add a car” list above.",
    "Выберите минимум {n} авто — кнопкой «Сравнить» в каталоге или списком «Добавить авто» выше.",
  ],
  // brands
  "10 markanı kəşf et": ["Explore 10 brands", "Откройте 10 марок"],
  "Markaya kliklədikdə kataloq yalnız həmin markanın modelləri ilə açılır.": [
    "Click a brand to open the catalog with only its models.",
    "Нажмите на марку — каталог откроется только с её моделями.",
  ],
  "{m} model · {g} nəsil · {s}": ["{m} models · {g} generations · {s}", "{m} моделей · {g} поколений · {s}"],
  "Kataloqda bax": ["View in catalog", "Смотреть в каталоге"],
  Almaniya: ["Germany", "Германия"],
  "Böyük Britaniya": ["United Kingdom", "Великобритания"],
  Rusiya: ["Russia", "Россия"],
  Çin: ["China", "Китай"],
  İsveç: ["Sweden", "Швеция"],
  Ştutqart: ["Stuttgart", "Штутгарт"],
  Münhen: ["Munich", "Мюнхен"],
  İnqolştadt: ["Ingolstadt", "Ингольштадт"],
  Volfsburq: ["Wolfsburg", "Вольфсбург"],
  Tolyatti: ["Tolyatti", "Тольятти"],
  Şençjen: ["Shenzhen", "Шэньчжэнь"],
  Kru: ["Crewe", "Крю"],
  Qudvud: ["Goodwood", "Гудвуд"],
  Göteborq: ["Gothenburg", "Гётеборг"],
  "Avtomobil tapılmadı": ["Car not found", "Автомобиль не найден"],
  "Bu model kataloqda mövcud deyil.": ["This model is not in the catalog.", "Этой модели нет в каталоге."],
  // plate builder
  "İnteraktiv alət": ["Interactive tool", "Интерактивный инструмент"],
  "Öz nömrəni yarat": ["Design your own plate", "Создай свой номер"],
  "Azərbaycan və digər ölkələrin qeydiyyat nişanı vizualını yaradın və şəkil kimi yükləyin. Yalnız vizual məqsədlidir.": [
    "Create a license plate visual for Azerbaijan and other countries and download it as an image. For visual purposes only.",
    "Создайте изображение номерного знака Азербайджана и других стран и скачайте его. Только для визуализации.",
  ],
  "Ölkə / Standart": ["Country / Standard", "Страна / Стандарт"],
  "Azərbaycan (AZ)": ["Azerbaijan (AZ)", "Азербайджан (AZ)"],
  "Almaniya (DE)": ["Germany (DE)", "Германия (DE)"],
  "ABŞ (US)": ["USA (US)", "США (US)"],
  "Türkiyə (TR)": ["Türkiye (TR)", "Турция (TR)"],
  "BƏƏ / Dubay (AE)": ["UAE / Dubai (AE)", "ОАЭ / Дубай (AE)"],
  "Yaponiya (JP)": ["Japan (JP)", "Япония (JP)"],
  "Şəhər kodu": ["City code", "Код города"],
  Hərflər: ["Letters", "Буквы"],
  Rəqəmlər: ["Digits", "Цифры"],
  Ştat: ["State", "Штат"],
  "İl kodu": ["Province code", "Код провинции"],
  "Kod (hərf)": ["Code (letter)", "Код (буква)"],
  "Bölgə (kanji)": ["Region (kanji)", "Регион (кандзи)"],
  "Sinif kodu": ["Class code", "Код класса"],
  Hiragana: ["Hiragana", "Хирагана"],
  "Qeydiyyat nişanı: {p}": ["License plate: {p}", "Номерной знак: {p}"],
  "Seçilmiş ölkənin formatına uyğun doldurun.": ["Fill in using the selected country's format.", "Заполните в формате выбранной страны."],
  "Bölgə kodu": ["Region code", "Код региона"],
  "Seriya hərfləri": ["Series letters", "Буквы серии"],
  Nömrə: ["Number", "Номер"],
  "Təsadüfi nömrə yarat": ["Generate random plate", "Случайный номер"],
  "Nömrə ölçüsü": ["Plate size", "Размер номера"],
  "Standart uzun (520×110 mm)": ["Standard long (520×110 mm)", "Стандартный длинный (520×110 мм)"],
  "Kvadrat / 2 qat": ["Square / 2 rows", "Квадратный / 2 ряда"],
  Standart: ["Standard", "Стандарт"],
  Çipli: ["With chip", "С чипом"],
  Çipsiz: ["Without chip", "Без чипа"],
  "Şəkil kimi yüklə (PNG)": ["Download as image (PNG)", "Скачать изображение (PNG)"],
  "Şəkil yükləndi": ["Image downloaded", "Изображение скачано"],
  "Azərbaycan dövlət qeydiyyat nişanı: {p}": ["Azerbaijani registration plate: {p}", "Азербайджанский госномер: {p}"],
  "Format: 2 rəqəm — 2 hərf — 3 rəqəm. Yalnız Latın hərfləri (A–Z).": [
    "Format: 2 digits — 2 letters — 3 digits. Latin letters only (A–Z).",
    "Формат: 2 цифры — 2 буквы — 3 цифры. Только латинские буквы (A–Z).",
  ],
};

/** Ordered phrase/unit replacements for generated technical values (gearbox, drive, units…). */
const VALUE_PHRASES: [string, string, string][] = [
  ["Tam ötürücü", "All-wheel drive", "Полный привод"],
  ["Daimi tam ötürücü", "Permanent all-wheel drive", "Постоянный полный привод"],
  ["Arxa ötürücü", "Rear-wheel drive", "Задний привод"],
  ["Ön ötürücü", "Front-wheel drive", "Передний привод"],
  [" pilləli ", "-speed ", "-ступ. "],
  ["Arxada", "Rear:", "Сзади:"],
  ["mexaniki", "manual", "механика"],
  ["avtomat", "automatic", "автомат"],
  ["robot", "dual-clutch", "робот"],
  ["reduktor", "reduction gear", "редуктор"],
  ["paylayıcı qutu", "transfer case", "раздаточная коробка"],
  ["Hər təkərə ayrıca mühərrik", "One motor per wheel", "Отдельный мотор на каждое колесо"],
  ["platforması", "platform", "платформа"],
  ["əsaslı", "based", "на основе"],
  ["hibrid ötürücü", "hybrid transmission", "гибридная трансмиссия"],
  ["diferensial bloku", "differential locks", "блокировки дифференциала"],
  ["mühərrik", "motors", "мотора"],
  ["elektrik", "electric", "электро"],
  ["Ön:", "Front:", "Перед:"],
  ["arxa:", "rear:", "зад:"],
  ["ikiqat ling", "double wishbone", "двойные рычаги"],
  ["çoxlinkli", "multi-link", "многорычажная"],
  ["sərt körpü", "rigid axle", "неразрезной мост"],
  ["torsion tir", "torsion beam", "торсионная балка"],
  ["yarımmüstəqil tir", "semi-independent beam", "полузависимая балка"],
  ["yarımmüstəqil ling", "semi-independent arm", "полузависимый рычаг"],
  ["yarımdartılmış ling", "semi-trailing arm", "полузависимый рычаг"],
  ["inteqral link", "integral link", "интегральный рычаг"],
  ["trapezoid ling", "trapezoidal link", "трапециевидный рычаг"],
  ["dörd linkli", "four-link", "четырёхрычажная"],
  ["beş linkli", "five-link", "пятирычажная"],
  ["5 linkli", "five-link", "пятирычажная"],
  ["üç linkli", "three-link", "трёхрычажная"],
  ["ikilinkli", "dual-link", "двухрычажная"],
  ["müstəqil", "independent", "независимая"],
  ["pnevmatik asqı", "air suspension", "пневмоподвеска"],
  ["Pnevmatik asqı", "Air suspension", "Пневмоподвеска"],
  ["pnevmatik", "air", "пневматическая"],
  ["İki oxlu", "Two-axle", "Двухосная"],
  ["İki kameralı", "Two-chamber", "Двухкамерная"],
  ["Üç kameralı", "Three-chamber", "Трёхкамерная"],
  ["aktiv stabilizatorlar", "active anti-roll bars", "активные стабилизаторы"],
  ["adaptiv amortizatorlar", "adaptive dampers", "адаптивные амортизаторы"],
  ["dörd təkərli sükan", "four-wheel steering", "полноуправляемое шасси"],
  ["seçimlə", "optional", "опция"],
  ["hazırda", "present", "н.в."],
  ["km/saat", "km/h", "км/ч"],
  ["km/s", "km/h", "км/ч"],
  [" a.g.", " hp", " л.с."],
  [" san", " s", " с"],
  [" kq", " kg", " кг"],
  [" sm³", " cc", " см³"],
  ["Elektrik", "Electric", "Электро"],
];

export function translate(lang: Lang, az: string, vars?: Record<string, string | number>): string {
  const entry = DICT[az];
  let s = lang === "az" || !entry ? az : entry[lang === "en" ? 0 : 1];
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
  return s;
}

export function localizeValue(lang: Lang, value: string): string {
  if (lang === "az") return value;
  const i = lang === "en" ? 1 : 2;
  let s = value;
  for (const row of VALUE_PHRASES) s = s.replaceAll(row[0], row[i]);
  return s;
}

interface I18n {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (az: string, vars?: Record<string, string | number>) => string;
  tv: (value: string) => string;
}

const Ctx = createContext<I18n | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("az");

  useEffect(() => {
    const saved = localStorage.getItem(KEY);
    if (saved === "en" || saved === "ru") setLangState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem(KEY, l);
  }, []);

  const value: I18n = {
    lang,
    setLang,
    t: (az, vars) => translate(lang, az, vars),
    tv: (v) => localizeValue(lang, v),
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useT() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useT must be used inside LangProvider");
  return v;
}
