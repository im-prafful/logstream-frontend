import React from "react";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";

interface CategoryStatItem {
  lvl: string;
  tc: string;
}

interface CategoryStatsProps {
  logsPerCategory: CategoryStatItem[];
  totalLogs: number;
  getLevelColor: (level: string) => string;
  getLevelBgColor: (level: string) => string;
  containerVariants: any;
  itemVariants: any;
}

const CategoryStats: React.FC<CategoryStatsProps> = ({
  logsPerCategory,
  totalLogs,
  getLevelColor,
  getLevelBgColor,
  containerVariants,
  itemVariants,
}) => {
  const getCardGradientClass = (level: string) => {
    const normalized = level?.toLowerCase();
    if (normalized === "information") return "from-blue-100 via-white to-blue-50";
    if (normalized === "warning") return "from-amber-100 via-white to-amber-50";
    if (normalized === "debug") return "from-violet-100 via-white to-violet-50";
    if (normalized === "error") return "from-rose-100 via-white to-rose-50";
    return "from-slate-100 via-white to-slate-50";
  };

  const getCardRingClass = (level: string) => {
    const normalized = level?.toLowerCase();
    if (normalized === "information") return "ring-blue-200/70";
    if (normalized === "warning") return "ring-amber-200/70";
    if (normalized === "debug") return "ring-violet-200/70";
    if (normalized === "error") return "ring-rose-200/70";
    return "ring-slate-200/70";
  };

  return (
    <motion.div
      className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {logsPerCategory.map((cat, idx) => {
        const percentage = totalLogs
          ? ((parseInt(cat.tc) / totalLogs) * 100).toFixed(1)
          : "0.0";

        return (
          <motion.div
            key={idx}
            className={`bg-gradient-to-br ${getCardGradientClass(cat.lvl)} rounded-xl p-5 shadow-sm border border-gray-100 ring-1 ${getCardRingClass(cat.lvl)}`}
            variants={itemVariants}
            whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between mb-3">
              <span
                className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
                style={{ color: getLevelColor(cat.lvl), backgroundColor: getLevelBgColor(cat.lvl) }}
              >
                {cat.lvl}
              </span>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                <Activity className="w-4 h-4" style={{ color: getLevelColor(cat.lvl) }} />
              </motion.div>
            </div>
            <motion.div
              className="text-3xl font-bold text-gray-800"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: idx * 0.1 + 0.3, type: "spring", stiffness: 200 }}
            >
              {cat.tc}
            </motion.div>
            <div className="text-xs text-gray-400 mt-1">{percentage}% of total volume</div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default CategoryStats;
