'use client'

import { motion } from 'framer-motion'
import type { WeddingInfo } from '@/types'

export default function CoupleSection({ info }: { info: WeddingInfo }) {
  return (
    <section className="py-24 bg-cream-50">
      <div className="max-w-4xl mx-auto px-6">

        {/* Bismillah */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="font-serif text-2xl text-gold-600 mb-4">
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
          </p>
          <p className="font-sans text-stone-500 text-sm max-w-md mx-auto leading-relaxed">
            Dengan memohon rahmat dan ridha Allah SWT, kami bermaksud
            menyelenggarakan pernikahan putra-putri kami
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* Groom */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-center"
          >
            <div className="relative w-48 h-48 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-2 border-gold-300 scale-110" />
              <div className="w-full h-full rounded-full overflow-hidden bg-stone-100">
                <div className="w-full h-full flex items-center justify-center bg-gold-50">
                  <span className="font-script text-6xl text-gold-300">
                    {info.groom_name[0]}
                  </span>
                </div>
              </div>
            </div>
            <h3 className="font-script text-5xl text-stone-800 mb-1">
              {info.groom_full_name}
            </h3>
            <div className="w-8 h-px bg-gold-400 mx-auto my-3" />
            <p className="font-sans text-stone-500 text-sm">{info.groom_parents}</p>
          </motion.div>

          {/* Bride */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-center"
          >
            <div className="relative w-48 h-48 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-2 border-gold-300 scale-110" />
              <div className="w-full h-full rounded-full overflow-hidden bg-stone-100">
                <div className="w-full h-full flex items-center justify-center bg-rose-50">
                  <span className="font-script text-6xl text-rose-300">
                    {info.bride_name[0]}
                  </span>
                </div>
              </div>
            </div>
            <h3 className="font-script text-5xl text-stone-800 mb-1">
              {info.bride_full_name}
            </h3>
            <div className="w-8 h-px bg-gold-400 mx-auto my-3" />
            <p className="font-sans text-stone-500 text-sm">{info.bride_parents}</p>
          </motion.div>

        </div>

        {/* Connecting symbol */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <div className="ornament-divider">
            <span className="font-script text-5xl text-gold-500">&amp;</span>
          </div>
        </motion.div>

      </div>
    </section>
  )
}