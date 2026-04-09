import React from "react";
import { motion } from "framer-motion";
import { Layers } from "lucide-react";

interface CategoryStatItem {
  lvl: string;
  tc: string;
}

interface PieChartProps {
  logsPerCategory: CategoryStatItem[];
  totalLogs: number;
  getLevelColor: (level: string) => string;
  containerVariants: any;
  itemVariants: any;
}

const PieChart: React.FC<PieChartProps> = ({
  logsPerCategory,
  totalLogs,
  getLevelColor,
  containerVariants,
  itemVariants,
}) => {
  let cumulativePercent = 0;
  const gradientSlices = logsPerCategory
    .map((cat) => {
      const percent = totalLogs ? (parseInt(cat.tc) / totalLogs) * 100 : 0;
      const start = cumulativePercent;
      cumulativePercent += percent;
      return `${getLevelColor(cat.lvl)} ${start}% ${cumulativePercent}%`;
    })
    .join(", ");

  return (
    <motion.div
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-full"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-8 flex items-center gap-2">
        <Layers className="w-4 h-4 text-purple-600" /> Distribution
      </h3>
      <div className="flex flex-col items-center">
        <motion.div
          className="relative w-48 h-48 rounded-full shadow-inner mb-8"
          style={{ background: `conic-gradient(${gradientSlices})` }}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: "spring" }}
        >
          <div className="absolute inset-8 bg-white rounded-full flex flex-col items-center justify-center shadow-lg">
            <motion.span
              className="text-2xl font-black text-gray-800"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {totalLogs}
            </motion.span>
            <span className="text-[10px] text-gray-400 uppercase font-bold">Total Logs</span>
          </div>
        </motion.div>
        <motion.div
          className="w-full grid grid-cols-2 gap-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {logsPerCategory.map((cat, idx) => (
            <motion.div
              key={idx}
              className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
              variants={itemVariants}
              whileHover={{ backgroundColor: "#f3f4f6", scale: 1.05 }}
            >
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getLevelColor(cat.lvl) }} />
              <span className="text-xs font-medium text-gray-600 capitalize">{cat.lvl}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PieChart;
