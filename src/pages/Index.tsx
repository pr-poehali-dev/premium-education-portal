import { useState, useEffect, useMemo } from 'react';
import Icon from '@/components/ui/icon';
import ParticleField from '@/components/ParticleField';

const TEACHER_PHOTO = 'https://cdn.poehali.dev/projects/01685e92-68d2-469f-8ef6-55f7551f0017/files/2c9b2bee-f967-4e3c-9045-02d3a2736a4a.jpg';

const stats = [
  { value: '12', label: 'лет опыта', suffix: '' },
  { value: '480', label: 'учеников', suffix: '+' },
  { value: '4.98', label: 'рейтинг', suffix: '' },
  { value: '98', label: 'сдают экзамены', suffix: '%' },
];

const services = [
  {
    lang: 'EN',
    zh: '',
    title: 'Английский с нуля',
    sub: 'Beginner → Intermediate',
    desc: 'Живая разговорная база, грамматика без зубрёжки и уверенность в речи с первого месяца.',
    features: ['Авторская методика', 'Носительская подача', 'Домашка с проверкой'],
    price: 2400,
    accent: false,
  },
  {
    lang: '',
    zh: '口语',
    title: 'Разговорный клуб',
    sub: 'Speaking Practice',
    desc: 'Только живая речь: дискуссии, дебаты, ролевые игры и постановка интонации.',
    features: ['Группа до 4 человек', 'Реальные сценарии', 'Запись занятий'],
    price: 1800,
    accent: true,
  },
  {
    lang: '',
    zh: '中文',
    title: 'Китайский язык',
    sub: 'HSK 1 → HSK 4',
    desc: 'Тоны, иероглифика и реальная коммуникация. От первых фраз до уверенного диалога.',
    features: ['Постановка тонов', 'Иероглифика', 'Подготовка к HSK'],
    price: 2900,
    accent: false,
  },
];

type ChoiceTask = { type: 'choice'; q: string; options: string[]; correct: number; hint: string };
type InputTask = { type: 'input'; q: string; answer: string; hint: string };
type Task = ChoiceTask | InputTask;

const trainerTasks: Task[] = [
  { type: 'choice', q: 'She ___ to school every day.', options: ['go', 'goes', 'going'], correct: 1, hint: 'Present Simple, 3 лицо' },
  { type: 'input', q: 'Переведите на английский: «книга»', answer: 'book', hint: 'b _ _ k' },
  { type: 'choice', q: 'Выберите перевод «спасибо»', options: ['你好', '谢谢', '再见'], correct: 1, hint: 'xièxie' },
  { type: 'input', q: 'Past Simple от глагола «go»', answer: 'went', hint: 'неправильный глагол' },
  { type: 'choice', q: 'I have ___ apple.', options: ['a', 'an', 'the'], correct: 1, hint: 'перед гласным звуком' },
];

const Index = () => {
  const [scrolled, setScrolled] = useState(false);

  const [taskIndex, setTaskIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [inputVal, setInputVal] = useState('');
  const [inputResult, setInputResult] = useState<'idle' | 'right' | 'wrong'>('idle');
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const [calcLang, setCalcLang] = useState<'en' | 'zh'>('en');
  const [calcFormat, setCalcFormat] = useState<'solo' | 'group'>('solo');
  const [calcPerWeek, setCalcPerWeek] = useState(2);
  const [calcMonths, setCalcMonths] = useState(3);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const task = trainerTasks[taskIndex];

  const nextTask = () => {
    setTimeout(() => {
      if (taskIndex + 1 < trainerTasks.length) {
        setTaskIndex((i) => i + 1);
        setSelected(null);
        setInputVal('');
        setInputResult('idle');
        setShowHint(false);
      } else {
        setDone(true);
      }
    }, 850);
  };

  const answerChoice = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    if (task.type === 'choice' && i === task.correct) setScore((s) => s + 1);
    nextTask();
  };

  const checkInput = () => {
    if (inputResult !== 'idle' || task.type !== 'input') return;
    const ok = inputVal.trim().toLowerCase() === task.answer.toLowerCase();
    setInputResult(ok ? 'right' : 'wrong');
    if (ok) setScore((s) => s + 1);
    nextTask();
  };

  const resetTrainer = () => {
    setTaskIndex(0);
    setSelected(null);
    setInputVal('');
    setInputResult('idle');
    setShowHint(false);
    setScore(0);
    setDone(false);
  };

  const calc = useMemo(() => {
    const base = calcLang === 'en' ? (calcFormat === 'group' ? 1800 : 2400) : 2900;
    const total = base * calcPerWeek * 4 * calcMonths;
    const discount = calcMonths >= 6 ? 0.15 : calcMonths >= 3 ? 0.08 : 0;
    const final = Math.round((total * (1 - discount)) / 100) * 100;
    return { base, total, discount, final, lessons: calcPerWeek * 4 * calcMonths };
  }, [calcLang, calcFormat, calcPerWeek, calcMonths]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased overflow-x-hidden selection:bg-accent/40">
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-accent/10 blur-[140px] pointer-events-none animate-glow-pulse" aria-hidden />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-[hsl(190,95%,55%)]/10 blur-[140px] pointer-events-none" aria-hidden />

      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? 'py-3' : 'py-6'}`}>
        <div className="container max-w-6xl">
          <nav className={`flex items-center justify-between rounded-2xl px-5 py-3 transition-all duration-500 ${scrolled ? 'glass-strong shadow-2xl shadow-black/40' : ''}`}>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[hsl(190,95%,55%)] to-[hsl(280,95%,68%)] flex items-center justify-center font-bold text-background text-lg">L</div>
              <span className="font-bold tracking-tight text-lg">Lingua</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
              <a href="#about" className="hover:text-foreground transition-colors">Методика</a>
              <a href="#services" className="hover:text-foreground transition-colors">Услуги</a>
              <a href="#practice" className="hover:text-foreground transition-colors">Тренажёр</a>
              <a href="#calc" className="hover:text-foreground transition-colors">Калькулятор</a>
            </div>
            <button className="bg-foreground text-background text-sm font-semibold px-5 py-2.5 rounded-xl hover:scale-105 transition-transform duration-300">
              Начать
            </button>
          </nav>
        </div>
      </header>

      <section className="relative min-h-screen flex items-center pt-28 pb-16 grid-bg overflow-hidden">
        <ParticleField />
        <div className="container max-w-6xl relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="reveal inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs tracking-wide text-muted-foreground mb-8" style={{ animationDelay: '0.1s' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-[hsl(190,95%,55%)] animate-glow-pulse" />
                English · 中文 · онлайн-обучение
              </div>
              <h1 className="reveal text-5xl md:text-7xl font-extrabold leading-[0.98] tracking-tight mb-6 text-balance" style={{ animationDelay: '0.2s' }}>
                Языки<br />
                <span className="text-gradient">будущего</span><br />
                уже сегодня
              </h1>
              <p className="reveal text-lg text-muted-foreground max-w-md mb-10 leading-relaxed" style={{ animationDelay: '0.35s' }}>
                Технологичная платформа обучения английскому и китайскому. Интерактивные тренажёры, живая практика и результат, который виден в цифрах.
              </p>
              <div className="reveal flex flex-wrap items-center gap-4" style={{ animationDelay: '0.5s' }}>
                <button className="group bg-gradient-to-r from-[hsl(190,95%,55%)] to-[hsl(280,95%,68%)] text-background px-7 py-4 rounded-xl font-semibold flex items-center gap-2 hover:scale-105 transition-transform duration-300 glow">
                  Начать обучение
                  <Icon name="ArrowRight" size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <a href="#practice" className="px-7 py-4 rounded-xl font-semibold glass hover:bg-white/5 transition-colors flex items-center gap-2">
                  <Icon name="Zap" size={18} className="text-[hsl(190,95%,55%)]" />
                  Попробовать тренажёр
                </a>
              </div>
            </div>

            <div className="reveal relative" style={{ animationDelay: '0.4s' }}>
              <div className="relative rounded-3xl overflow-hidden aspect-[4/5] hover-lift neon-border">
                <img src={TEACHER_PHOTO} alt="Преподаватель Lingua" className="w-full h-full object-cover" loading="eager" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 glass-strong rounded-2xl px-5 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">Анна Соколова</div>
                      <div className="text-xs text-muted-foreground">EN · 中文 · 12 лет опыта</div>
                    </div>
                    <div className="flex items-center gap-1 text-[hsl(190,95%,55%)]">
                      <Icon name="Star" size={16} className="fill-current" />
                      <span className="font-semibold text-foreground">4.98</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 glass-strong rounded-2xl px-4 py-3 animate-float">
                <div className="text-2xl font-bold text-gradient">480+</div>
                <div className="text-xs text-muted-foreground">учеников</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 border-y border-border relative">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-4xl md:text-5xl font-extrabold mb-1">
                  {s.value}<span className="text-gradient">{s.suffix}</span>
                </div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="py-28 relative">
        <div className="container max-w-6xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-[hsl(190,95%,55%)]">Методика</span>
              <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 leading-tight">Обучение, построенное вокруг данных</h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                За 12 лет я помогла сотням учеников заговорить свободно — без страха и зубрёжки. Каждое занятие адаптируется под ваш темп, цели и прогресс, который виден в реальном времени.
              </p>
              <div className="space-y-4">
                {[
                  { icon: 'Cpu', t: 'Интерактивные тренажёры', d: 'Упражнения с мгновенной проверкой' },
                  { icon: 'Target', t: 'Под ваши цели', d: 'Экзамены, работа, переезд' },
                  { icon: 'LineChart', t: 'Прогресс в цифрах', d: 'Понятная статистика и тесты' },
                ].map((f) => (
                  <div key={f.t} className="flex gap-4 glass rounded-2xl p-4 hover-lift">
                    <div className="w-11 h-11 shrink-0 rounded-xl bg-accent/15 flex items-center justify-center">
                      <Icon name={f.icon} size={20} className="text-accent" />
                    </div>
                    <div>
                      <div className="font-semibold">{f.t}</div>
                      <div className="text-sm text-muted-foreground">{f.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="rounded-3xl glass-strong p-10 md:p-12 hover-lift neon-border">
                <Icon name="Quote" size={32} className="text-accent mb-6" />
                <p className="text-2xl md:text-3xl font-semibold leading-snug mb-8">
                  «Язык — это не предмет, а дверь. Моя задача — сделать так, чтобы вы вошли в неё уверенно.»
                </p>
                <div className="flex items-center gap-3">
                  <img src={TEACHER_PHOTO} alt="" className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <div className="font-semibold">Анна Соколова</div>
                    <div className="text-sm text-muted-foreground">Преподаватель EN · 中文</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-28 relative">
        <div className="container max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.2em] text-[hsl(190,95%,55%)]">Услуги</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-4">Выберите свой формат</h2>
            <p className="text-muted-foreground">Гибкие пакеты под любую цель и темп. Первый урок — бесплатно.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {services.map((s) => (
              <div key={s.title} className={`group rounded-3xl p-8 hover-lift flex flex-col ${s.accent ? 'glass-strong neon-border glow' : 'glass'}`}>
                <div className="flex items-center justify-between mb-6">
                  <span className={`text-2xl font-bold ${s.zh ? 'font-zh' : ''} text-gradient`}>{s.zh || s.lang}</span>
                  {s.accent && (
                    <span className="text-xs uppercase tracking-wider bg-accent text-accent-foreground px-3 py-1 rounded-full">Хит</span>
                  )}
                </div>
                <h3 className="text-2xl font-bold mb-1">{s.title}</h3>
                <div className="text-sm text-muted-foreground mb-5">{s.sub}</div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">{s.desc}</p>
                <ul className="space-y-2 mb-6 flex-1">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Icon name="Check" size={15} className="text-[hsl(190,95%,55%)]" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <span className="text-3xl font-extrabold">{s.price.toLocaleString('ru')} ₽</span>
                    <span className="text-sm text-muted-foreground"> / урок</span>
                  </div>
                  <button className="w-11 h-11 rounded-xl bg-gradient-to-br from-[hsl(190,95%,55%)] to-[hsl(280,95%,68%)] text-background flex items-center justify-center hover:scale-110 transition-transform">
                    <Icon name="ArrowRight" size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="practice" className="py-28 relative">
        <div className="container max-w-3xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-[0.2em] text-[hsl(190,95%,55%)]">Интерактив</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-4">Языковой тренажёр</h2>
            <p className="text-muted-foreground">Тесты и упражнения с вводом ответа и мгновенной проверкой — почувствуйте, как проходят занятия.</p>
          </div>

          <div className="glass-strong rounded-3xl p-8 md:p-12 neon-border">
            {!done ? (
              <div key={taskIndex} className="animate-fade-in">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon name={task.type === 'input' ? 'Keyboard' : 'ListChecks'} size={16} className="text-[hsl(190,95%,55%)]" />
                    {task.type === 'input' ? 'Введите ответ' : 'Выберите вариант'}
                  </div>
                  <span className="text-sm text-muted-foreground">{taskIndex + 1} / {trainerTasks.length}</span>
                </div>

                <div className="flex gap-1.5 mb-8">
                  {trainerTasks.map((_, i) => (
                    <span key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i < taskIndex ? 'bg-accent/50' : i === taskIndex ? 'bg-gradient-to-r from-[hsl(190,95%,55%)] to-[hsl(280,95%,68%)]' : 'bg-border'}`} />
                  ))}
                </div>

                <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center">{task.q}</h3>

                {task.type === 'choice' ? (
                  <div className="grid gap-3">
                    {task.options.map((opt, i) => {
                      const isCorrect = i === task.correct;
                      const isSelected = selected === i;
                      let cls = 'border-border hover:border-accent glass';
                      if (selected !== null) {
                        if (isCorrect) cls = 'border-[hsl(190,95%,55%)] bg-[hsl(190,95%,55%)]/10 text-[hsl(190,95%,55%)]';
                        else if (isSelected) cls = 'border-destructive bg-destructive/10 text-destructive';
                        else cls = 'border-border opacity-40';
                      }
                      const isZh = /[\u4e00-\u9fff]/.test(opt);
                      return (
                        <button key={i} onClick={() => answerChoice(i)} disabled={selected !== null} className={`flex items-center justify-between px-6 py-4 rounded-2xl border text-left font-semibold transition-all duration-300 ${cls}`}>
                          <span className={isZh ? 'font-zh text-xl' : ''}>{opt}</span>
                          {selected !== null && isCorrect && <Icon name="Check" size={20} />}
                          {isSelected && !isCorrect && <Icon name="X" size={20} />}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-3">
                      <input
                        value={inputVal}
                        onChange={(e) => setInputVal(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && checkInput()}
                        disabled={inputResult !== 'idle'}
                        placeholder="Ваш ответ..."
                        className={`flex-1 px-6 py-4 rounded-2xl border bg-secondary/40 outline-none transition-all font-semibold ${
                          inputResult === 'right' ? 'border-[hsl(190,95%,55%)] text-[hsl(190,95%,55%)]'
                          : inputResult === 'wrong' ? 'border-destructive text-destructive'
                          : 'border-border focus:border-accent'
                        }`}
                      />
                      <button onClick={checkInput} disabled={inputResult !== 'idle' || !inputVal.trim()} className="px-6 rounded-2xl bg-gradient-to-r from-[hsl(190,95%,55%)] to-[hsl(280,95%,68%)] text-background font-semibold disabled:opacity-40 hover:scale-105 transition-transform">
                        <Icon name="CornerDownLeft" size={20} />
                      </button>
                    </div>
                    {inputResult === 'wrong' && task.type === 'input' && (
                      <p className="mt-3 text-sm text-destructive">Верный ответ: <span className="font-semibold">{task.answer}</span></p>
                    )}
                  </div>
                )}

                <div className="mt-6 text-center">
                  <button onClick={() => setShowHint((v) => !v)} className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5">
                    <Icon name="Lightbulb" size={14} />
                    {showHint ? task.hint : 'Показать подсказку'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center animate-scale-in py-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-accent/15 flex items-center justify-center mb-6 glow">
                  <Icon name="Trophy" size={36} className="text-accent" />
                </div>
                <h3 className="text-5xl font-extrabold mb-2"><span className="text-gradient">{score}</span> / {trainerTasks.length}</h3>
                <p className="text-muted-foreground mb-8">
                  {score === trainerTasks.length ? 'Безупречно! У вас крепкая база.' : score >= trainerTasks.length / 2 ? 'Хороший результат — есть к чему стремиться!' : 'Отличное начало — поработаем вместе.'}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button onClick={resetTrainer} className="px-6 py-3 rounded-xl glass hover:bg-white/5 font-semibold transition-colors inline-flex items-center gap-2">
                    <Icon name="RotateCcw" size={16} /> Пройти ещё раз
                  </button>
                  <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-[hsl(190,95%,55%)] to-[hsl(280,95%,68%)] text-background font-semibold hover:scale-105 transition-transform">
                    Записаться на урок
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="calc" className="py-28 relative">
        <div className="container max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-[0.2em] text-[hsl(190,95%,55%)]">Стоимость</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-4">Калькулятор обучения</h2>
            <p className="text-muted-foreground">Соберите свой курс и узнайте стоимость за пару секунд.</p>
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            <div className="md:col-span-3 glass-strong rounded-3xl p-8 space-y-7 neon-border">
              <div>
                <label className="text-sm font-semibold text-muted-foreground mb-3 block">Язык</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'en', label: 'Английский', sub: 'EN' },
                    { id: 'zh', label: 'Китайский', sub: '中文' },
                  ].map((o) => (
                    <button key={o.id} onClick={() => setCalcLang(o.id as 'en' | 'zh')} className={`p-4 rounded-2xl border text-left transition-all ${calcLang === o.id ? 'border-accent bg-accent/10' : 'border-border glass hover:border-accent/50'}`}>
                      <div className="font-semibold">{o.label}</div>
                      <div className={`text-sm text-muted-foreground ${/[\u4e00-\u9fff]/.test(o.sub) ? 'font-zh' : ''}`}>{o.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className={calcLang === 'zh' ? 'opacity-40 pointer-events-none' : ''}>
                <label className="text-sm font-semibold text-muted-foreground mb-3 block">Формат {calcLang === 'zh' && '(только индивидуально)'}</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'solo', label: 'Индивидуально', sub: '1 на 1' },
                    { id: 'group', label: 'В группе', sub: 'до 4 человек' },
                  ].map((o) => (
                    <button key={o.id} onClick={() => setCalcFormat(o.id as 'solo' | 'group')} className={`p-4 rounded-2xl border text-left transition-all ${calcFormat === o.id ? 'border-accent bg-accent/10' : 'border-border glass hover:border-accent/50'}`}>
                      <div className="font-semibold">{o.label}</div>
                      <div className="text-sm text-muted-foreground">{o.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-muted-foreground">Занятий в неделю</label>
                  <span className="font-bold text-gradient">{calcPerWeek}</span>
                </div>
                <input type="range" min={1} max={5} value={calcPerWeek} onChange={(e) => setCalcPerWeek(+e.target.value)} className="w-full accent-[hsl(265,90%,65%)]" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-muted-foreground">Длительность, мес.</label>
                  <span className="font-bold text-gradient">{calcMonths}</span>
                </div>
                <input type="range" min={1} max={12} value={calcMonths} onChange={(e) => setCalcMonths(+e.target.value)} className="w-full accent-[hsl(265,90%,65%)]" />
              </div>
            </div>

            <div className="md:col-span-2 glass-strong rounded-3xl p-8 flex flex-col neon-border glow">
              <div className="text-sm text-muted-foreground mb-1">Итоговая стоимость</div>
              <div className="text-4xl font-extrabold text-gradient mb-1 transition-all">{calc.final.toLocaleString('ru')} ₽</div>
              {calc.discount > 0 && (
                <div className="text-sm text-muted-foreground mb-6">
                  <span className="line-through">{calc.total.toLocaleString('ru')} ₽</span>
                  <span className="ml-2 text-[hsl(190,95%,55%)] font-semibold">−{Math.round(calc.discount * 100)}%</span>
                </div>
              )}
              <div className="space-y-3 text-sm py-6 border-y border-border my-2">
                <div className="flex justify-between"><span className="text-muted-foreground">Цена занятия</span><span className="font-semibold">{calc.base.toLocaleString('ru')} ₽</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Всего занятий</span><span className="font-semibold">{calc.lessons}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Период</span><span className="font-semibold">{calcMonths} мес.</span></div>
              </div>
              <button className="mt-auto w-full py-4 rounded-xl bg-gradient-to-r from-[hsl(190,95%,55%)] to-[hsl(280,95%,68%)] text-background font-semibold hover:scale-105 transition-transform">
                Записаться на курс
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-28 relative">
        <div className="container max-w-6xl">
          <div className="relative rounded-3xl glass-strong neon-border overflow-hidden grid-bg px-8 py-20 md:px-16 text-center">
            <div className="absolute top-0 left-1/4 w-80 h-80 rounded-full bg-accent/20 blur-[100px] animate-glow-pulse" aria-hidden />
            <div className="relative">
              <h2 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">Первый урок — <span className="text-gradient">бесплатно</span></h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-10">Познакомимся, определим ваш уровень и составим персональный план. Без обязательств.</p>
              <button className="group bg-gradient-to-r from-[hsl(190,95%,55%)] to-[hsl(280,95%,68%)] text-background px-8 py-4 rounded-xl font-semibold inline-flex items-center gap-2 hover:scale-105 transition-transform duration-300 glow">
                Записаться сейчас
                <Icon name="ArrowRight" size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-12 relative">
        <div className="container max-w-6xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[hsl(190,95%,55%)] to-[hsl(280,95%,68%)] flex items-center justify-center font-bold text-background">L</div>
            <span className="font-bold">Lingua</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#about" className="hover:text-foreground transition-colors">Методика</a>
            <a href="#services" className="hover:text-foreground transition-colors">Услуги</a>
            <a href="#practice" className="hover:text-foreground transition-colors">Тренажёр</a>
            <a href="#calc" className="hover:text-foreground transition-colors">Калькулятор</a>
          </div>
          <div className="text-sm text-muted-foreground">© 2026 Lingua</div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
