import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';

const TEACHER_PHOTO = 'https://cdn.poehali.dev/projects/01685e92-68d2-469f-8ef6-55f7551f0017/files/2c9b2bee-f967-4e3c-9045-02d3a2736a4a.jpg';

const services = [
  {
    lang: 'EN',
    title: 'Английский с нуля',
    sub: 'Beginner → Intermediate',
    desc: 'Живая разговорная база, грамматика без зубрёжки и уверенность в речи с первого месяца.',
    duration: '60 мин · 2 раза в неделю',
    price: '2 400 ₽',
    accent: false,
  },
  {
    lang: 'EN',
    title: 'Разговорный клуб',
    sub: 'Speaking Practice',
    desc: 'Только живая речь: дискуссии, дебаты, ролевые игры и носительская подача интонации.',
    duration: '90 мин · группа до 4 человек',
    price: '1 800 ₽',
    accent: true,
  },
  {
    lang: '中文',
    title: 'Китайский язык',
    sub: 'HSK 1 → HSK 4',
    desc: 'Тоны, иероглифика и реальная коммуникация. От первых фраз до уверенного диалога.',
    duration: '60 мин · индивидуально',
    price: '2 900 ₽',
    accent: false,
  },
];

const stats = [
  { value: '12', label: 'лет преподавания' },
  { value: '480+', label: 'учеников' },
  { value: '4.98', label: 'средний рейтинг' },
  { value: '98%', label: 'сдают экзамены' },
];

type Quiz = { q: string; options: string[]; correct: number };
const quiz: Quiz[] = [
  { q: 'She ___ to school every day.', options: ['go', 'goes', 'going'], correct: 1 },
  { q: 'Выберите верный перевод «привет»', options: ['你好', '再见', '谢谢'], correct: 0 },
  { q: 'I have ___ apple in my bag.', options: ['a', 'an', 'the'], correct: 1 },
];

const Index = () => {
  const [scrolled, setScrolled] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const answer = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    const correct = i === quiz[quizIndex].correct;
    if (correct) setScore((s) => s + 1);
    setTimeout(() => {
      if (quizIndex + 1 < quiz.length) {
        setQuizIndex((q) => q + 1);
        setSelected(null);
      } else {
        setDone(true);
      }
    }, 900);
  };

  const resetQuiz = () => {
    setQuizIndex(0);
    setSelected(null);
    setScore(0);
    setDone(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased overflow-x-hidden">
      {/* NAV */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled ? 'py-3' : 'py-6'
        }`}
      >
        <div className="container max-w-6xl">
          <nav
            className={`flex items-center justify-between rounded-full px-6 py-3 transition-all duration-500 ${
              scrolled ? 'glass shadow-lg shadow-black/5' : ''
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center text-background font-serif text-lg">
                L
              </div>
              <span className="font-semibold tracking-tight text-lg">Lingua</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
              <a href="#about" className="hover:text-foreground transition-colors">О преподавателе</a>
              <a href="#services" className="hover:text-foreground transition-colors">Услуги</a>
              <a href="#practice" className="hover:text-foreground transition-colors">Упражнения</a>
            </div>
            <button className="bg-foreground text-background text-sm font-medium px-5 py-2.5 rounded-full hover:bg-accent transition-colors duration-300">
              Начать обучение
            </button>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center grain pt-28 pb-16">
        <div
          className="absolute top-1/4 -left-40 w-[500px] h-[500px] rounded-full bg-accent/20 blur-[120px] animate-float"
          aria-hidden
        />
        <div
          className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-foreground/5 blur-[100px]"
          aria-hidden
        />
        <div className="container max-w-6xl relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="reveal inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground mb-8" style={{ animationDelay: '0.1s' }}>
                <span className="w-8 h-px bg-accent" />
                English · 中文
              </div>
              <h1 className="reveal font-serif text-5xl md:text-7xl leading-[0.95] tracking-tight mb-6 text-balance" style={{ animationDelay: '0.2s' }}>
                Языки,<br />которые
                <span className="italic text-accent"> открывают</span><br />
                мир
              </h1>
              <p className="reveal text-lg text-muted-foreground max-w-md mb-10 leading-relaxed" style={{ animationDelay: '0.35s' }}>
                Индивидуальное обучение английскому и китайскому. Авторская методика, живая практика и результат, который чувствуется уже через месяц.
              </p>
              <div className="reveal flex flex-wrap items-center gap-4" style={{ animationDelay: '0.5s' }}>
                <button className="group bg-foreground text-background px-7 py-4 rounded-full font-medium flex items-center gap-2 hover:bg-accent transition-all duration-300">
                  Начать обучение
                  <Icon name="ArrowRight" size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-7 py-4 rounded-full font-medium border border-border hover:border-foreground transition-colors">
                  Бесплатный урок
                </button>
              </div>
            </div>

            <div className="reveal relative" style={{ animationDelay: '0.4s' }}>
              <div className="relative rounded-[2rem] overflow-hidden aspect-[4/5] hover-lift">
                <img
                  src={TEACHER_PHOTO}
                  alt="Преподаватель Lingua"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
              </div>
              <div className="absolute -bottom-6 -left-6 glass rounded-2xl px-5 py-4 shadow-xl shadow-black/10">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-accent/80 border-2 border-white" />
                    ))}
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold leading-tight">480+ учеников</div>
                    <div className="text-muted-foreground text-xs">уже учатся</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 border-y border-border">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-serif text-4xl md:text-5xl mb-1">{s.value}</div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-28">
        <div className="container max-w-6xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-accent">Методика</span>
              <h2 className="font-serif text-4xl md:text-5xl mt-4 mb-6 leading-tight">
                Обучение, построенное вокруг вас
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                За 12 лет я помогла сотням учеников заговорить свободно — без страха, скучных учебников и зубрёжки. Каждое занятие адаптируется под ваш темп, цели и интересы.
              </p>
              <div className="space-y-5">
                {[
                  { icon: 'Sparkles', t: 'Живая речь с первого урока', d: 'Вы говорите, а не молчите над таблицами' },
                  { icon: 'Target', t: 'Под ваши цели', d: 'Экзамены, работа, путешествия или переезд' },
                  { icon: 'TrendingUp', t: 'Видимый прогресс', d: 'Регулярные тесты и понятная статистика' },
                ].map((f) => (
                  <div key={f.t} className="flex gap-4">
                    <div className="w-11 h-11 shrink-0 rounded-xl bg-secondary flex items-center justify-center">
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
              <div className="rounded-[2rem] bg-foreground text-background p-10 md:p-12 hover-lift">
                <Icon name="Quote" size={32} className="text-accent mb-6" />
                <p className="font-serif text-2xl md:text-3xl leading-snug mb-8">
                  «Язык — это не предмет, а дверь. Моя задача — сделать так, чтобы вы вошли в неё уверенно.»
                </p>
                <div className="flex items-center gap-3">
                  <img src={TEACHER_PHOTO} alt="" className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <div className="font-semibold">Анна Соколова</div>
                    <div className="text-sm text-background/60">Преподаватель EN · 中文</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-28 bg-secondary/40">
        <div className="container max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.2em] text-accent">Услуги</span>
            <h2 className="font-serif text-4xl md:text-5xl mt-4 mb-4">Выберите свой формат</h2>
            <p className="text-muted-foreground">Гибкие пакеты под любую цель и темп. Первый урок — бесплатно.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {services.map((s) => (
              <div
                key={s.title}
                className={`group rounded-[1.75rem] p-8 hover-lift flex flex-col ${
                  s.accent
                    ? 'bg-foreground text-background'
                    : 'bg-card border border-border'
                }`}
              >
                <div className="flex items-center justify-between mb-6">
                  <span className={`font-zh text-2xl ${s.accent ? 'text-accent' : 'text-accent'}`}>{s.lang}</span>
                  {s.accent && (
                    <span className="text-xs uppercase tracking-wider bg-accent text-accent-foreground px-3 py-1 rounded-full">
                      Популярно
                    </span>
                  )}
                </div>
                <h3 className="font-serif text-2xl mb-1">{s.title}</h3>
                <div className={`text-sm mb-5 ${s.accent ? 'text-background/60' : 'text-muted-foreground'}`}>{s.sub}</div>
                <p className={`text-sm leading-relaxed mb-6 flex-1 ${s.accent ? 'text-background/80' : 'text-muted-foreground'}`}>
                  {s.desc}
                </p>
                <div className={`flex items-center gap-2 text-sm mb-6 ${s.accent ? 'text-background/70' : 'text-muted-foreground'}`}>
                  <Icon name="Clock" size={16} />
                  {s.duration}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-serif text-3xl">{s.price}</span>
                    <span className={`text-sm ${s.accent ? 'text-background/60' : 'text-muted-foreground'}`}> / занятие</span>
                  </div>
                  <button
                    className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                      s.accent
                        ? 'bg-accent text-accent-foreground hover:scale-110'
                        : 'bg-foreground text-background hover:scale-110'
                    }`}
                  >
                    <Icon name="ArrowRight" size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRACTICE / QUIZ */}
      <section id="practice" className="py-28">
        <div className="container max-w-4xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-[0.2em] text-accent">Интерактив</span>
            <h2 className="font-serif text-4xl md:text-5xl mt-4 mb-4">Проверьте себя прямо сейчас</h2>
            <p className="text-muted-foreground">Мини-тест с мгновенной проверкой — почувствуйте, как проходят занятия.</p>
          </div>

          <div className="glass rounded-[2rem] p-8 md:p-12 shadow-2xl shadow-black/5 grain">
            {!done ? (
              <div key={quizIndex} className="animate-fade-in">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-sm text-muted-foreground">
                    Вопрос {quizIndex + 1} из {quiz.length}
                  </span>
                  <div className="flex gap-1.5">
                    {quiz.map((_, i) => (
                      <span
                        key={i}
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                          i === quizIndex ? 'w-8 bg-accent' : i < quizIndex ? 'w-1.5 bg-accent/40' : 'w-1.5 bg-border'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <h3 className="font-serif text-3xl md:text-4xl mb-8 text-center">{quiz[quizIndex].q}</h3>
                <div className="grid gap-3">
                  {quiz[quizIndex].options.map((opt, i) => {
                    const isCorrect = i === quiz[quizIndex].correct;
                    const isSelected = selected === i;
                    let cls = 'border-border hover:border-foreground bg-card';
                    if (selected !== null) {
                      if (isCorrect) cls = 'border-green-500 bg-green-50 text-green-700';
                      else if (isSelected) cls = 'border-red-400 bg-red-50 text-red-600';
                      else cls = 'border-border opacity-50';
                    }
                    return (
                      <button
                        key={i}
                        onClick={() => answer(i)}
                        disabled={selected !== null}
                        className={`flex items-center justify-between px-6 py-4 rounded-2xl border-2 text-left font-medium transition-all duration-300 ${cls}`}
                      >
                        <span className={quiz[quizIndex].options.some((o) => /[\u4e00-\u9fff]/.test(o)) ? 'font-zh text-xl' : ''}>
                          {opt}
                        </span>
                        {selected !== null && isCorrect && <Icon name="Check" size={20} />}
                        {isSelected && !isCorrect && <Icon name="X" size={20} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center animate-scale-in py-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-accent/15 flex items-center justify-center mb-6">
                  <Icon name="Award" size={36} className="text-accent" />
                </div>
                <h3 className="font-serif text-4xl mb-2">
                  {score} из {quiz.length}
                </h3>
                <p className="text-muted-foreground mb-8">
                  {score === quiz.length
                    ? 'Великолепно! У вас крепкая база.'
                    : 'Отличное начало — есть над чем поработать вместе.'}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={resetQuiz}
                    className="px-6 py-3 rounded-full border border-border hover:border-foreground font-medium transition-colors"
                  >
                    Пройти ещё раз
                  </button>
                  <button className="px-6 py-3 rounded-full bg-foreground text-background font-medium hover:bg-accent transition-colors">
                    Записаться на урок
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28">
        <div className="container max-w-6xl">
          <div className="relative rounded-[2.5rem] bg-foreground text-background overflow-hidden grain px-8 py-20 md:px-16 text-center">
            <div className="absolute top-0 left-1/4 w-80 h-80 rounded-full bg-accent/30 blur-[100px]" aria-hidden />
            <div className="relative">
              <h2 className="font-serif text-4xl md:text-6xl mb-6 leading-tight">
                Первый урок — <span className="italic text-accent">бесплатно</span>
              </h2>
              <p className="text-background/70 max-w-xl mx-auto mb-10">
                Познакомимся, определим ваш уровень и составим персональный план. Без обязательств.
              </p>
              <button className="group bg-background text-foreground px-8 py-4 rounded-full font-medium inline-flex items-center gap-2 hover:bg-accent hover:text-accent-foreground transition-all duration-300">
                Записаться сейчас
                <Icon name="ArrowRight" size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-12">
        <div className="container max-w-6xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center text-background font-serif">L</div>
            <span className="font-semibold">Lingua</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#about" className="hover:text-foreground transition-colors">О преподавателе</a>
            <a href="#services" className="hover:text-foreground transition-colors">Услуги</a>
            <a href="#practice" className="hover:text-foreground transition-colors">Упражнения</a>
          </div>
          <div className="text-sm text-muted-foreground">© 2026 Lingua</div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
