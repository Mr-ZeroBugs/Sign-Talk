import { motion } from "framer-motion";
import { Link } from "wouter";
import { Languages, BookOpen, ArrowRight, Heart } from "lucide-react";

const features = [
  {
    href: "/translate",
    icon: Languages,
    title: "แปลภาษามือ",
    sub: "Sign → Text",
    desc: "ยกมือขึ้น แล้วให้กล้องอ่านท่าทางของคุณเป็นคำพูด",
    gradient: "from-[#F06292] to-[#c94f7e]",
    lightBg: "#FFF5F8",
    border: "#f9c5d5",
    accent: "#F06292",
  },
  {
    href: "/talk-to-sign",
    icon: BookOpen,
    title: "คลังท่าทาง",
    sub: "Text → Sign",
    desc: "ค้นหาและเรียนรู้ท่าทางภาษามือที่คุณต้องการ",
    gradient: "from-[#4DB6AC] to-[#2e8f86]",
    lightBg: "#F0FAF9",
    border: "#b2dfdb",
    accent: "#4DB6AC",
  },
];

const steps = [
  {
    num: "01",
    title: "เปิดกล้อง",
    desc: "อนุญาตให้แอปเข้าถึงกล้อง",
    img: "/step1_camera.png"
  },
  {
    num: "02",
    title: "ทำท่าทาง",
    desc: "แสดงท่ามือต่อหน้ากล้อง",
    img: "/step2_hand.png"
  },
  {
    num: "03",
    title: "ได้ผลลัพธ์",
    desc: "ข้อความปรากฏขึ้นทันที",
    img: "/step3_bubble.png"
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FCFBF7] selection:bg-[#F06292] selection:text-white">

      {/* Soft background blobs — very subtle */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-15%] w-[50%] h-[50%] rounded-full bg-pink-100/30 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full bg-teal-100/25 blur-[130px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6">

        {/* ── Hero ── */}
        <section className="pt-24 pb-16 md:pt-32 md:pb-24">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 items-center">

            {/* Left Column: Text Content */}
            <div className="md:col-span-7 text-center md:text-left order-2 md:order-1">
              <motion.p
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 mb-6 md:mb-8"
              >
                Sign Language · Thai · Real-time
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl sm:text-6xl md:text-[82px] font-black text-slate-900 tracking-tighter leading-[0.9] mb-8"
              >
                สื่อสาร<span className="text-slate-300">ไร้กังวล</span><br />
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(135deg, #F06292, #c94f7e)" }}
                >
                  สนุกไปกับภาษามือ
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-lg text-slate-400 font-medium max-w-md mx-auto md:mx-0 leading-relaxed mb-10 md:mb-12"
              >
                เปลี่ยนทุกการเคลื่อนไหวของมือให้กลายเป็นเสียง<br className="hidden md:block" />ที่ทุกคนเข้าใจ
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.7 }}
                className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4"
              >
                <Link href="/translate">
                  <motion.div
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2.5 px-8 py-4 rounded-2xl text-white font-extrabold text-sm cursor-pointer shadow-[0_8px_30px_-6px_rgba(240,98,146,0.45)]"
                    style={{ background: "linear-gradient(135deg, #F06292, #c94f7e)" }}
                  >
                    <Languages className="w-4 h-4" />
                    เริ่มแปลภาษามือ
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </Link>
                <Link href="/talk-to-sign">
                  <motion.div
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2.5 px-8 py-4 rounded-2xl text-slate-600 font-extrabold text-sm cursor-pointer border-2 border-slate-200 bg-white/60 hover:border-slate-300 transition-colors"
                  >
                    <BookOpen className="w-4 h-4" />
                    สำรวจคลังท่าทาง
                  </motion.div>
                </Link>
              </motion.div>
            </div>

            {/* Right Column: Illustration */}
            <div className="md:col-span-5 flex justify-center items-center order-1 md:order-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="relative inline-flex items-center justify-center"
              >
                {/* Soft decorative glow */}
                <div className="absolute inset-0 bg-pink-200/25 blur-[100px] rounded-full scale-150" />

                <div className="relative z-10 w-64 h-64 sm:w-80 sm:h-80 md:w-full md:aspect-square rounded-[56px] overflow-hidden shadow-[30px_30px_70px_rgba(0,0,0,0.04),-15px_-15px_60px_rgba(255,255,255,0.9)] border-[12px] border-white/60">
                  <img
                    src="/hero_cute.png"
                    alt="Sign Language Illustration"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Floating accent orb */}
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-4 -right-4 w-14 h-14 bg-white rounded-3xl shadow-xl flex items-center justify-center z-20 border border-slate-50"
                >
                  <Heart className="w-7 h-7 text-pink-400 fill-current" />
                </motion.div>
              </motion.div>
            </div>

          </div>
        </section>

        {/* ── Feature Cards ── */}
        <section className="pb-20 grid grid-cols-1 md:grid-cols-2 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.href}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12, duration: 0.7 }}
              viewport={{ once: true, margin: "-40px" }}
            >
              <Link href={f.href}>
                <motion.div
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.99 }}
                  className="group relative rounded-[32px] p-8 overflow-hidden cursor-pointer border transition-shadow duration-400 hover:shadow-[0_20px_50px_-16px_rgba(0,0,0,0.1)]"
                  style={{ background: f.lightBg, borderColor: f.border }}
                >
                  {/* Icon */}
                  <div
                    className="h-14 w-14 rounded-2xl flex items-center justify-center mb-6 shadow-md"
                    style={{ background: `linear-gradient(135deg, ${f.accent}, ${f.accent}cc)` }}
                  >
                    <f.icon className="h-7 w-7 text-white" />
                  </div>

                  {/* Badge */}
                  <span
                    className="text-[10px] font-black uppercase tracking-[0.25em] px-2.5 py-1 rounded-full bg-white/70 border mb-4 inline-block"
                    style={{ color: f.accent, borderColor: `${f.accent}40` }}
                  >
                    {f.sub}
                  </span>

                  <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-3">
                    {f.title}
                  </h2>
                  <p className="text-slate-500 font-semibold text-sm leading-relaxed mb-8">
                    {f.desc}
                  </p>

                  {/* Arrow */}
                  <div
                    className="flex items-center gap-2 text-sm font-black tracking-wide group-hover:gap-3 transition-all"
                    style={{ color: f.accent }}
                  >
                    ลองเลย <ArrowRight className="w-4 h-4" />
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </section>

        {/* ── How it works ── */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-40px" }}
          className="pb-24"
        >
          <div className="text-center mb-12">
            <p className="text-xs font-black uppercase tracking-[0.35em] text-slate-300 mb-4">
              วิธีใช้งาน
            </p>
            <h2 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tighter">
              ง่ายแค่ 3 ขั้นตอน
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="relative bg-white/50 border border-slate-100 rounded-[32px] p-8 group overflow-hidden"
              >
                {/* Step Image */}
                <div className="relative h-40 w-full mb-6 flex items-center justify-center">
                  <div className={`absolute inset-0 opacity-10 blur-2xl rounded-full scale-75 group-hover:scale-110 transition-transform duration-700 ${i === 0 ? "bg-blue-400" : i === 1 ? "bg-pink-400" : "bg-teal-400"
                    }`} />
                  <img
                    src={s.img}
                    alt={s.title}
                    className="h-32 w-32 object-contain relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
                  />
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <span className="text-xl font-black text-slate-200 tracking-tighter leading-none">
                    {s.num}
                  </span>
                  <h3 className="text-xl font-black text-slate-800 tracking-tight">
                    {s.title}
                  </h3>
                </div>
                <p className="text-slate-400 font-semibold text-sm leading-relaxed">
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── Footer ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="pb-16 text-center border-t border-slate-100 pt-14"
        >
          <div className="flex items-center justify-center gap-2.5 mb-4">
            <div className="h-10 w-10 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-center">
              <Heart className="w-5 h-5 text-[#F06292] fill-current" />
            </div>
            <p className="text-lg font-black text-slate-700 tracking-tight">
              ร่วมเป็นส่วนหนึ่งของการสื่อสารที่เท่าเทียม
            </p>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300">
            SignTalk Project · 2026
          </p>
        </motion.div>

      </div>
    </div>
  );
}
