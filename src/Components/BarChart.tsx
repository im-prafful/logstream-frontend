import React from "react";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

interface CategoryStatItem {
  lvl: string;
  tc: string;
}

interface BarChartProps {
  logsPerCategory: CategoryStatItem[];
  getLevelColor: (level: string) => string;
}

const BarChart: React.FC<BarChartProps> = ({ logsPerCategory, getLevelColor }) => {
  const maxCount = Math.max(...logsPerCategory.map((cat) => parseInt(cat.tc)), 1);

  return (
    <motion.div
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-full"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-8 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-purple-600" /> Comparison
      </h3>
      <div className="space-y-5">
        {logsPerCategory.map((cat, idx) => (
          <motion.div
            key={idx}
            className="space-y-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className="flex justify-between text-xs font-bold text-gray-600 uppercase">
              <span>{cat.lvl}</span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.1 + 0.3 }}
              >
                {cat.tc}
              </motion.span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full"
                style={{ backgroundColor: getLevelColor(cat.lvl) }}
                initial={{ width: 0 }}
                animate={{ width: `${(parseInt(cat.tc) / maxCount) * 100}%` }}
                transition={{ duration: 1, delay: idx * 0.1, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default BarChart;
