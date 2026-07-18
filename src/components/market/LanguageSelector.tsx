import { useEffect, useMemo, useRef, useState } from "react";
import { Globe2, ChevronDown, Search, Star, Clock, Check, X } from "lucide-react";

type Lang = { code: string; name: string; native: string; flag: string };

// ~130 supported languages. Flags are emoji regional indicators.
const LANGS: Lang[] = [
  { code: "en", name: "English", native: "English", flag: "🇬🇧" },
  { code: "hi", name: "Hindi", native: "हिन्दी", flag: "🇮🇳" },
  { code: "ar", name: "Arabic", native: "العربية", flag: "🇸🇦" },
  { code: "fr", name: "French", native: "Français", flag: "🇫🇷" },
  { code: "de", name: "German", native: "Deutsch", flag: "🇩🇪" },
  { code: "es", name: "Spanish", native: "Español", flag: "🇪🇸" },
  { code: "pt", name: "Portuguese", native: "Português", flag: "🇵🇹" },
  { code: "it", name: "Italian", native: "Italiano", flag: "🇮🇹" },
  { code: "nl", name: "Dutch", native: "Nederlands", flag: "🇳🇱" },
  { code: "ru", name: "Russian", native: "Русский", flag: "🇷🇺" },
  { code: "uk", name: "Ukrainian", native: "Українська", flag: "🇺🇦" },
  { code: "pl", name: "Polish", native: "Polski", flag: "🇵🇱" },
  { code: "tr", name: "Turkish", native: "Türkçe", flag: "🇹🇷" },
  { code: "el", name: "Greek", native: "Ελληνικά", flag: "🇬🇷" },
  { code: "ro", name: "Romanian", native: "Română", flag: "🇷🇴" },
  { code: "hu", name: "Hungarian", native: "Magyar", flag: "🇭🇺" },
  { code: "cs", name: "Czech", native: "Čeština", flag: "🇨🇿" },
  { code: "sk", name: "Slovak", native: "Slovenčina", flag: "🇸🇰" },
  { code: "hr", name: "Croatian", native: "Hrvatski", flag: "🇭🇷" },
  { code: "sr", name: "Serbian", native: "Српски", flag: "🇷🇸" },
  { code: "bs", name: "Bosnian", native: "Bosanski", flag: "🇧🇦" },
  { code: "sl", name: "Slovenian", native: "Slovenščina", flag: "🇸🇮" },
  { code: "bg", name: "Bulgarian", native: "Български", flag: "🇧🇬" },
  { code: "mk", name: "Macedonian", native: "Македонски", flag: "🇲🇰" },
  { code: "sq", name: "Albanian", native: "Shqip", flag: "🇦🇱" },
  { code: "lt", name: "Lithuanian", native: "Lietuvių", flag: "🇱🇹" },
  { code: "lv", name: "Latvian", native: "Latviešu", flag: "🇱🇻" },
  { code: "et", name: "Estonian", native: "Eesti", flag: "🇪🇪" },
  { code: "fi", name: "Finnish", native: "Suomi", flag: "🇫🇮" },
  { code: "sv", name: "Swedish", native: "Svenska", flag: "🇸🇪" },
  { code: "no", name: "Norwegian", native: "Norsk", flag: "🇳🇴" },
  { code: "da", name: "Danish", native: "Dansk", flag: "🇩🇰" },
  { code: "is", name: "Icelandic", native: "Íslenska", flag: "🇮🇸" },
  { code: "ga", name: "Irish", native: "Gaeilge", flag: "🇮🇪" },
  { code: "cy", name: "Welsh", native: "Cymraeg", flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿" },
  { code: "gd", name: "Scottish Gaelic", native: "Gàidhlig", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" },
  { code: "eu", name: "Basque", native: "Euskara", flag: "🇪🇸" },
  { code: "ca", name: "Catalan", native: "Català", flag: "🇪🇸" },
  { code: "gl", name: "Galician", native: "Galego", flag: "🇪🇸" },
  { code: "mt", name: "Maltese", native: "Malti", flag: "🇲🇹" },
  { code: "he", name: "Hebrew", native: "עברית", flag: "🇮🇱" },
  { code: "fa", name: "Persian", native: "فارسی", flag: "🇮🇷" },
  { code: "ur", name: "Urdu", native: "اردو", flag: "🇵🇰" },
  { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
  { code: "gu", name: "Gujarati", native: "ગુજરાતી", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", native: "मराठी", flag: "🇮🇳" },
  { code: "bn", name: "Bengali", native: "বাংলা", flag: "🇧🇩" },
  { code: "ta", name: "Tamil", native: "தமிழ்", flag: "🇮🇳" },
  { code: "te", name: "Telugu", native: "తెలుగు", flag: "🇮🇳" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "ml", name: "Malayalam", native: "മലയാളം", flag: "🇮🇳" },
  { code: "or", name: "Odia", native: "ଓଡ଼ିଆ", flag: "🇮🇳" },
  { code: "as", name: "Assamese", native: "অসমীয়া", flag: "🇮🇳" },
  { code: "ne", name: "Nepali", native: "नेपाली", flag: "🇳🇵" },
  { code: "si", name: "Sinhala", native: "සිංහල", flag: "🇱🇰" },
  { code: "th", name: "Thai", native: "ไทย", flag: "🇹🇭" },
  { code: "vi", name: "Vietnamese", native: "Tiếng Việt", flag: "🇻🇳" },
  { code: "id", name: "Indonesian", native: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "ms", name: "Malay", native: "Bahasa Melayu", flag: "🇲🇾" },
  { code: "tl", name: "Filipino", native: "Filipino", flag: "🇵🇭" },
  { code: "zh-CN", name: "Chinese (Simplified)", native: "简体中文", flag: "🇨🇳" },
  { code: "zh-TW", name: "Chinese (Traditional)", native: "繁體中文", flag: "🇹🇼" },
  { code: "ja", name: "Japanese", native: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "Korean", native: "한국어", flag: "🇰🇷" },
  { code: "mn", name: "Mongolian", native: "Монгол", flag: "🇲🇳" },
  { code: "km", name: "Khmer", native: "ខ្មែរ", flag: "🇰🇭" },
  { code: "lo", name: "Lao", native: "ລາວ", flag: "🇱🇦" },
  { code: "my", name: "Myanmar", native: "မြန်မာ", flag: "🇲🇲" },
  { code: "sw", name: "Swahili", native: "Kiswahili", flag: "🇰🇪" },
  { code: "zu", name: "Zulu", native: "isiZulu", flag: "🇿🇦" },
  { code: "af", name: "Afrikaans", native: "Afrikaans", flag: "🇿🇦" },
  { code: "am", name: "Amharic", native: "አማርኛ", flag: "🇪🇹" },
  { code: "so", name: "Somali", native: "Soomaali", flag: "🇸🇴" },
  { code: "yo", name: "Yoruba", native: "Yorùbá", flag: "🇳🇬" },
  { code: "ig", name: "Igbo", native: "Igbo", flag: "🇳🇬" },
  { code: "ha", name: "Hausa", native: "Hausa", flag: "🇳🇬" },
  { code: "sn", name: "Shona", native: "chiShona", flag: "🇿🇼" },
  { code: "rw", name: "Kinyarwanda", native: "Ikinyarwanda", flag: "🇷🇼" },
  { code: "ln", name: "Lingala", native: "Lingála", flag: "🇨🇩" },
  { code: "la", name: "Latin", native: "Latina", flag: "🇻🇦" },
  { code: "eo", name: "Esperanto", native: "Esperanto", flag: "🌐" },
  { code: "az", name: "Azerbaijani", native: "Azərbaycan", flag: "🇦🇿" },
  { code: "kk", name: "Kazakh", native: "Қазақ", flag: "🇰🇿" },
  { code: "uz", name: "Uzbek", native: "Oʻzbek", flag: "🇺🇿" },
  { code: "ky", name: "Kyrgyz", native: "Кыргызча", flag: "🇰🇬" },
  { code: "tg", name: "Tajik", native: "Тоҷикӣ", flag: "🇹🇯" },
  { code: "tk", name: "Turkmen", native: "Türkmen", flag: "🇹🇲" },
  { code: "hy", name: "Armenian", native: "Հայերեն", flag: "🇦🇲" },
  { code: "ka", name: "Georgian", native: "ქართული", flag: "🇬🇪" },
  { code: "be", name: "Belarusian", native: "Беларуская", flag: "🇧🇾" },
  { code: "mo", name: "Moldovan", native: "Moldovenească", flag: "🇲🇩" },
  { code: "lb", name: "Luxembourgish", native: "Lëtzebuergesch", flag: "🇱🇺" },
  { code: "fo", name: "Faroese", native: "Føroyskt", flag: "🇫🇴" },
  { code: "fy", name: "Frisian", native: "Frysk", flag: "🇳🇱" },
  { code: "br", name: "Breton", native: "Brezhoneg", flag: "🇫🇷" },
  { code: "co", name: "Corsican", native: "Corsu", flag: "🇫🇷" },
  { code: "oc", name: "Occitan", native: "Occitan", flag: "🇫🇷" },
  { code: "sc", name: "Sardinian", native: "Sardu", flag: "🇮🇹" },
  { code: "rm", name: "Romansh", native: "Rumantsch", flag: "🇨🇭" },
  { code: "yi", name: "Yiddish", native: "ייִדיש", flag: "🇮🇱" },
  { code: "ku", name: "Kurdish", native: "Kurdî", flag: "🏳️" },
  { code: "ps", name: "Pashto", native: "پښتو", flag: "🇦🇫" },
  { code: "ckb", name: "Sorani Kurdish", native: "کوردیی ناوەندی", flag: "🏳️" },
  { code: "dv", name: "Dhivehi", native: "ދިވެހި", flag: "🇲🇻" },
  { code: "bo", name: "Tibetan", native: "བོད་སྐད་", flag: "🏳️" },
  { code: "dz", name: "Dzongkha", native: "རྫོང་ཁ", flag: "🇧🇹" },
  { code: "ug", name: "Uyghur", native: "ئۇيغۇرچە", flag: "🏳️" },
  { code: "haw", name: "Hawaiian", native: "ʻŌlelo Hawaiʻi", flag: "🇺🇸" },
  { code: "mi", name: "Māori", native: "Māori", flag: "🇳🇿" },
  { code: "sm", name: "Samoan", native: "Gagana Samoa", flag: "🇼🇸" },
  { code: "to", name: "Tongan", native: "Lea Faka-Tonga", flag: "🇹🇴" },
  { code: "fj", name: "Fijian", native: "Vosa Vakaviti", flag: "🇫🇯" },
  { code: "mg", name: "Malagasy", native: "Malagasy", flag: "🇲🇬" },
  { code: "ny", name: "Chichewa", native: "Chichewa", flag: "🇲🇼" },
  { code: "st", name: "Sesotho", native: "Sesotho", flag: "🇱🇸" },
  { code: "tn", name: "Tswana", native: "Setswana", flag: "🇧🇼" },
  { code: "xh", name: "Xhosa", native: "isiXhosa", flag: "🇿🇦" },
  { code: "wo", name: "Wolof", native: "Wolof", flag: "🇸🇳" },
  { code: "om", name: "Oromo", native: "Afaan Oromoo", flag: "🇪🇹" },
  { code: "ti", name: "Tigrinya", native: "ትግርኛ", flag: "🇪🇷" },
  { code: "aa", name: "Afar", native: "Qafar", flag: "🇩🇯" },
  { code: "kg", name: "Kongo", native: "Kikongo", flag: "🇨🇩" },
  { code: "ee", name: "Ewe", native: "Eʋegbe", flag: "🇬🇭" },
  { code: "tw", name: "Twi", native: "Twi", flag: "🇬🇭" },
  { code: "bm", name: "Bambara", native: "Bamanankan", flag: "🇲🇱" },
  { code: "ff", name: "Fulah", native: "Fulfulde", flag: "🇸🇳" },
  { code: "ss", name: "Swati", native: "SiSwati", flag: "🇸🇿" },
  { code: "ts", name: "Tsonga", native: "Xitsonga", flag: "🇿🇦" },
  { code: "ve", name: "Venda", native: "Tshivenḓa", flag: "🇿🇦" },
  { code: "nr", name: "Ndebele", native: "isiNdebele", flag: "🇿🇦" },
  { code: "qu", name: "Quechua", native: "Runa Simi", flag: "🇵🇪" },
  { code: "ay", name: "Aymara", native: "Aymar aru", flag: "🇧🇴" },
  { code: "gn", name: "Guarani", native: "Avañeʼẽ", flag: "🇵🇾" },
  { code: "ht", name: "Haitian Creole", native: "Kreyòl Ayisyen", flag: "🇭🇹" },
  { code: "jv", name: "Javanese", native: "Basa Jawa", flag: "🇮🇩" },
  { code: "su", name: "Sundanese", native: "Basa Sunda", flag: "🇮🇩" },
  { code: "ceb", name: "Cebuano", native: "Cebuano", flag: "🇵🇭" },
  { code: "hmn", name: "Hmong", native: "Hmoob", flag: "🏳️" },
].sort((a, b) => a.name.localeCompare(b.name));

const RECENT_KEY = "sv-lang-recent";
const FAV_KEY = "sv-lang-fav";

export function LanguageSelector() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [current, setCurrent] = useState<Lang>(LANGS.find((l) => l.code === "en") ?? LANGS[0]);
  const [recent, setRecent] = useState<string[]>([]);
  const [fav, setFav] = useState<string[]>(["en", "hi", "es"]);
  const [activeIdx, setActiveIdx] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const r = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
      if (Array.isArray(r)) setRecent(r);
      const f = JSON.parse(localStorage.getItem(FAV_KEY) || "null");
      if (Array.isArray(f)) setFav(f);
    } catch { /* noop */ }
  }, []);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return LANGS;
    return LANGS.filter(
      (l) =>
        l.name.toLowerCase().includes(s) ||
        l.native.toLowerCase().includes(s) ||
        l.code.toLowerCase().includes(s),
    );
  }, [q]);

  const recentLangs = recent
    .map((c) => LANGS.find((l) => l.code === c))
    .filter(Boolean) as Lang[];
  const favLangs = fav
    .map((c) => LANGS.find((l) => l.code === c))
    .filter(Boolean) as Lang[];

  function pick(l: Lang) {
    setCurrent(l);
    const next = [l.code, ...recent.filter((c) => c !== l.code)].slice(0, 5);
    setRecent(next);
    try { localStorage.setItem(RECENT_KEY, JSON.stringify(next)); } catch { /* noop */ }
    setOpen(false);
    setQ("");
  }

  function toggleFav(code: string, e: React.MouseEvent) {
    e.stopPropagation();
    const next = fav.includes(code) ? fav.filter((c) => c !== code) : [...fav, code];
    setFav(next);
    try { localStorage.setItem(FAV_KEY, JSON.stringify(next)); } catch { /* noop */ }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, filtered.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); const l = filtered[activeIdx]; if (l) pick(l); }
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="h-10 px-2.5 rounded-md hover:bg-panel/60 flex items-center gap-1.5 text-xs text-muted-foreground"
        aria-label="Choose language"
        aria-expanded={open}
      >
        <Globe2 className="h-4 w-4" />
        <span className="text-base leading-none">{current.flag}</span>
        <span className="hidden sm:inline text-mono uppercase">{current.code.split("-")[0]}</span>
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-[340px] max-w-[92vw] rounded-xl border border-border bg-panel/95 backdrop-blur-xl shadow-[var(--shadow-card-hover)] z-50 animate-rise overflow-hidden"
          role="dialog"
          aria-label="Language selector"
        >
          <div className="p-2.5 border-b border-border">
            <div className="flex items-center h-9 rounded-lg border border-border bg-background/60 px-2.5 gap-2 focus-within:border-primary/60">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => { setQ(e.target.value); setActiveIdx(0); }}
                onKeyDown={onKeyDown}
                placeholder="Search 130+ languages…"
                className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground/70 focus:outline-none"
              />
              {q && (
                <button onClick={() => setQ("")} aria-label="Clear">
                  <X className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>
          </div>

          <div className="max-h-[42vh] overflow-y-auto py-1">
            {!q && recentLangs.length > 0 && (
              <Group icon={<Clock className="h-3 w-3" />} label="Recent">
                {recentLangs.map((l) => (
                  <Row key={`r-${l.code}`} l={l} current={current.code} fav={fav.includes(l.code)} onPick={pick} onFav={toggleFav} />
                ))}
              </Group>
            )}
            {!q && favLangs.length > 0 && (
              <Group icon={<Star className="h-3 w-3" />} label="Favorites">
                {favLangs.map((l) => (
                  <Row key={`f-${l.code}`} l={l} current={current.code} fav onPick={pick} onFav={toggleFav} />
                ))}
              </Group>
            )}
            <Group label={q ? `Results (${filtered.length})` : "All languages · A–Z"}>
              {filtered.length === 0 && (
                <div className="px-3 py-6 text-center text-xs text-muted-foreground">No matches for "{q}"</div>
              )}
              {filtered.map((l, idx) => (
                <Row
                  key={l.code}
                  l={l}
                  current={current.code}
                  fav={fav.includes(l.code)}
                  active={idx === activeIdx}
                  onPick={pick}
                  onFav={toggleFav}
                />
              ))}
            </Group>
          </div>

          <div className="border-t border-border px-3 py-2 flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
            <span>{LANGS.length} languages</span>
            <span className="text-mono">↑↓ navigate · ↵ select</span>
          </div>
        </div>
      )}
    </div>
  );
}

function Group({ icon, label, children }: { icon?: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="py-1">
      <div className="px-3 py-1 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-muted-foreground/80">
        {icon}
        {label}
      </div>
      <ul className="px-1">{children}</ul>
    </div>
  );
}

function Row({
  l, current, fav, active, onPick, onFav,
}: {
  l: Lang; current: string; fav?: boolean; active?: boolean;
  onPick: (l: Lang) => void; onFav: (c: string, e: React.MouseEvent) => void;
}) {
  const selected = l.code === current;
  return (
    <li>
      <button
        onClick={() => onPick(l)}
        className={`w-full flex items-center gap-2.5 px-2.5 h-9 rounded-lg text-left text-sm transition-colors ${
          active ? "bg-primary/15 text-primary" : "hover:bg-primary/10 hover:text-primary"
        }`}
      >
        <span className="text-base leading-none w-5 text-center">{l.flag}</span>
        <span className="flex-1 min-w-0 truncate">
          {l.name}
          <span className="text-muted-foreground ml-1.5 text-[11px]">· {l.native}</span>
        </span>
        {selected && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => onFav(l.code, e)}
          className={`shrink-0 h-6 w-6 grid place-items-center rounded hover:bg-background/60 ${fav ? "text-gold" : "text-muted-foreground/50"}`}
          aria-label={fav ? "Unfavorite" : "Favorite"}
        >
          <Star className="h-3.5 w-3.5" fill={fav ? "currentColor" : "none"} />
        </span>
      </button>
    </li>
  );
}