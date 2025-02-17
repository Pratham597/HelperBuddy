import { motion } from "framer-motion"
import Image from "next/legacy/image"


export default function BlogCard({ blog }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
      className="relative h-96 rounded-xl overflow-hidden shadow-lg group cursor-pointer"
    >
      <Image
        src={blog.image || "/placeholder.svg"}
        alt={blog.title}
        layout="fill"
        objectFit="cover"
        className="transition-transform duration-300 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-70 group-hover:opacity-80 transition-opacity duration-300"></div>
      <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
        <motion.h2
          className="text-2xl font-bold mb-2 leading-tight"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {blog.title}
        </motion.h2>
        <motion.p
          className="text-sm mb-4 opacity-80"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          By {blog.author.name}
        </motion.p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white text-black font-bold py-2 px-4 rounded-full w-max text-sm transition-colors duration-300 hover:bg-gray-200"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Read More
        </motion.button>
      </div>
    </motion.div>
  )
}

